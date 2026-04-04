import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscription = await req.json()

    // Validate the PushSubscription object
    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: "Invalid subscription data" }, { status: 400 })
    }

    // Upsert the subscription (if endpoint exists, it might just fail the unique constraint or we can handle it)
    // Actually, their table has a unique constraint on endpoint. Let's do an upsert or standard insert holding ON CONFLICT DO NOTHING
    
    // Check if it already exists to avoid errors on duplicate subscriptions
    const { data: existing } = await supabase
      .from("push_subscriptions")
      .select("id")
      .eq("endpoint", subscription.endpoint)
      .single()

    if (existing) {
      // Just update it or ignore
      return NextResponse.json({ success: true, message: "Subscription already exists" })
    }

    const { error: insertError } = await supabase
      .from("push_subscriptions")
      .insert({
        user_id: userData.user.id,
        endpoint: subscription.endpoint,
        p256dh_key: subscription.keys.p256dh,
        auth_key: subscription.keys.auth,
      })

    if (insertError) {
      console.error("Database error saving push subscription:", insertError)
      return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in push subscribe route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const endpoint = body?.endpoint

    let query = supabase.from("push_subscriptions").delete().eq("user_id", userData.user.id)

    if (endpoint) {
      query = query.eq("endpoint", endpoint)
    }

    const { error: deleteError } = await query

    if (deleteError) {
      console.error("Database error deleting push subscription:", deleteError)
      return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Unsubscribed successfully" })
  } catch (error) {
    console.error("Error in push unsubscribe route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

