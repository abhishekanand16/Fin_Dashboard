"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFinancialData, type Holding } from "@/context/financial-data-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function KiteCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rawError, setRawError] = useState<any>(null);
  const [holdingsCount, setHoldingsCount] = useState(0);
  const router = useRouter();
  const { addHoldings } = useFinancialData();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestToken = params.get("request_token");
    const status = params.get("status");
    const error = params.get("error");
    
    // Check for error in URL params (Kite Connect redirects with error if auth fails)
    if (status === "error" || error) {
      setError(error || "Authentication failed. Please try again.");
      setLoading(false);
      return;
    }
    
    if (!requestToken) {
      setError("No request token found in the URL.");
      setLoading(false);
      return;
    }
    
    // Get API key to send with request for validation
    const apiKey = process.env.NEXT_PUBLIC_KITE_API_KEY;
    
    // Call backend API to fetch holdings
    fetch("/api/kite-holdings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        request_token: requestToken,
        api_key: apiKey // Send API key for validation
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          // Format error message for user
          let errorMessage = data.error;
          
          if (data.error?.includes("checksum")) {
            errorMessage = "Checksum Validation Failed\n\nThe request checksum is invalid. This usually means:\n• Your API secret might be incorrect\n• There could be extra spaces in your .env.local file\n• The request token may have expired\n\nPlease:\n• Double-check your KITE_API_SECRET in .env.local matches exactly what's in Kite Console\n• Ensure there are no quotes or spaces around the values\n• Restart your dev server\n• Try connecting again immediately";
            if (data.troubleshooting?.checksum_issues) {
              errorMessage += "\n\nAdditional checks:\n" + data.troubleshooting.checksum_issues.map((issue: string) => `• ${issue}`).join("\n");
            }
          } else if (data.error_type === "InputException" && data.error?.includes("api_key")) {
            errorMessage = "Invalid API Key\n\nYour API key is not recognized by Kite Connect. Please:\n• Verify your API key in .env.local matches exactly the one from Kite Console\n• Check for any extra spaces, quotes, or formatting issues\n• Restart your dev server after updating .env.local\n• Ensure NEXT_PUBLIC_KITE_API_KEY and KITE_API_KEY are identical";
            if (data.troubleshooting?.api_key_issues) {
              errorMessage += "\n\nAdditional checks:\n" + data.troubleshooting.api_key_issues.map((issue: string) => `• ${issue}`).join("\n");
            }
          } else if (data.error_type === "TokenException" || data.message?.includes("Token is invalid") || data.message?.includes("expired")) {
            errorMessage = "Token Expired\n\nRequest tokens expire VERY quickly (within seconds). Please:\n• Click 'Connect Kite Account' again immediately\n• Complete the login flow without delay\n• Don't wait or refresh the page\n• Exchange the token right after Kite redirects you back\n\nIf this persists, your API secret might be incorrect.";
            if (data.troubleshooting?.token_issues) {
              errorMessage += "\n\nAdditional tips:\n" + data.troubleshooting.token_issues.map((issue: string) => `• ${issue}`).join("\n");
            }
          }
          
          if (data.details && !errorMessage.includes(data.details)) {
            errorMessage += "\n\n" + data.details;
          }
          
          if (data.troubleshooting && !data.troubleshooting.api_key_issues) {
            errorMessage += "\n\nTroubleshooting:\n" + Object.entries(data.troubleshooting).map(([key, value]) => {
              if (Array.isArray(value)) {
                return value.map((item: string) => `• ${item}`).join("\n");
              }
              return `• ${key}: ${value}`;
            }).join("\n");
          }
          
          setError(errorMessage);
          setRawError(data);
          setLoading(false);
          return;
        }

        if (data.holdings && Array.isArray(data.holdings)) {
          // Convert Kite holdings to our Holding format
          const formattedHoldings: Holding[] = data.holdings.map((h: any, index: number) => {
            const invested = h.quantity * h.average_price;
            const currentValue = h.quantity * h.last_price;
            const pnl = currentValue - invested;
            const pnlPercentage = ((pnl / invested) * 100) || 0;

            return {
              id: `kite-${Date.now()}-${index}`,
              tradingsymbol: h.tradingsymbol,
              exchange: h.exchange,
              quantity: h.quantity,
              average_price: h.average_price,
              last_price: h.last_price,
              pnl,
              pnl_percentage: pnlPercentage,
              broker: "kite",
              broker_account: "Kite Account",
            };
          });

          // Add to financial context
          addHoldings(formattedHoldings);
          setHoldingsCount(formattedHoldings.length);

          // Also store in legacy localStorage for backward compatibility
          localStorage.setItem("kite_holdings", JSON.stringify(data.holdings));
          
          toast.success(`Successfully connected! Added ${formattedHoldings.length} holdings from Kite.`);
          
          // Redirect after showing success
          setTimeout(() => {
            router.replace("/stocks");
          }, 2000);
        } else {
          setError("No holdings data received from Kite API");
          setLoading(false);
        }
      })
      .catch((e) => {
        setError("Failed to fetch holdings.");
        setRawError(e);
        setLoading(false);
      });
  }, [router, addHoldings]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              Connecting to Kite...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please wait while we fetch your portfolio data from Kite.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <p>Authenticating and fetching holdings...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-red-600">
              <XCircle className="w-6 h-6" />
              Connection Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{error}</p>
            {rawError && (
              <details className="text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                  {JSON.stringify(rawError, null, 2)}
                </pre>
              </details>
            )}
            <div className="flex gap-2 justify-center">
              <Button onClick={() => router.push("/stocks")} variant="outline">
                Back to Stocks
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="w-6 h-6" />
            Successfully Connected!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your Kite account has been successfully connected.
          </p>
          <p className="text-lg font-semibold">
            {holdingsCount} holdings imported
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting to your portfolio...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <p>Please wait...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 