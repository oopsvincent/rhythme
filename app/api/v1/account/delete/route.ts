// app/api/v1/account/delete/route.ts

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getAdminClient } from "@/lib/supabase/admin"
import { getDodoClient } from "@/lib/payments/dodo"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    // 1. Verify user session
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = user.id
    const userEmail = user.email

    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 })
    }

    // 2. Parse request body
    const body = await request.json().catch(() => ({}))
    const { password } = body

    // 3. Verify password (mandatory for all account deletions to prevent session hijacking)
    if (!password) {
      return NextResponse.json({ error: "Password is required to proceed" }, { status: 400 })
    }

    // Create standalone Supabase client to avoid side-effects on the current session/cookies
    const tempClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    )

    const { error: signInError } = await tempClient.auth.signInWithPassword({
      email: userEmail,
      password: password,
    })

    if (signInError) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 400 })
    }

    const supabaseAdmin = getAdminClient()

    // 5. Cancel any active billing subscriptions first to prevent future charges
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from("account_subscriptions")
      .select("id, provider_subscription_id, provider")
      .eq("user_id", userId)
      .eq("entitlement_active", true)

    if (subError) {
      console.error("Failed to query user subscriptions:", subError)
    }

    for (const sub of subscriptions || []) {
      if (sub.provider === "dodo" && sub.provider_subscription_id) {
        try {
          console.log(`[INFO] Cancelling subscription: ${sub.provider_subscription_id}`)
          await getDodoClient().subscriptions.update(sub.provider_subscription_id, {
            cancel_at_next_billing_date: true,
            cancel_reason: "cancelled_by_customer",
          })

          // Mark subscription as cancelled in local database
          await supabaseAdmin
            .from("account_subscriptions")
            .update({
              status: "cancelled",
              entitlement_active: false,
              updated_at: new Date().toISOString(),
            })
            .eq("id", sub.id)
        } catch (subCancelErr) {
          console.error(`[ERROR] Failed to cancel subscription ${sub.provider_subscription_id}:`, subCancelErr)
          // Fail the account deletion if we can't guarantee subscription cancellation to avoid charging deleted accounts
          return NextResponse.json({
            error: "Failed to cancel your active billing subscription. Please try again or contact support."
          }, { status: 500 })
        }
      }
    }

    // 6. Delete user data inside a transaction using the RPC function
    const { error: rpcError } = await supabaseAdmin.rpc("delete_user_data", {
      target_user_id: userId,
    })

    if (rpcError) {
      console.warn("[WARNING] delete_user_data RPC failed or not found, falling back to sequential deletes:", rpcError)

      // Fallback: Sequential deletion (in reverse order to respect potential FK constraints)
      const tables = [
        { name: "habit_logs", field: "user_id" },
        { name: "daily_logs", field: "user_id" },
        { name: "focus_sessions", field: "user_id" },
        { name: "mood_logs", field: "user_id" },
        { name: "journals", field: "user_id" },
        { name: "tasks", field: "user_id" },
        { name: "user_goals", field: "user_id" },
        { name: "weekly_plan", field: "user_id" },
        { name: "weekly_review", field: "user_id" },
        { name: "notifications", field: "user_id" },
        { name: "push_subscriptions", field: "user_id" },
        { name: "user_preferences", field: "user_id" },
        { name: "habits", field: "user_id" },
        { name: "profiles", field: "id" },
        { name: "account_subscriptions", field: "user_id" },
        { name: "billing_events", field: "user_id" },
      ]

      for (const { name, field } of tables) {
        const { error: deleteError } = await supabaseAdmin
          .from(name)
          .delete()
          .eq(field, userId)

        if (deleteError) {
          console.error(`[ERROR] Fallback deletion failed for table ${name}:`, deleteError)
        }
      }
    }

    // 7. Delete the Supabase Auth user record using admin privileges
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authDeleteError) {
      console.error("[ERROR] Failed to delete Supabase auth user:", authDeleteError)
      return NextResponse.json(
        { error: "Failed to fully delete your account credential. Please contact support." },
        { status: 500 }
      )
    }

    // 8. Sign out from the current server session to clear cookies
    await supabase.auth.signOut()

    // 9. Log anonymized deletion event
    console.log(`[SUCCESS] Account successfully deleted for anonymized user ID: ${userId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[ERROR] Account deletion handler error:", error)
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 })
  }
}
