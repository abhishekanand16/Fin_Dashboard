import { useEffect, useState } from "react";

export default function KiteCallback() {
  const [requestToken, setRequestToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("request_token");
    if (token) setRequestToken(token);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Kite Account Connected</h1>
      {requestToken ? (
        <div>
          <p className="mb-2">Received request token:</p>
          <code className="bg-gray-100 p-2 rounded text-sm">{requestToken}</code>
        </div>
      ) : (
        <p>No request token found in the URL.</p>
      )}
    </div>
  );
} 