"use client"
import AnalyticsContent from "@/components/ledger/analytics-content"
import { useStyle } from "@/components/style-provider"

export default function AnalyticsPage() {
  const { style } = useStyle();
  const isGlass = style === "glass";
  return (
    <div className={isGlass ? "p-6 max-w-6xl mx-auto bg-white/40 border border-cyan-200/40 shadow-lg backdrop-blur-2xl rounded-2xl" : "p-6 max-w-6xl mx-auto"}>
      <AnalyticsContent />
    </div>
  )
}
