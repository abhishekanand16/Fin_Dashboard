import { Calendar, CreditCard, Wallet } from "lucide-react"
import List01 from "./list-01"
import List02 from "./list-02"
import List03 from "./list-03"
import { useStyle } from "@/components/style-provider"

export default function DashboardContent() {
  const { style } = useStyle()
  const isGlass = style === "glass"

  // Glassmorphism classes
  const glassCard =
    "bg-white/60 dark:bg-[#1F1F23]/60 border-cyan-300/60 shadow-xl backdrop-blur-2xl rounded-2xl p-6 flex flex-col border"
  const glassTitle =
    "text-lg font-bold mb-4 text-left flex items-center gap-2 text-gray-900 dark:text-white"
  const normalCard =
    "bg-white dark:bg-black/90 rounded-xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F23] backdrop-blur-sm"
  const normalTitle =
    "text-lg font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2 "

  return (
    <div className={isGlass ? "p-8 space-y-6 min-h-screen bg-transparent" : "p-6 space-y-4"}>
      <div className={isGlass ? "grid grid-cols-1 lg:grid-cols-2 gap-8" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}>
        <div className={isGlass ? glassCard : normalCard}>
          <h2 className={isGlass ? glassTitle : normalTitle}>
            <Wallet className={isGlass ? "w-4 h-4 text-cyan-300" : "w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50"} />
            Accounts
          </h2>
          <div className="flex-1">
            <List01 className="h-full" />
          </div>
        </div>
        <div className={isGlass ? glassCard : normalCard}>
          <h2 className={isGlass ? glassTitle : normalTitle}>
            <CreditCard className={isGlass ? "w-4 h-4 text-cyan-300" : "w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50"} />
            Recent Transactions
          </h2>
          <div className="flex-1">
            <List02 className="h-full" />
          </div>
        </div>
      </div>
      <div className={isGlass ? glassCard : normalCard}>
        <h2 className={isGlass ? glassTitle : normalTitle}>
          <Calendar className={isGlass ? "w-4 h-4 text-cyan-300" : "w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50"} />
          Goals
        </h2>
        <List03 />
      </div>
    </div>
  )
}
