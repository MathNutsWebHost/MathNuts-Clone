import { NextResponse, type NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const clientId = process.env.GMAIL_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: "Missing GMAIL_CLIENT_ID" }, { status: 500 })
  }

  const { origin } = new URL(req.url)
  const redirectUri = `${origin}/api/google/oauth2/callback`

  // Generate state and attach it as a secure cookie on the redirect response
  const state = crypto.randomUUID()

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/gmail.send",
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  })

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  const res = NextResponse.redirect(url)
  res.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60, // 10 minutes
  })
  return res
}
