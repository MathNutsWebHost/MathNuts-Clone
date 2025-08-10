import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: NextRequest) {
  const clientId = process.env.GMAIL_CLIENT_ID
  const clientSecret = process.env.GMAIL_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Missing GMAIL_CLIENT_ID or GMAIL_CLIENT_SECRET" }, { status: 500 })
  }

  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const savedState = cookies().get("google_oauth_state")?.value

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.json({ error: "Invalid or missing OAuth state/code" }, { status: 400 })
  }

  // Clear the state cookie
  cookies().set("google_oauth_state", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 })

  const { origin } = url
  const redirectUri = `${origin}/api/google/oauth2/callback`

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  })

  if (!tokenRes.ok) {
    const info = await tokenRes.text()
    return NextResponse.json({ error: `Failed to exchange code: ${info}` }, { status: 500 })
  }

  const json = await tokenRes.json()
  // We need the refresh_token to send mail server-side in the future
  const refreshToken: string | undefined = json.refresh_token

  if (!refreshToken) {
    // If refresh_token is empty, it likely means consent was already granted without prompt=consent
    // Ask the user to revoke/try again or ensure prompt=consent was used.
    const html = `
<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Google OAuth – No Refresh Token</title></head>
  <body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
    <main style="max-width:680px;margin:40px auto;padding:0 16px;">
      <h1>No refresh token returned</h1>
      <p>Google did not return a refresh_token. This usually happens if the user previously approved the app without forcing a new consent screen.</p>
      <ol>
        <li>Go to <a href="https://myaccount.google.com/permissions" target="_blank">Google Account &gt; Security &gt; Third‑party access</a> and remove the app permissions.</li>
        <li>Try again: <a href="${origin}/api/google/oauth2/start">${origin}/api/google/oauth2/start</a></li>
      </ol>
    </main>
  </body>
</html>`
    return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } })
  }

  const html = `
<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Google OAuth – Refresh Token</title></head>
  <body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
    <main style="max-width:680px;margin:40px auto;padding:0 16px;">
      <h1>Copy your refresh token</h1>
      <p>Add this value as an environment variable in Vercel:</p>
      <pre style="white-space:pre-wrap;word-break:break-all;background:#f6f8fa;border:1px solid #e5e7eb;border-radius:8px;padding:12px;">GMAIL_REFRESH_TOKEN=${refreshToken}</pre>
      <p>After saving the env var, redeploy your project. You can now submit the application form and it will send via Gmail.</p>
    </main>
  </body>
</html>`
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } })
}
