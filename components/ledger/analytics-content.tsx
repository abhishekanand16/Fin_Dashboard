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
import { DollarSign, TrendingUp, PieChartIcon, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
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
  const { accounts, currency, revenueData, expensesData, salaryAmount, monthlyExpenseAmount, transactions, holdings } = useFinancialData() // Get data from context

  // Calculate totals from user data
  const totalRevenue = revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0)
  const totalExpenses = expensesData.reduce((sum, item) => sum + (item.expenses || 0), 0)

  // Use salary as monthly revenue if no revenue data exists
  const effectiveRevenue = salaryAmount > 0 && revenueData.length === 0 ? salaryAmount : totalRevenue
  const revenueDescription = salaryAmount > 0 && revenueData.length === 0 
    ? "Monthly salary as revenue" 
    : revenueData.length > 0 
      ? `${revenueData.length} months of data` 
      : "No revenue data"

  // Use monthly expense as expenses if no expenses data exists
  const effectiveExpenses = monthlyExpenseAmount > 0 && expensesData.length === 0 ? monthlyExpenseAmount : totalExpenses
  const expensesDescription = monthlyExpenseAmount > 0 && expensesData.length === 0 
    ? "Monthly expenses" 
    : expensesData.length > 0 
      ? `${expensesData.length} months of data` 
      : "No expenses data"

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

  // Calculate transaction-based analytics
  const transactionIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)
  
  const transactionExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  // Group transactions by category for pie chart
  const categoryExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, transaction) => {
      const existing = acc.find((item) => item.name === transaction.category)
      if (existing) {
        existing.value += transaction.amount
      } else {
        acc.push({
          name: transaction.category,
          value: transaction.amount,
          fill: accountTypeColors[transaction.category.toLowerCase().replace(/\s+/g, '')] || "hsl(var(--chart-5))"
        })
      }
      return acc
    }, [] as { name: string; value: number; fill: string }[])

  // Group transactions by month for trend analysis
  const monthlyTransactionData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    
    const existing = acc.find((item) => item.monthKey === monthKey)
    if (existing) {
      if (transaction.type === "income") {
        existing.revenue += transaction.amount
      } else {
        existing.expenses += transaction.amount
      }
    } else {
      acc.push({
        monthKey,
        month: monthName,
        revenue: transaction.type === "income" ? transaction.amount : 0,
        expenses: transaction.type === "expense" ? transaction.amount : 0,
      })
    }
    return acc
  }, [] as { monthKey: string; month: string; revenue: number; expenses: number }[])
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
    .slice(-6) // Last 6 months

  // Use transaction data if available, otherwise use manual data
  const displayRevenueData = monthlyTransactionData.length > 0 ? monthlyTransactionData : revenueData
  const displayExpensesData = monthlyTransactionData.length > 0 ? monthlyTransactionData : expensesData
  const displayCategoryData = categoryExpenses.length > 0 ? categoryExpenses : categoryData

  // Calculate totals from transaction data or fallback to manual entry
  const totalRevenueFromTransactions = monthlyTransactionData.reduce((sum, item) => sum + item.revenue, 0)
  const totalExpensesFromTransactions = monthlyTransactionData.reduce((sum, item) => sum + item.expenses, 0)

  // Calculate holdings analytics
  const totalInvested = holdings.reduce((sum, h) => sum + (h.quantity * h.average_price), 0)
  const totalCurrentValue = holdings.reduce((sum, h) => sum + (h.quantity * h.last_price), 0)
  const totalPnL = totalCurrentValue - totalInvested
  const totalPnLPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

  // Group holdings by broker
  const holdingsByBroker = holdings.reduce((acc, holding) => {
    if (!acc[holding.broker]) {
      acc[holding.broker] = []
    }
    acc[holding.broker].push(holding)
    return acc
  }, {} as Record<string, typeof holdings>)

  // Calculate broker-wise performance
  const brokerPerformance = Object.entries(holdingsByBroker).map(([broker, brokerHoldings]) => {
    const invested = brokerHoldings.reduce((sum, h) => sum + (h.quantity * h.average_price), 0)
    const currentValue = brokerHoldings.reduce((sum, h) => sum + (h.quantity * h.last_price), 0)
    const pnl = currentValue - invested
    const pnlPercentage = invested > 0 ? (pnl / invested) * 100 : 0
    
    return {
      broker,
      invested,
      currentValue,
      pnl,
      pnlPercentage,
      holdingsCount: brokerHoldings.length
    }
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Overview</h1>
        {transactions.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {transactions.length} transactions analyzed
          </div>
        )}
      </div>

      {/* Holdings Summary Cards - Show if holdings exist */}
      {holdings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {currencySymbol}{totalInvested.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {holdings.length} holdings
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currencySymbol}{totalCurrentValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                Portfolio value
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              {totalPnL >= 0 ? <ArrowUpCircle className="h-4 w-4 text-green-600" /> : <ArrowDownCircle className="h-4 w-4 text-red-600" />}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currencySymbol}{Math.abs(totalPnL).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalPnL >= 0 ? 'Profit' : 'Loss'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">P&L Percentage</CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalPnLPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalPnLPercentage >= 0 ? '+' : ''}{totalPnLPercentage.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Return on investment
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transaction Summary Cards - Show if transactions exist */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Transaction Income</CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {currencySymbol}{transactionIncome.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                From imported transactions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Transaction Expenses</CardTitle>
              <ArrowDownCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {currencySymbol}{transactionExpenses.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                From imported transactions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Net Cashflow</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${transactionIncome - transactionExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currencySymbol}{Math.abs(transactionIncome - transactionExpenses).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {transactionIncome - transactionExpenses >= 0 ? 'Surplus' : 'Deficit'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currencySymbol}{(transactionExpenses / Math.max(transactions.filter(t => t.type === "expense").length, 1)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                Average expense amount
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Revenue Line Chart */}
        <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currencySymbol}{(totalRevenueFromTransactions || effectiveRevenue).toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground">
              {transactions.length > 0 && monthlyTransactionData.length > 0
                ? `${monthlyTransactionData.length} months from transactions`
                : revenueDescription}
            </p>
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
                <LineChart data={displayRevenueData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
            <div className="text-2xl font-bold">
              {currencySymbol}{(totalExpensesFromTransactions || effectiveExpenses).toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground">
              {transactions.length > 0 && monthlyTransactionData.length > 0
                ? `${monthlyTransactionData.length} months from transactions`
                : expensesDescription}
            </p>
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
                <BarChart data={displayExpensesData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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

        {/* Broker Performance Chart or Expense Categories */}
        {brokerPerformance.length > 0 ? (
          <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Broker Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {brokerPerformance.map((broker) => (
                  <div key={broker.broker} className="flex items-center justify-between p-3 rounded border">
                    <div className="flex items-center gap-3">
                      {broker.broker === "kite" ? (
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <img
                            src="https://kite.zerodha.com/static/images/kite-logo.svg"
                            alt="Kite Logo"
                            className="w-8 h-8"
                            onError={(e) => {
                              // Fallback to initial if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.parentElement) {
                                target.parentElement.innerHTML = `<div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">K</div>`;
                              }
                            }}
                          />
                        </div>
                      ) : broker.broker === "groww" ? (
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <img
                            src="https://groww.in/groww-logo-270.png"
                            alt="Groww Logo"
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.parentElement) {
                                target.parentElement.innerHTML = `<div class="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">G</div>`;
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                          {broker.broker.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium capitalize">
                          {broker.broker === "kite" ? "Kite (Zerodha)" : broker.broker === "groww" ? "Groww" : broker.broker}
                        </div>
                        <div className="text-sm text-muted-foreground">{broker.holdingsCount} holdings</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{currencySymbol}{broker.currentValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                      <div className={`text-sm ${broker.pnlPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {broker.pnlPercentage >= 0 ? '+' : ''}{broker.pnlPercentage.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {categoryExpenses.length > 0 ? "Expense Categories" : "Account Categories"}
              </CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {displayCategoryData.length > 0 ? (
                <ChartContainer
                  config={
                    categoryExpenses.length > 0
                      ? categoryExpenses.reduce((acc, item) => {
                          acc[item.name.toLowerCase().replace(/\s+/g, '')] = {
                            label: item.name,
                            color: item.fill,
                          }
                          return acc
                        }, {} as Record<string, { label: string; color: string }>)
                      : categoryChartConfig
                  }
                  className="h-[200px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="name" />} />
                      <Pie
                        data={displayCategoryData}
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
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No expense data available
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
