import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  // Support both NEXT_PUBLIC_GROWW_API_KEY and GROWW_API_KEY for consistency
  const GROWW_API_KEY = (process.env.GROWW_API_KEY || process.env.NEXT_PUBLIC_GROWW_API_KEY)?.trim();
  const GROWW_API_SECRET = process.env.GROWW_API_SECRET?.trim();
  
  if (!GROWW_API_KEY || !GROWW_API_SECRET) {
    return NextResponse.json({ 
      error: "GROWW_API_KEY and GROWW_API_SECRET must be set in your environment variables (.env.local)",
      details: "Make sure you have both GROWW_API_KEY (or NEXT_PUBLIC_GROWW_API_KEY) and GROWW_API_SECRET set in .env.local file",
      has_api_key: !!GROWW_API_KEY,
      has_api_secret: !!GROWW_API_SECRET
    }, { status: 500 });
  }

  // Validate API key format
  if (GROWW_API_KEY === "your_api_key_here" || GROWW_API_KEY.includes("your_")) {
    return NextResponse.json({ 
      error: "API key appears to be a placeholder. Please replace it with your actual Groww API key.",
      details: "The API key in .env.local still contains placeholder text. Get your API key from Groww developer console"
    }, { status: 500 });
  }

  try {
    const { request_token, api_key: clientApiKey } = await req.json();
    
    if (!request_token) {
      return NextResponse.json({ error: "Missing request_token" }, { status: 400 });
    }

    // Verify API key matches (optional check, but helpful for debugging)
    if (clientApiKey && clientApiKey.trim() !== GROWW_API_KEY) {
      console.warn(`API key mismatch: client sent ${clientApiKey.substring(0, 10)}..., server has ${GROWW_API_KEY?.substring(0, 10)}...`);
    }

    // Calculate checksum: SHA-256 hash of (api_key + request_token + api_secret)
    const checksumString = `${GROWW_API_KEY}${request_token}${GROWW_API_SECRET}`;
    const checksum = crypto.createHash('sha256').update(checksumString).digest('hex');

    // Step 1: Exchange request_token for access_token
    // Note: Groww API endpoint may differ - adjust based on actual Groww API documentation
    const sessionRes = await fetch("https://api.groww.in/v1/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        api_key: GROWW_API_KEY as string,
        request_token,
        api_secret: GROWW_API_SECRET as string,
        checksum: checksum,
      }).toString(),
    });
    
    let sessionData;
    const rawText = await sessionRes.text();
    
    if (!sessionRes.ok) {
      // Try to parse error response
      try {
        sessionData = JSON.parse(rawText);
      } catch {
        sessionData = { message: rawText };
      }
      
      return NextResponse.json({
        error: sessionData.message || "Failed to get access token from Groww",
        error_type: sessionData.error_type || "AuthenticationError",
        details: "This usually means: 1) API key/secret mismatch, 2) Request token expired, or 3) Invalid credentials",
        groww_response: sessionData,
        status: sessionRes.status,
        statusText: sessionRes.statusText,
        troubleshooting: {
          check_api_key: "Ensure the API key in .env.local matches exactly the one in Groww developer console",
          check_api_secret: "Ensure GROWW_API_SECRET is correct in .env.local",
          token_expiry: "Request tokens expire quickly - try reconnecting immediately",
          verify_credentials: "Verify your API key and secret are correct in your Groww developer console"
        }
      }, { status: 400 });
    } else {
      try {
        sessionData = JSON.parse(rawText);
      } catch (err) {
        return NextResponse.json({
          error: "Failed to parse access token response as JSON",
          status: sessionRes.status,
          statusText: sessionRes.statusText,
          raw: rawText
        }, { status: 400 });
      }
    }
    
    // Groww API returns data in nested structure similar to Kite
    const accessToken = sessionData.data?.access_token || sessionData.access_token;
    
    if (!accessToken) {
      return NextResponse.json({ 
        error: sessionData.message || "Failed to get access token", 
        error_type: sessionData.error_type || "TokenError",
        groww_response: sessionData,
        status: sessionRes.status,
        statusText: sessionRes.statusText,
        details: "The response from Groww API did not include an access_token"
      }, { status: 400 });
    }

    // Step 2: Fetch holdings from Groww API
    const holdingsRes = await fetch("https://api.groww.in/v1/portfolio/holdings", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-API-KEY": GROWW_API_KEY as string,
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

    // Handle both nested and flat response structures
    const holdings = holdingsData.data || holdingsData.holdings || holdingsData;
    
    if (!holdings || (Array.isArray(holdings) && holdings.length === 0)) {
      return NextResponse.json({ 
        error: holdingsData.message || "No holdings found in Groww account", 
        groww_response: holdingsData,
        status: holdingsRes.status,
        statusText: holdingsRes.statusText
      }, { status: 200 }); // Return 200 with empty holdings - not an error
    }

    return NextResponse.json({ holdings: Array.isArray(holdings) ? holdings : [holdings] });
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

