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
    })
      .filter(([, v]) => !v)
      .map(([k]) => k)

    if (missing.length > 0) {
      return NextResponse.json(
        {
          error:
            "We're experiencing technical difficulties with our email system. Please try again later or contact us directly at mathnuts@googlegroups.com.",
        },
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

    // Server-side validation for required fields
    const requiredFields = {
      parentName: "Parent's Full Name",
      studentName: "Student's Full Name",
      email: "Email",
      recentBooks: "Recent books read in math",
      reading: "Rate this student's engagement in reading",
      approachExamples: "State specific examples, showing how your student approaches challenging work",
      courses: "Math courses completed",
      contests: "Competitions/Contests taken (and results)",
      clubs: "Math circle/clubs/events attended",
    }

    const missingFields = []
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!fields[field] || fields[field].trim() === "") {
        missingFields.push(label)
      }
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Please fill in the following required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      )
    }

    // Email validation
    if (!fields.email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 })
    }

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
      console.error("Token exchange failed:", info)
      return NextResponse.json(
        {
          error:
            "We're experiencing technical difficulties. Please try again later or contact us directly at mathnuts@googlegroups.com.",
        },
        { status: 500 },
      )
    }
    const tokenJson = (await tokenRes.json()) as { access_token?: string }
    const accessToken = tokenJson.access_token
    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "We're experiencing technical difficulties. Please try again later or contact us directly at mathnuts@googlegroups.com.",
        },
        { status: 500 },
      )
    }

    // Determine sender email without requiring extra scopes
    let accountEmail = env.GMAIL_SENDER_EMAIL?.trim()
    if (!accountEmail) {
      // Fallback to profile only if sender email is not configured.
      const profileRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      })
      if (!profileRes.ok) {
        return NextResponse.json(
          {
            error:
              "We're experiencing technical difficulties. Please try again later or contact us directly at mathnuts@googlegroups.com.",
          },
          { status: 500 },
        )
      }
      const profile = (await profileRes.json()) as { emailAddress?: string }
      accountEmail = profile.emailAddress || undefined
      if (!accountEmail) {
        return NextResponse.json(
          {
            error:
              "We're experiencing technical difficulties. Please try again later or contact us directly at mathnuts@googlegroups.com.",
          },
          { status: 500 },
        )
      }
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

    const subject = encodeURIComponent(
      `New Application - ${fields.studentName || "Student"} (${fields.parentName || "Parent"})`,
    ).replace(/%20/g, " ")

    const emailMsg = [
      `From: ${accountEmail}`,
      `To: ${RECIPIENT}`,
      `Reply-To: ${replyTo}`,
      `Subject: ${subject}`,
      "Content-Type: text/plain; charset=UTF-8",
      "",
      lines,
      "",
    ].join("\r\n")

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
      console.error("Email send failed:", info)
      return NextResponse.json(
        {
          error:
            "We're experiencing technical difficulties. Please try again later or contact us directly at mathnuts@googlegroups.com.",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("Application submission error:", err)
    return NextResponse.json(
      {
        error:
          "We're experiencing technical difficulties. Please try again later or contact us directly at mathnuts@googlegroups.com.",
      },
      { status: 500 },
    )
  }
}
