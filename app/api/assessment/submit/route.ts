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

    // Validate required env
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

    // Parse form
    const form = await req.formData()
    const firstName = (form.get("firstName") as string | null) || ""
    const lastName = (form.get("lastName") as string | null) || ""
    const email = (form.get("email") as string | null) || ""
    const message = (form.get("message") as string | null) || ""

    const attachment = form.get("attachment") as File | null
    if (!attachment) {
      return NextResponse.json({ error: "Please attach a single PDF file." }, { status: 400 })
    }
    if (attachment.type !== "application/pdf") {
      return NextResponse.json({ error: "Attachment must be a PDF." }, { status: 400 })
    }
    const maxBytes = 10 * 1024 * 1024
    if (attachment.size > maxBytes) {
      return NextResponse.json({ error: "Attachment too large (max 10MB)." }, { status: 400 })
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

    // Compose email
    const to = env.GMAIL_RECIPIENT_EMAIL || env.GMAIL_SENDER_EMAIL!
    const from = env.GMAIL_SENDER_EMAIL!
    const replyTo = email || from

    const subject = encodeURIComponent(
      `Assessment Upload - ${firstName || "First"} ${lastName || "Last"}`.trim(),
    ).replace(/%20/g, " ")

    const bodyLines = [
      "New Assessment Submission",
      "",
      `Student: ${firstName} ${lastName}`.trim(),
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\r\n")

    const boundary = "mixed_" + Math.random().toString(36).slice(2)
    const headers = [
      `From: ${from}`,
      `To: ${to}`,
      `Reply-To: ${replyTo}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      "",
    ]

    const textPart = [
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      "MIME-Version: 1.0",
      "Content-Transfer-Encoding: 7bit",
      "",
      bodyLines,
      "",
    ]

    const bytes = Buffer.from(await attachment.arrayBuffer())
    const fileBase64 = bytes.toString("base64")
    const safeFilename = (attachment.name || "assessment.pdf").replace(/[\r\n"]/g, "")

    const fileSection = [
      `--${boundary}`,
      `Content-Type: application/pdf; name="${safeFilename}"`,
      "MIME-Version: 1.0",
      `Content-Disposition: attachment; filename="${safeFilename}"`,
      "Content-Transfer-Encoding: base64",
      "",
      fileBase64,
      "",
    ]

    const closing = [`--${boundary}--`, ""]
    const emailMsg = [...headers, ...textPart, ...fileSection, ...closing].join("\r\n")
    const raw = base64Url(emailMsg)

    // Send via Gmail
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
