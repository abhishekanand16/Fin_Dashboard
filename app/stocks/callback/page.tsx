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
    if (!requestToken) {
      setError("No request token found in the URL.");
      setLoading(false);
      return;
    }
    // Call backend API to fetch holdings
    fetch("/api/kite-holdings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_token: requestToken })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
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