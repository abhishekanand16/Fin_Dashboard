"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFinancialData, type Holding } from "@/context/financial-data-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function GrowwCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rawError, setRawError] = useState<any>(null);
  const [holdingsCount, setHoldingsCount] = useState(0);
  const router = useRouter();
  const { addHoldings, holdings: currentHoldings, deleteHolding } = useFinancialData();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestToken = params.get("request_token");
    const status = params.get("status");
    const error = params.get("error");
    
    // Check for error in URL params
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
    const apiKey = process.env.NEXT_PUBLIC_GROWW_API_KEY;
    
    // Call backend API to fetch holdings
    fetch("/api/groww-holdings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        request_token: requestToken,
        api_key: apiKey
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          // Format error message for user
          let errorMessage = data.error;
          
          if (data.error?.includes("checksum")) {
            errorMessage = "Checksum Validation Failed\n\nThe request checksum is invalid. This usually means:\n• Your API secret might be incorrect\n• There could be extra spaces in your .env.local file\n• The request token may have expired\n\nPlease:\n• Double-check your GROWW_API_SECRET in .env.local matches exactly what's in Groww Console\n• Ensure there are no quotes or spaces around the values\n• Restart your dev server\n• Try connecting again immediately";
            if (data.troubleshooting?.checksum_issues) {
              errorMessage += "\n\nAdditional checks:\n" + data.troubleshooting.checksum_issues.map((issue: string) => `• ${issue}`).join("\n");
            }
          } else if (data.error_type === "InputException" && data.error?.includes("api_key")) {
            errorMessage = "Invalid API Key\n\nYour API key is not recognized by Groww. Please:\n• Verify your API key in .env.local matches exactly the one from Groww Console\n• Check for any extra spaces, quotes, or formatting issues\n• Restart your dev server after updating .env.local\n• Ensure NEXT_PUBLIC_GROWW_API_KEY and GROWW_API_KEY are identical";
            if (data.troubleshooting?.api_key_issues) {
              errorMessage += "\n\nAdditional checks:\n" + data.troubleshooting.api_key_issues.map((issue: string) => `• ${issue}`).join("\n");
            }
          } else if (data.error_type === "TokenException" || data.message?.includes("Token is invalid") || data.message?.includes("expired")) {
            errorMessage = "Token Expired\n\nRequest tokens expire VERY quickly (within seconds). Please:\n• Click 'Connect Groww Account' again immediately\n• Complete the login flow without delay\n• Don't wait or refresh the page\n• Exchange the token right after Groww redirects you back\n\nIf this persists, your API secret might be incorrect.";
            if (data.troubleshooting?.token_issues) {
              errorMessage += "\n\nAdditional tips:\n" + data.troubleshooting.token_issues.map((issue: string) => `• ${issue}`).join("\n");
            }
          }
          
          if (data.details && !errorMessage.includes(data.details)) {
            errorMessage += "\n\n" + data.details;
          }
          
          if (data.troubleshooting && !data.troubleshooting.api_key_issues && !data.troubleshooting.checksum_issues) {
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
          // Convert Groww holdings to our Holding format
          const formattedHoldings: Holding[] = data.holdings.map((h: any, index: number) => {
            const invested = (h.quantity || 0) * (h.average_price || h.avgPrice || 0);
            const currentValue = (h.quantity || 0) * (h.last_price || h.lastPrice || h.currentPrice || 0);
            const pnl = currentValue - invested;
            const pnlPercentage = invested > 0 ? ((pnl / invested) * 100) : 0;

            return {
              id: `groww-${h.tradingsymbol || h.symbol || h.instrument_key}-${h.exchange || 'NSE'}-${Date.now()}-${index}`,
              tradingsymbol: h.tradingsymbol || h.symbol || h.instrument_key || `STOCK-${index}`,
              exchange: h.exchange || 'NSE',
              quantity: h.quantity || 0,
              average_price: h.average_price || h.avgPrice || 0,
              last_price: h.last_price || h.lastPrice || h.currentPrice || 0,
              pnl,
              pnl_percentage: pnlPercentage,
              broker: "groww",
              broker_account: "Groww Account",
            };
          });

          // Remove existing Groww holdings before adding new ones to prevent duplicates
          currentHoldings
            .filter(h => h.broker === "groww")
            .forEach(h => deleteHolding(h.id));
          
          // Then add the new holdings
          setTimeout(() => {
            addHoldings(formattedHoldings);
            setHoldingsCount(formattedHoldings.length);
          }, 0);

          // Also store in legacy localStorage for backward compatibility
          localStorage.setItem("groww_holdings", JSON.stringify(data.holdings));
          
          toast.success(`Successfully connected! Added ${formattedHoldings.length} holdings from Groww.`);
          
          // Redirect after showing success
          setTimeout(() => {
            router.replace("/stocks");
          }, 2000);
        } else {
          setError("No holdings data received from Groww API");
          setLoading(false);
        }
      })
      .catch((e) => {
        setError("Failed to fetch holdings.");
        setRawError(e);
        setLoading(false);
      });
  }, [router, addHoldings, currentHoldings, deleteHolding]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-green-600" />
              Connecting to Groww...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please wait while we fetch your portfolio data from Groww.
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
            <div className="text-muted-foreground whitespace-pre-line text-left bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
            {rawError && (
              <details className="text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-60">
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
            Your Groww account has been successfully connected.
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


