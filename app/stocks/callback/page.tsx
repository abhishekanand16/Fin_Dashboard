"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function KiteCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rawError, setRawError] = useState<any>(null);
  const router = useRouter();

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
          // Store holdings in localStorage and redirect to /stocks
          localStorage.setItem("kite_holdings", JSON.stringify(data.holdings));
          router.replace("/stocks");
        }
      })
      .catch((e) => {
        setError("Failed to fetch holdings.");
        setRawError(e);
      })
      .finally(() => setLoading(false));
  }, [router]);

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