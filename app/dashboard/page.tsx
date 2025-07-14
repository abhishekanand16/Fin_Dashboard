import Dashboard from "@/components/ledger/dashboard"

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen">
      {/* Subtle blue/teal background glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: "radial-gradient(circle at 60% 20%, rgba(0, 210, 255, 0.18) 0, rgba(0, 210, 255, 0.10) 40%, transparent 80%)",
          filter: "blur(80px)",
        }}
      />
      <div className="relative z-10">
        <Dashboard />
      </div>
    </div>
  )
}
