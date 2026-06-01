import type { NextRequest } from "next/server"

/**
 * Resolve the exact OAuth redirect URI that must match what is registered
 * in the Google Cloud Console under "Authorized redirect URIs".
 *
 * Resolution order:
 * 1. GOOGLE_OAUTH_REDIRECT_URI env var (most reliable - set this to the
 *    exact value registered in Google, e.g.
 *    https://mathnuts.org/api/google/oauth2/callback)
 * 2. The public, forwarded host/proto headers (works behind Vercel proxy so
 *    that mathnuts.org is used instead of the ephemeral *.vercel.app URL).
 * 3. Fall back to the request URL origin.
 */
export function getGoogleRedirectUri(req: NextRequest): string {
  const envOverride = process.env.GOOGLE_OAUTH_REDIRECT_URI
  if (envOverride) {
    return envOverride
  }

  const forwardedHost = req.headers.get("x-forwarded-host") ?? req.headers.get("host")
  const forwardedProto = req.headers.get("x-forwarded-proto") ?? "https"

  const origin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : new URL(req.url).origin

  return `${origin}/api/google/oauth2/callback`
}
