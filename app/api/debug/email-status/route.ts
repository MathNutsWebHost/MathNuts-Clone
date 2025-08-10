import { NextResponse } from "next/server"

export async function GET() {
  const hasClientId = !!process.env.GMAIL_CLIENT_ID
  const hasClientSecret = !!process.env.GMAIL_CLIENT_SECRET
  const hasRefreshToken = !!process.env.GMAIL_REFRESH_TOKEN

  const result: {
    env: {
      GMAIL_CLIENT_ID: boolean
      GMAIL_CLIENT_SECRET: boolean
      GMAIL_REFRESH_TOKEN: boolean
      GMAIL_RECIPIENT_EMAIL?: string | null
      vercelEnv?: string | null
    }
    token?: { ok: boolean; error?: string }
    profile?: { ok: boolean; emailAddress?: string; error?: string }
    timestamp: string
  } = {
    env: {
      GMAIL_CLIENT_ID: hasClientId,
      GMAIL_CLIENT_SECRET: hasClientSecret,
      GMAIL_REFRESH_TOKEN: hasRefreshToken,
      GMAIL_RECIPIENT_EMAIL: process.env.GMAIL_RECIPIENT_EMAIL || null,
      vercelEnv: process.env.VERCEL_ENV || null,
    },
    timestamp: new Date().toISOString(),
  }

  if (!hasClientId || !hasClientSecret || !hasRefreshToken) {
    return NextResponse.json(result)
  }

  try {
    // Exchange refresh token for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GMAIL_CLIENT_ID!,
        client_secret: process.env.GMAIL_CLIENT_SECRET!,
        refresh_token: process.env.GMAIL_REFRESH_TOKEN!,
        grant_type: "refresh_token",
      }),
      cache: "no-store",
    })

    if (!tokenRes.ok) {
      const info = await tokenRes.text()
      result.token = { ok: false, error: info }
      return NextResponse.json(result, { status: 200 })
    }

    const tokenJson = (await tokenRes.json()) as { access_token?: string }
    const accessToken = tokenJson.access_token
    if (!accessToken) {
      result.token = { ok: false, error: "No access_token in token response" }
      return NextResponse.json(result, { status: 200 })
    }
    result.token = { ok: true }

    // Fetch Gmail profile to confirm sending identity
    const profileRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    })
    if (!profileRes.ok) {
      const info = await profileRes.text()
      result.profile = { ok: false, error: info }
      return NextResponse.json(result, { status: 200 })
    }
    const profile = (await profileRes.json()) as { emailAddress?: string }
    result.profile = { ok: true, emailAddress: profile.emailAddress }
    return NextResponse.json(result)
  } catch (err: any) {
    result.token = { ok: false, error: err?.message || "Unexpected error" }
    return NextResponse.json(result, { status: 200 })
  }
}
