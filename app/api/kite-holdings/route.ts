import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const KITE_API_KEY = process.env.KITE_API_KEY;
  const KITE_API_SECRET = process.env.KITE_API_SECRET;
  if (!KITE_API_KEY || !KITE_API_SECRET) {
    throw new Error("KITE_API_KEY and KITE_API_SECRET must be set in your environment variables (.env.local)");
  }
  try {
    const { request_token } = await req.json();
    if (!request_token) {
      return NextResponse.json({ error: "Missing request_token" }, { status: 400 });
    }

    // Step 1: Exchange request_token for access_token
    const sessionRes = await fetch("https://api.kite.trade/session/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        api_key: KITE_API_KEY as string,
        request_token,
        api_secret: KITE_API_SECRET as string,
      }).toString(),
    });
    const sessionData = await sessionRes.json();
    if (!sessionData.access_token) {
      return NextResponse.json({ error: sessionData.message || "Failed to get access token" }, { status: 400 });
    }

    // Step 2: Fetch holdings
    const holdingsRes = await fetch("https://api.kite.trade/portfolio/holdings", {
      headers: {
        Authorization: `token ${KITE_API_KEY}:${sessionData.access_token}`,
      },
    });
    const holdingsData = await holdingsRes.json();
    if (!holdingsData.data) {
      return NextResponse.json({ error: holdingsData.message || "Failed to fetch holdings" }, { status: 400 });
    }

    return NextResponse.json({ holdings: holdingsData.data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}

// To use environment variables, add the following to your .env.local file (not committed to git):
// KITE_API_KEY=your_kite_api_key
// KITE_API_SECRET=your_real_kite_api_secret 