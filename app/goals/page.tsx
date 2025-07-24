"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Plus } from "lucide-react"
import List03 from "@/components/ledger/list-03"
import { useStyle } from "@/components/style-provider"

export default function GoalsPage() {
  const { style } = useStyle();
  const isGlass = style === "glass";
  return (
    <div className={isGlass ? "p-6 max-w-4xl mx-auto bg-white/60 dark:bg-[#1F1F23]/60 border-cyan-300/60 shadow-xl backdrop-blur-2xl rounded-2xl" : "p-6 max-w-4xl mx-auto"}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Goals</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Track your financial goals and monitor your progress towards achieving them.
        </p>
      </div>

      <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Your Goals
          </CardTitle>
          <CardDescription>
            Create and manage your financial goals with target dates and progress tracking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <List03 />
        </CardContent>
      </Card>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-900 dark:text-purple-100">Create Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-800 dark:text-purple-200 text-sm">
              Set specific financial targets with completion dates and track your progress over time.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100">Track Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-800 dark:text-green-200 text-sm">
              Monitor your progress with visual indicators and see how much you've accomplished.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="text-orange-900 dark:text-orange-100">Stay Motivated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-800 dark:text-orange-200 text-sm">
              Visualize your financial journey and stay motivated with clear targets and deadlines.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 