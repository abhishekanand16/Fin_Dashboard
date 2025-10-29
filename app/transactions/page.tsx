"use client"

import { useState, useMemo } from "react"
import { useFinancialData, type Transaction } from "@/context/financial-data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UploadStatementDialog } from "@/components/dialogs/upload-statement-dialog"
import {
  Upload,
  Search,
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Trash2,
  Edit,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { useStyle } from "@/components/style-provider"

const CATEGORIES = [
  "All Categories",
  "Food & Dining",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Bills & Utilities",
  "Education",
  "Travel",
  "Investments",
  "Income",
  "Transfer",
  "Others"
]

export default function TransactionsPage() {
  const { transactions, deleteTransaction, currency } = useFinancialData()
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all")
  const { style } = useStyle()
  const isGlass = style === "glass"

  // Currency symbol
  const currencyOptions = [
    { code: "INR", symbol: "₹" },
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
  ]
  const currencySymbol = currencyOptions.find((c) => c.code === currency)?.symbol || "₹"

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesSearch = 
        txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.category.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = 
        categoryFilter === "All Categories" || txn.category === categoryFilter
      
      const matchesType = 
        typeFilter === "all" || txn.type === typeFilter

      return matchesSearch && matchesCategory && matchesType
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [transactions, searchQuery, categoryFilter, typeFilter])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
    
    const balance = totalIncome - totalExpense

    return {
      totalIncome,
      totalExpense,
      balance,
      count: transactions.length
    }
  }, [transactions])

  const handleDelete = (id: string) => {
    deleteTransaction(id)
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Food & Dining": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      "Shopping": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
      "Transportation": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      "Entertainment": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      "Healthcare": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      "Bills & Utilities": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      "Education": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
      "Travel": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
      "Investments": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      "Income": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
      "Transfer": "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      "Others": "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
    }
    return colors[category] || colors["Others"]
  }

  return (
    <div className={isGlass ? "p-6 space-y-6 bg-white/40 border border-cyan-200/40 shadow-lg backdrop-blur-2xl rounded-2xl" : "p-6 space-y-6"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all your financial transactions
          </p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)} className="w-full sm:w-auto">
          <Upload className="mr-2 h-4 w-4" />
          Upload Statement
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {currencySymbol}{stats.totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {transactions.filter(t => t.type === "income").length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {currencySymbol}{stats.totalExpense.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {transactions.filter(t => t.type === "expense").length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            {stats.balance >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {currencySymbol}{Math.abs(stats.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.balance >= 0 ? "Surplus" : "Deficit"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.count}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredTransactions.length} shown
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Transactions</CardTitle>
          <CardDescription>Search and filter your transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 bg-muted rounded-full mb-4">
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {transactions.length === 0 
                  ? "Upload a bank statement to get started"
                  : "Try adjusting your filters"}
              </p>
              {transactions.length === 0 && (
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Statement
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {format(new Date(transaction.date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate">
                          {transaction.description}
                        </div>
                        {transaction.paymentMethod && (
                          <div className="text-xs text-muted-foreground capitalize">
                            {transaction.paymentMethod}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(transaction.category)} variant="secondary">
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {transaction.type === "income" ? (
                            <>
                              <ArrowUpCircle className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">Income</span>
                            </>
                          ) : (
                            <>
                              <ArrowDownCircle className="h-4 w-4 text-red-600" />
                              <span className="text-red-600 font-medium">Expense</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={transaction.type === "income" ? "text-green-600" : "text-red-600"}>
                          {transaction.type === "income" ? "+" : "-"}
                          {currencySymbol}{transaction.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDelete(transaction.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <UploadStatementDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </div>
  )
}
