"use client";
import React, { useEffect, useState } from "react";

export default function StocksPage() {
  const [holdings, setHoldings] = useState<any[] | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("kite_holdings");
    if (data) {
      setHoldings(JSON.parse(data));
    }
  }, []);

  if (holdings) {
    const displayHoldings = showAll ? holdings : holdings.slice(0, 20);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <img src="https://kite.zerodha.com/static/images/kite-logo.svg" alt="Kite App Icon" className="w-6 h-6 inline-block" />
          Your Kite Holdings
        </h1>
        <table className="min-w-full bg-white dark:bg-[#18181b] rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Symbol</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Avg. Price</th>
              <th className="px-4 py-2 text-left">Current Value</th>
            </tr>
          </thead>
          <tbody>
            {displayHoldings.map((h: any, i: number) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">{h.tradingsymbol}</td>
                <td className="px-4 py-2">{h.quantity}</td>
                <td className="px-4 py-2">₹{h.average_price}</td>
                <td className="px-4 py-2">₹{h.last_price * h.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {holdings.length > 20 && !showAll && (
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => setShowAll(true)}
          >
            Show More
          </button>
        )}
      </div>
    );
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Stocks</h1>
      <p className="mb-6 flex items-center gap-2">
        <img src="https://kite.zerodha.com/static/images/kite-logo.svg" alt="Kite App Icon" className="w-6 h-6 inline-block" />
        Connect your Kite (Zerodha) brokerage account to view and manage your stocks.
      </p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition flex items-center gap-2"
        onClick={() => {
          window.location.href =
            "https://kite.trade/connect/login?api_key=wob4tch3xv9q57yy&redirect_uri=http://localhost:3000/stocks/callback";
        }}
      >
        <img src="https://kite.zerodha.com/static/images/kite-logo.svg" alt="Kite App Icon" className="w-5 h-5" />
        Connect your Kite account
      </button>
    </div>
  );
} 
