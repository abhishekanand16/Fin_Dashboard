"use client"

import List03 from "@/components/ledger/list-03"
import { Calendar } from "lucide-react"
import { useStyle } from "@/components/style-provider"

export default function GoalsPage() {
  const { style } = useStyle();
  const isGlass = style === "glass";
  return (
    <div className={isGlass ? "p-6 max-w-4xl mx-auto bg-white/40 border border-cyan-200/40 shadow-lg backdrop-blur-2xl rounded-2xl" : "p-6 max-w-4xl mx-auto"}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Financial Goals</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your financial goals and monitor your progress towards achieving them.</p>
      </div>
      
      <div className={isGlass ? "rounded-xl p-6 flex flex-col items-start justify-start border border-cyan-200/40 shadow-lg backdrop-blur-2xl bg-white/40" : "bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col items-start justify-start border border-gray-200 dark:border-[#1F1F23] shadow-md dark:shadow-none"}>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50" />
          Your Goals
        </h2>
        <List03 />
      </div>
    </div>
  )
}
