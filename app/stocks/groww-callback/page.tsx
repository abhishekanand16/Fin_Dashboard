"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GrowwCallback() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Connecting to Groww...");
  const router = useRouter();

  useEffect(() => {
    // Simulate connection process
    setTimeout(() => {
      setStatus("Fetching your holdings...");
      
      // Since Groww doesn't have a public API, we'll show a message
      setTimeout(() => {
        toast.info("Groww API integration is coming soon. You can manually add your stocks using the 'Add Groww Stock' button.");
        router.replace("/stocks");
      }, 2000);
    }, 1500);
  }, [router]);

  return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{status}</h1>
        {loading && (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p>Please wait...</p>
          </div>
        )}
      </div>
    </div>
  );
}


