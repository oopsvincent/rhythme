import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import webpush from "web-push"

// Initialize web-push with VAPID keys
// Notice we provide a default subject (mailto:) which is required by the web push protocol
webpush.setVapidDetails(
  "mailto:admin@rhythme.app",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
)

// Supabase webhook payloads have this structure
type WebhookPayload = {
  type: "INSERT" | "UPDATE" | "DELETE"
  table: string
  record: {
    notification_id: string
    user_id: string
    title: string
    message: string
    type: string
    is_read: boolean
    link: string | null
    created_at: string
  }
  schema: "public"
  old_record: null | any
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as WebhookPayload

    // Process both INSERT and UPDATE events for notifications
    if (!["INSERT", "UPDATE"].includes(payload.type) || !payload.record) {
      return NextResponse.json({ message: `Ignored: Not an INSERT or UPDATE event (got ${payload.type})` }, { status: 200 })
    }

    const { user_id, title, message, link, is_read } = payload.record

    // Do not notify for already read notifications
    if (is_read) {
      return NextResponse.json({ message: "Ignored: Notification is already marked as read" }, { status: 200 })
    }

    // We MUST use the service role key here to bypass RLS because this request 
    // comes from Supabase webhooks, not an authenticated frontend session.
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY!
    )

    // Fetch all active subscriptions for the user
    const { data: subscriptions, error } = await supabaseAdmin
      .from("push_subscriptions")
      .select("endpoint, p256dh_key, auth_key")
      .eq("user_id", user_id)

    if (error) {
      console.error("Error fetching subscriptions:", error)
      return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: "User has no active push subscriptions" }, { status: 200 })
    }

    // Format the payload to send to the browser
    const pushPayload = JSON.stringify({
      title: title,
      body: message,
      url: link || "/",
    })

    const sendPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh_key,
              auth: sub.auth_key,
            },
          },
          pushPayload
        )
      } catch (err: any) {
        // If the subscription is expired or invalid (HTTP 410 or 404),
        // we should delete it from our database to keep it clean.
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log(`Deleting expired subscription: ${sub.endpoint}`)
          await supabaseAdmin
            .from("push_subscriptions")
            .delete()
            .eq("endpoint", sub.endpoint)
        } else {
          console.error("Error sending push notification:", err)
        }
      }
    })

    await Promise.all(sendPromises)

    return NextResponse.json({ success: true, message: "Push notifications dispatched" })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
