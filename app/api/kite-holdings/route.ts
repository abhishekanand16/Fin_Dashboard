import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  // Support both NEXT_PUBLIC_KITE_API_KEY and KITE_API_KEY for consistency
  const KITE_API_KEY = (process.env.KITE_API_KEY || process.env.NEXT_PUBLIC_KITE_API_KEY)?.trim();
  const KITE_API_SECRET = process.env.KITE_API_SECRET?.trim();
  
  if (!KITE_API_KEY || !KITE_API_SECRET) {
    return NextResponse.json({ 
      error: "KITE_API_KEY and KITE_API_SECRET must be set in your environment variables (.env.local)",
      details: "Make sure you have both KITE_API_KEY (or NEXT_PUBLIC_KITE_API_KEY) and KITE_API_SECRET set in .env.local file",
      has_api_key: !!KITE_API_KEY,
      has_api_secret: !!KITE_API_SECRET
    }, { status: 500 });
  }

  // Validate API key format (Kite API keys are typically alphanumeric, 8-20 chars)
  if (KITE_API_KEY === "your_api_key_here" || KITE_API_KEY.includes("your_")) {
    return NextResponse.json({ 
      error: "API key appears to be a placeholder. Please replace it with your actual Kite API key.",
      details: "The API key in .env.local still contains placeholder text. Get your API key from https://developers.kite.trade/apps"
    }, { status: 500 });
  }

  if (KITE_API_KEY.length < 8 || !/^[a-zA-Z0-9]+$/.test(KITE_API_KEY)) {
    console.warn("API key format may be invalid:", KITE_API_KEY.substring(0, 10) + "...");
  }
  
  try {
    const { request_token, api_key: clientApiKey } = await req.json();
    
    if (!request_token) {
      return NextResponse.json({ error: "Missing request_token" }, { status: 400 });
    }

    // Verify API key matches (optional check, but helpful for debugging)
    if (clientApiKey && clientApiKey.trim() !== KITE_API_KEY) {
      console.warn(`API key mismatch: client sent ${clientApiKey.substring(0, 10)}..., server has ${KITE_API_KEY?.substring(0, 10)}...`);
    }

    // Calculate checksum: SHA-256 hash of (api_key + request_token + api_secret)
    // The checksum must be at least 10 characters (SHA-256 hex gives us 64 chars)
    const checksumString = `${KITE_API_KEY}${request_token}${KITE_API_SECRET}`;
    const checksum = crypto.createHash('sha256').update(checksumString).digest('hex');

    // Step 1: Exchange request_token for access_token
    // Kite Connect requires: api_key, request_token, api_secret, and checksum
    const sessionRes = await fetch("https://api.kite.trade/session/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        api_key: KITE_API_KEY as string,
        request_token,
        api_secret: KITE_API_SECRET as string,
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
      
      // Handle specific error types
      let errorDetails = "This usually means: 1) API key/secret mismatch, 2) Request token expired, or 3) Invalid credentials";
      let troubleshooting: any = {
        check_api_key: "Ensure the API key in .env.local matches exactly the one in Kite Connect Console",
        check_api_secret: "Ensure KITE_API_SECRET is correct in .env.local",
        token_expiry: "Request tokens expire quickly - try reconnecting immediately",
        verify_credentials: "Verify your API key and secret are correct in your Kite developer console at https://developers.kite.trade/apps"
      };

      if (sessionData.error_type === "InputException" && sessionData.message?.includes("api_key")) {
        errorDetails = "Invalid API key. The API key is not recognized by Kite Connect.";
        troubleshooting = {
          ...troubleshooting,
          api_key_issues: [
            "Check that your API key exactly matches the one in Kite Connect Console",
            "Make sure there are no extra spaces or quotes in .env.local",
            "Verify the API key is from the correct app in Kite Console",
            "Ensure you've copied the full API key without any truncation",
            "Double-check that NEXT_PUBLIC_KITE_API_KEY and KITE_API_KEY are identical in .env.local"
          ]
        };
      }

      if (sessionData.error_type === "TokenException") {
        errorDetails = "Token expired or invalid. Request tokens expire very quickly (within seconds).";
        troubleshooting = {
          ...troubleshooting,
          token_issues: [
            "Request tokens expire almost immediately - you must exchange them right after login",
            "Try connecting again and proceed immediately after Kite redirects you back",
            "Do not refresh or wait before clicking 'Connect' - move quickly through the flow",
            "Verify your API secret is correct - incorrect secret can also cause this error",
            "Make sure you're completing the login flow in one continuous session"
          ]
        };
      }

      if (sessionData.message?.includes("checksum")) {
        errorDetails = "Checksum validation failed. Verify your API credentials are correct.";
        troubleshooting = {
          ...troubleshooting,
          checksum_issues: [
            "Verify your API secret is correct and matches Kite Console exactly",
            "Make sure there are no extra spaces or characters in api_secret in .env.local",
            "Request tokens expire quickly - try connecting again immediately",
            "If you regenerated your API secret, make sure you're using the new one"
          ]
        };
      }

      return NextResponse.json({
        error: sessionData.message || "Failed to get access token",
        error_type: sessionData.error_type || "AuthenticationError",
        details: errorDetails,
        kite_response: sessionData,
        status: sessionRes.status,
        statusText: sessionRes.statusText,
        troubleshooting
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
    
    // Kite API returns data in nested structure: { status: "success", data: { access_token: "..." } }
    const accessToken = sessionData.data?.access_token || sessionData.access_token;
    
    if (!accessToken) {
      return NextResponse.json({ 
        error: sessionData.message || "Failed to get access token", 
        error_type: sessionData.error_type || "TokenError",
        kite_response: sessionData,
        status: sessionRes.status,
        statusText: sessionRes.statusText,
        details: "The response from Kite API did not include an access_token in the expected location"
      }, { status: 400 });
    }

    // Step 2: Fetch holdings
    // Use the access token from the nested data structure
    const holdingsRes = await fetch("https://api.kite.trade/portfolio/holdings", {
      headers: {
        Authorization: `token ${KITE_API_KEY}:${accessToken}`,
      },
    });
    let holdingsData;
    if (!holdingsRes.ok) {
      const rawText = await holdingsRes.text();
      return NextResponse.json({
        error: "Failed to fetch holdings (non-200 response)",
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
          error: "Failed to parse holdings response as JSON",
          status: holdingsRes.status,
          statusText: holdingsRes.statusText,
          raw: rawText
        }, { status: 400 });
      }
    }
    if (!holdingsData.data) {
      return NextResponse.json({ 
        error: holdingsData.message || "Failed to fetch holdings", 
        kite_response: holdingsData,
        status: holdingsRes.status,
        statusText: holdingsRes.statusText
      }, { status: 400 });
    }

    return NextResponse.json({ holdings: holdingsData.data });
  } catch (e: any) {
    // Enhanced error logging
    return NextResponse.json({ 
      error: e.message || "Unknown error", 
      stack: e.stack || null,
      raw: e
    }, { status: 500 });
  }
}

// To use environment variables, add the following to your .env.local file (not committed to git):
// KITE_API_KEY=your_kite_api_key
// KITE_API_SECRET=your_real_kite_api_secret 