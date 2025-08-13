import { NextResponse } from "next/server"

export async function GET() {
  const env = {
    GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN,
    GMAIL_RECIPIENT_EMAIL: process.env.GMAIL_RECIPIENT_EMAIL,
    GMAIL_SENDER_EMAIL: process.env.GMAIL_SENDER_EMAIL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    NODE_ENV: process.env.NODE_ENV,
  }

  const result = {
    timestamp: new Date().toISOString(),
    environment: env.VERCEL_ENV || env.NODE_ENV || "unknown",
    variables: {
      GMAIL_CLIENT_ID: {
        exists: !!env.GMAIL_CLIENT_ID,
        length: env.GMAIL_CLIENT_ID?.length || 0,
        preview: env.GMAIL_CLIENT_ID ? `${env.GMAIL_CLIENT_ID.substring(0, 10)}...` : "NOT_SET",
      },
      GMAIL_CLIENT_SECRET: {
        exists: !!env.GMAIL_CLIENT_SECRET,
        length: env.GMAIL_CLIENT_SECRET?.length || 0,
        preview: env.GMAIL_CLIENT_SECRET ? `${env.GMAIL_CLIENT_SECRET.substring(0, 10)}...` : "NOT_SET",
      },
      GMAIL_REFRESH_TOKEN: {
        exists: !!env.GMAIL_REFRESH_TOKEN,
        length: env.GMAIL_REFRESH_TOKEN?.length || 0,
        preview: env.GMAIL_REFRESH_TOKEN ? `${env.GMAIL_REFRESH_TOKEN.substring(0, 10)}...` : "NOT_SET",
      },
      GMAIL_RECIPIENT_EMAIL: {
        exists: !!env.GMAIL_RECIPIENT_EMAIL,
        value: env.GMAIL_RECIPIENT_EMAIL || "NOT_SET",
      },
      GMAIL_SENDER_EMAIL: {
        exists: !!env.GMAIL_SENDER_EMAIL,
        value: env.GMAIL_SENDER_EMAIL || "NOT_SET",
      },
    },
    allVariablesSet: !!(env.GMAIL_CLIENT_ID && env.GMAIL_CLIENT_SECRET && env.GMAIL_REFRESH_TOKEN),
  }

  // Test token exchange if all required variables are present
  if (result.allVariablesSet) {
    try {
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

      result.tokenTest = {
        success: tokenRes.ok,
        status: tokenRes.status,
        error: tokenRes.ok ? null : await tokenRes.text(),
      }
    } catch (error: any) {
      result.tokenTest = {
        success: false,
        error: error.message,
      }
    }
  }

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  })
}
