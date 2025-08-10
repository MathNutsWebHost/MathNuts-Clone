import { NextResponse, type NextRequest } from "next/server"

type Env = {
  GMAIL_CLIENT_ID?: string
  GMAIL_CLIENT_SECRET?: string
  GMAIL_REFRESH_TOKEN?: string
  GMAIL_RECIPIENT_EMAIL?: string
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
    }

    if (!env.GMAIL_CLIENT_ID || !env.GMAIL_CLIENT_SECRET || !env.GMAIL_REFRESH_TOKEN) {
      return NextResponse.json(
        { error: "Email is not configured. Missing Gmail OAuth2 environment variables." },
        { status: 500 },
      )
    }

    const RECIPIENT = env.GMAIL_RECIPIENT_EMAIL || "mathnutscontroller@gmail.com"

    const form = await req.formData()

    const fields: Record<string, string> = {}
    for (const key of [
      "parentName",
      "studentName",
      "age",
      "schooling",
      "email",
      "phone",
      "recentBooks",
      "reading",
      "approachExamples",
      "courses",
      "contests",
      "clubs",
      "extra",
    ] as const) {
      const v = form.get(key)
      if (typeof v === "string") fields[key] = v
    }

    const attachment = form.get("attachment") as File | null
    if (attachment) {
      if (attachment.type !== "application/pdf") {
        return NextResponse.json({ error: "Attachment must be a PDF." }, { status: 400 })
      }
      const maxBytes = 10 * 1024 * 1024
      if (attachment.size > maxBytes) {
        return NextResponse.json({ error: "Attachment too large (max 10MB)." }, { status: 400 })
      }
    }

    // Exchange refresh token for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.GMAIL_CLIENT_ID,
        client_secret: env.GMAIL_CLIENT_SECRET,
        refresh_token: env.GMAIL_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
      cache: "no-store",
    })

    if (!tokenRes.ok) {
      const info = await tokenRes.text()
      return NextResponse.json({ error: `Failed to get access token: ${info}` }, { status: 500 })
    }
    const tokenJson = (await tokenRes.json()) as { access_token: string }
    const accessToken = tokenJson.access_token
    if (!accessToken) {
      return NextResponse.json({ error: "No access token received from Google." }, { status: 500 })
    }

    // Get the authenticated Gmail account address for the From header
    const profileRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    })
    if (!profileRes.ok) {
      const info = await profileRes.text()
      return NextResponse.json({ error: `Failed to get Gmail profile: ${info}` }, { status: 500 })
    }
    const profile = (await profileRes.json()) as { emailAddress?: string }
    const accountEmail = profile.emailAddress
    if (!accountEmail) {
      return NextResponse.json({ error: "Could not determine sender email from Gmail profile." }, { status: 500 })
    }

    const applicantEmail = fields.email?.trim()
    const replyTo = applicantEmail || accountEmail

    // Build email text body
    const pretty = (label: string, value?: string) => `${label}: ${value || ""}`
    const lines = [
      "New MathNuts Application Submission",
      "",
      pretty("Parent Name", fields.parentName),
      pretty("Student Name", fields.studentName),
      pretty("Age", fields.age),
      pretty("Schooling", fields.schooling),
      pretty("Applicant Email", fields.email),
      pretty("Phone", fields.phone),
      "",
      pretty("Recent Math Books", fields.recentBooks),
      pretty("Reading Engagement", fields.reading),
      "",
      "Approach to Challenging Work:",
      fields.approachExamples || "",
      "",
      "Math Courses Completed:",
      fields.courses || "",
      "",
      "Competitions / Contests:",
      fields.contests || "",
      "",
      "Math Circles / Clubs / Events:",
      fields.clubs || "",
      "",
      "Additional Notes:",
      fields.extra || "",
    ].join("\r\n")

    const boundary = "mixed_" + Math.random().toString(36).slice(2)
    const headers = [
      `From: ${accountEmail}`,
      `To: ${RECIPIENT}`,
      `Reply-To: ${replyTo}`,
      `Subject: ${encodeURIComponent(
        `New Application - ${fields.studentName || "Student"} (${fields.parentName || "Parent"})`,
      ).replace(/%20/g, " ")}`,
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
      lines,
      "",
    ]

    let fileSection: string[] = []
    if (attachment) {
      const bytes = Buffer.from(await attachment.arrayBuffer())
      const fileBase64 = bytes.toString("base64")
      const safeFilename = (attachment.name || "attachment.pdf").replace(/[\r\n"]/g, "")
      fileSection = [
        `--${boundary}`,
        'Content-Type: application/pdf; name="' + safeFilename + '"',
        "MIME-Version: 1.0",
        'Content-Disposition: attachment; filename="' + safeFilename + '"',
        "Content-Transfer-Encoding: base64",
        "",
        fileBase64,
        "",
      ]
    }

    const closing = [`--${boundary}--`, ""]
    const emailMsg = [...headers, ...textPart, ...fileSection, ...closing].join("\r\n")
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
