import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const GROWW_API_KEY = process.env.GROWW_API_KEY;
  const GROWW_API_SECRET = process.env.GROWW_API_SECRET;
  
  if (!GROWW_API_KEY || !GROWW_API_SECRET) {
    return NextResponse.json({ 
      error: "GROWW_API_KEY and GROWW_API_SECRET must be set in your environment variables (.env.local)" 
    }, { status: 400 });
  }

  try {
    const { access_token } = await req.json();
    
    if (!access_token) {
      return NextResponse.json({ error: "Missing access_token" }, { status: 400 });
    }

    // Fetch holdings from Groww API
    const holdingsRes = await fetch("https://api.groww.in/v1/portfolio/holdings", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": "application/json",
        "X-API-KEY": GROWW_API_KEY,
      },
    });

    let holdingsData;
    if (!holdingsRes.ok) {
      const rawText = await holdingsRes.text();
      return NextResponse.json({
        error: "Failed to fetch holdings from Groww (non-200 response)",
        status: holdingsRes.status,
        statusText: holdingsRes.statusText,
        raw: rawText
      }, { status: 400 });
    } else {
      try {
        holdingsData = await holdingsRes.json();
      } catch (err) {
        const rawText = await holdingsRes.text();
        return NextResponse.json({
          error: "Failed to parse Groww holdings response as JSON",
          status: holdingsRes.status,
          statusText: holdingsRes.statusText,
          raw: rawText
        }, { status: 400 });
      }
    }

    if (!holdingsData.data) {
      return NextResponse.json({ 
        error: holdingsData.message || "Failed to fetch Groww holdings", 
        groww_response: holdingsData,
        status: holdingsRes.status,
        statusText: holdingsRes.statusText
      }, { status: 400 });
    }

    return NextResponse.json({ holdings: holdingsData.data });
  } catch (e: any) {
    return NextResponse.json({ 
      error: e.message || "Unknown error", 
      stack: e.stack || null,
      raw: e
    }, { status: 500 });
  }
}

// To use environment variables, add the following to your .env.local file (not committed to git):
// GROWW_API_KEY=your_groww_api_key
// GROWW_API_SECRET=your_groww_api_secret

