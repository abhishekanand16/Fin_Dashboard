"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { DollarSign, TrendingUp, PieChartIcon } from "lucide-react"
import { useFinancialData } from "@/context/financial-data-context" // Import useFinancialData

const revenueData = [
  { month: "January", revenue: 12000 },
  { month: "February", revenue: 15000 },
  { month: "March", revenue: 13000 },
  { month: "April", revenue: 17000 },
  { month: "May", revenue: 16000 },
  { month: "June", revenue: 19000 },
]

const expensesData = [
  { month: "January", expenses: 5000 },
  { month: "February", expenses: 6500 },
  { month: "March", expenses: 5500 },
  { month: "April", expenses: 7000 },
  { month: "May", expenses: 6000 },
  { month: "June", expenses: 7500 },
]

// Define a mapping for account types to chart colors
const accountTypeColors: { [key: string]: string } = {
  savings: "hsl(var(--chart-1))", // Green
  checking: "hsl(var(--chart-2))", // Orange
  investment: "hsl(var(--chart-3))", // Purple
  debt: "hsl(var(--chart-4))", // Teal
  // Add more as needed
}

export default function AnalyticsContent() {
  const { accounts, currency } = useFinancialData() // Get accounts and currency from context

  // Dynamically derive category data from accounts
  const categoryData = accounts.reduce(
    (acc, account) => {
      const type = account.type.charAt(0).toUpperCase() + account.type.slice(1) // Capitalize type for label
      const balanceValue = Number.parseFloat(account.balance.replace(/[^0-9.-]+/g, ""))

      if (isNaN(balanceValue)) return acc

      const existingCategory = acc.find((item) => item.name === type)

      if (existingCategory) {
        existingCategory.value += balanceValue
      } else {
        acc.push({
          name: type,
          value: balanceValue,
          fill: accountTypeColors[account.type] || "hsl(var(--chart-5))", // Fallback color
        })
      }
      return acc
    },
    [] as { name: string; value: number; fill: string }[],
  )

  // Create a config object for the ChartContainer based on derived categories
  const categoryChartConfig = categoryData.reduce(
    (acc, item, index) => {
      acc[item.name.toLowerCase()] = {
        label: item.name,
        color: item.fill,
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>,
  )

  const currencyOptions = [
    { code: "INR", symbol: "₹" },
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "AUD", symbol: "A$" },
    { code: "CAD", symbol: "C$" },
    { code: "SGD", symbol: "S$" },
    { code: "JPY", symbol: "¥" },
    { code: "CNY", symbol: "¥" },
    { code: "ZAR", symbol: "R" },
  ]
  const currencySymbol = currencyOptions.find((c) => c.code === currency)?.symbol || "₹";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Overview</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Revenue Line Chart */}
        <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currencySymbol}{(82000).toLocaleString("en-IN")}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))", // Green
                },
              }}
              className="h-[200px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value} // Display full month name
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Expenses Bar Chart */}
        <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currencySymbol}{(38500).toLocaleString("en-IN")}</div>
            <p className="text-xs text-muted-foreground">-5.2% from last month</p>
            <ChartContainer
              config={{
                expenses: {
                  label: "Expenses",
                  color: "hsl(var(--chart-2))", // Orange
                },
              }}
              className="h-[200px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expensesData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value} // Display full month name
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />{" "}
                  {/* Rounded top corners */}
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Expense Categories Pie Chart */}
        <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Account Categories</CardTitle> {/* Changed title */}
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer
              config={categoryChartConfig} // Use dynamically generated config
              className="h-[200px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="name" />} />
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    strokeWidth={1}
                    paddingAngle={3}
                    cornerRadius={3}
                  />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
