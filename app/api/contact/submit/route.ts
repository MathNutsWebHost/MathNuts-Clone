import { NextResponse, type NextRequest } from "next/server"

type Env = {
  GMAIL_CLIENT_ID?: string
  GMAIL_CLIENT_SECRET?: string
  GMAIL_REFRESH_TOKEN?: string
  GMAIL_RECIPIENT_EMAIL?: string
  GMAIL_SENDER_EMAIL?: string
}

function base64Url(input: string | Buffer) {
  const b64 = Buffer.isBuffer(input) ? input.toString("base64") : Buffer.from(input).toString("base64")
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

export async function POST(req: NextRequest) {
  try {
    const env: Env = {
      GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID,
      GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET,
      GMAIL_REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN,
      GMAIL_RECIPIENT_EMAIL: process.env.GMAIL_RECIPIENT_EMAIL,
      GMAIL_SENDER_EMAIL: process.env.GMAIL_SENDER_EMAIL,
    }

    const missing = Object.entries({
      GMAIL_CLIENT_ID: env.GMAIL_CLIENT_ID,
      GMAIL_CLIENT_SECRET: env.GMAIL_CLIENT_SECRET,
      GMAIL_REFRESH_TOKEN: env.GMAIL_REFRESH_TOKEN,
      GMAIL_SENDER_EMAIL: env.GMAIL_SENDER_EMAIL,
    })
      .filter(([, v]) => !v)
      .map(([k]) => k)

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Email is not configured. Missing environment variables: ${missing.join(", ")}` },
        { status: 500 },
      )
    }

    const RECIPIENT = env.GMAIL_RECIPIENT_EMAIL || "mathnutscontroller@gmail.com"

    const form = await req.formData()

    const firstName = (form.get("firstName") as string | null) || ""
    const lastName = (form.get("lastName") as string | null) || ""
    const email = (form.get("email") as string | null) || ""
    const message = (form.get("message") as string | null) || ""

    // Validate required email field
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 })
    }

    // Exchange refresh token for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.GMAIL_CLIENT_ID!,
        client_secret: env.GMAIL_CLIENT_SECRET!,
        refresh_token: env.GMAIL_REFRESH_TOKEN!,
        grant_type: "refresh_token",
      }),
      cache: "no-store",
    })

    if (!tokenRes.ok) {
      const info = await tokenRes.text()
      return NextResponse.json({ error: `Failed to get access token: ${info}` }, { status: 500 })
    }
    const tokenJson = (await tokenRes.json()) as { access_token?: string }
    const accessToken = tokenJson.access_token
    if (!accessToken) {
      return NextResponse.json({ error: "No access token received from Google." }, { status: 500 })
    }

    const accountEmail = env.GMAIL_SENDER_EMAIL!
    const replyTo = email || accountEmail

    // Build email text body
    const lines = [
      "New Contact Form Submission from MathNuts Website",
      "",
      `Name: ${firstName} ${lastName}`.trim(),
      `Email: ${email}`,
      "",
      "Message:",
      message || "(No message provided)",
      "",
      "---",
      "This message was sent from the Get in Touch form on the MathNuts website.",
    ].join("\r\n")

    const headers = [
      `From: ${accountEmail}`,
      `To: ${RECIPIENT}`,
      `Reply-To: ${replyTo}`,
      `Subject: ${encodeURIComponent(`Contact Form - ${firstName} ${lastName}`.trim() || "Website Contact").replace(
        /%20/g,
        " ",
      )}`,
      "MIME-Version: 1.0",
      'Content-Type: text/plain; charset="UTF-8"',
      "Content-Transfer-Encoding: 7bit",
      "",
      lines,
    ]

    const emailMsg = headers.join("\r\n")
    const raw = base64Url(emailMsg)

    const sendRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    })

    if (!sendRes.ok) {
      const info = await sendRes.text()
      return NextResponse.json({ error: `Failed to send email: ${info}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unexpected error" }, { status: 500 })
  }
}
