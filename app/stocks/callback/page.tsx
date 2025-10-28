"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFinancialData, type Holding } from "@/context/financial-data-context";

export default function KiteCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rawError, setRawError] = useState<any>(null);
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
        } else {
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

          // Also store in legacy localStorage for backward compatibility
          localStorage.setItem("kite_holdings", JSON.stringify(data.holdings));
          
          router.replace("/stocks");
        }
      })
      .catch((e) => {
        setError("Failed to fetch holdings.");
        setRawError(e);
      })
      .finally(() => setLoading(false));
  }, [router, addHoldings]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Connecting to Kite...</h1>
      {loading && <p>Fetching your holdings, please wait...</p>}
      {error && (
        <div>
          <p className="text-red-500">{error}</p>
          {rawError && (
            <pre className="bg-gray-100 text-xs p-2 mt-2 rounded overflow-x-auto">
              {typeof rawError === "string"
                ? rawError
                : (rawError && typeof rawError === "object"
                    ? JSON.stringify(rawError, null, 2)
                    : String(rawError))}
            </pre>
          )}
        </div>
      )}
    </div>
  );
} 