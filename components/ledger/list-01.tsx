"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  SendHorizontal,
  QrCode,
  Plus,
  ArrowRight,
  CreditCard,
  Pencil,
  DollarSign,
  Trash2,
  TrendingDown,
} from "lucide-react"
import { useState } from "react"
import AddEditAccountDialog from "../dialogs/add-edit-account-dialog"
import { useFinancialData } from "@/context/financial-data-context"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AccountItem {
  id: string
  title: string
  description?: string
  balance: string
  type: "savings" | "checking" | "investment" | "debt" | "salary"
}

interface List01Props {
  className?: string
}

export default function List01({ className }: List01Props) {
  const { accounts, addAccount, updateAccount, deleteAccount, currency, salaryAmount, setSalaryAmount, monthlyExpenseAmount, setMonthlyExpenseAmount } = useFinancialData()
  const [isAddEditAccountDialogOpen, setIsAddEditAccountDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<AccountItem | null>(null)
  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false)
  const [tempSalaryAmount, setTempSalaryAmount] = useState(salaryAmount.toString())
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [tempExpenseAmount, setTempExpenseAmount] = useState(monthlyExpenseAmount.toString())

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
  const currencySymbol = currencyOptions.find((c) => c.code === currency)?.symbol || "₹"

  const handleAddEditAccount = (account: AccountItem) => {
    if (account.id.startsWith("acc-")) {
      addAccount(account)
    } else {
      updateAccount(account)
    }
    setIsAddEditAccountDialogOpen(false)
    setEditingAccount(null)
  }

  const handleDeleteAccount = (accountId: string, accountTitle: string) => {
    if (confirm(`Are you sure you want to delete "${accountTitle}"?`)) {
      deleteAccount(accountId)
    }
  }

  const handleSalarySubmit = () => {
    const amount = parseFloat(tempSalaryAmount) || 0
    setSalaryAmount(amount)
    setIsSalaryDialogOpen(false)
  }

  const handleExpenseSubmit = () => {
    const amount = parseFloat(tempExpenseAmount) || 0
    setMonthlyExpenseAmount(amount)
    setIsExpenseDialogOpen(false)
  }

  const openEditDialog = (account: AccountItem) => {
    setEditingAccount(account)
    setIsAddEditAccountDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingAccount(null)
    setIsAddEditAccountDialogOpen(true)
  }

  const openSalaryDialog = () => {
    setTempSalaryAmount(salaryAmount.toString())
    setIsSalaryDialogOpen(true)
  }

  const openExpenseDialog = () => {
    setTempExpenseAmount(monthlyExpenseAmount.toString())
    setIsExpenseDialogOpen(true)
  }

  const currentTotalBalance =
    currencySymbol +
    accounts
      .reduce((sum, acc) => {
        const balanceValue = Number.parseFloat(acc.balance.replace(/[^0-9.-]+/g, ""))
        return sum + (isNaN(balanceValue) ? 0 : balanceValue)
      }, 0)
      .toLocaleString("en-IN")

  return (
    <div
      className={cn(
        "w-full max-w-xl mx-auto",
        "bg-white dark:bg-zinc-900/70",
        "border border-zinc-100 dark:border-zinc-800",
        "rounded-xl shadow-sm backdrop-blur-xl",
        className,
      )}
    >
      {/* Total Balance Section */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">Total Balance</p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{currentTotalBalance}</h1>
      </div>

      {/* Accounts List */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">Your Accounts</h2>
          <div className="flex flex-col items-end gap-1">
            {salaryAmount > 0 && (
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                Monthly Salary: {currencySymbol}{salaryAmount.toLocaleString("en-IN")}
              </div>
            )}
            {monthlyExpenseAmount > 0 && (
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                Monthly Expenses: {currencySymbol}{monthlyExpenseAmount.toLocaleString("en-IN")}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={cn(
                "group flex items-center justify-between",
                "p-2 rounded-lg",
                "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                "transition-all duration-200",
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn("p-1.5 rounded-lg", {
                    "bg-emerald-100 dark:bg-emerald-900/30": account.type === "savings",
                    "bg-blue-100 dark:bg-blue-900/30": account.type === "checking",
                    "bg-purple-100 dark:bg-purple-900/30": account.type === "investment",
                    "bg-red-100 dark:bg-red-900/30": account.type === "debt",
                    "bg-green-100 dark:bg-green-900/30": account.type === "salary",
                  })}
                >
                  {account.type === "savings" && (
                    <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  )}
                  {account.type === "checking" && <QrCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  {account.type === "investment" && (
                    <ArrowUpRight className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  )}
                  {account.type === "debt" && <CreditCard className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />}
                  {account.type === "salary" && <DollarSign className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />}
                </div>
                <div>
                  <h3 className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{account.title}</h3>
                  {account.description && (
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400">{account.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{currencySymbol}{Number(account.balance.replace(/[^0-9.]/g, "")).toLocaleString("en-IN")}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => openEditDialog(account)}
                  aria-label={`Edit ${account.title}`}
                >
                  <Pencil className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                  onClick={() => handleDeleteAccount(account.id, account.title)}
                  aria-label={`Delete ${account.title}`}
                >
                  <Trash2 className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Updated footer with Add, Salary, and Expenses buttons */}
      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={openAddDialog}
            className={cn(
              "flex items-center justify-center gap-2",
              "py-2 px-3 rounded-lg",
              "text-xs font-medium",
              "bg-zinc-900 dark:bg-zinc-50",
              "text-zinc-50 dark:text-zinc-900",
              "hover:bg-zinc-800 dark:hover:bg-zinc-200",
              "shadow-sm hover:shadow",
              "transition-all duration-200",
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
          <button
            type="button"
            onClick={openSalaryDialog}
            className={cn(
              "flex items-center justify-center gap-2",
              "py-2 px-3 rounded-lg",
              "text-xs font-medium",
              "bg-green-600 hover:bg-green-700",
              "text-white",
              "shadow-sm hover:shadow",
              "transition-all duration-200",
            )}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Salary</span>
          </button>
          <button
            type="button"
            onClick={openExpenseDialog}
            className={cn(
              "flex items-center justify-center gap-2",
              "py-2 px-3 rounded-lg",
              "text-xs font-medium",
              "bg-red-600 hover:bg-red-700",
              "text-white",
              "shadow-sm hover:shadow",
              "transition-all duration-200",
            )}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Expenses</span>
          </button>
        </div>
      </div>

      <AddEditAccountDialog
        isOpen={isAddEditAccountDialogOpen}
        onClose={() => setIsAddEditAccountDialogOpen(false)}
        onSubmit={handleAddEditAccount}
        initialData={editingAccount}
      />

      {/* Salary Setting Dialog */}
      <Dialog open={isSalaryDialogOpen} onOpenChange={setIsSalaryDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
          <DialogHeader>
            <DialogTitle>Set Monthly Salary</DialogTitle>
            <DialogDescription>
              Set your monthly salary amount. This will be used to calculate monthly revenue in analytics.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary" className="text-right">
                Salary
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <span className="inline-block text-lg font-medium text-gray-700 dark:text-gray-200">{currencySymbol}</span>
                <Input
                  id="salary"
                  value={tempSalaryAmount}
                  onChange={(e) => setTempSalaryAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                  className="flex-1"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9.]*"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSalarySubmit}>
              Save Salary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Monthly Expense Setting Dialog */}
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
          <DialogHeader>
            <DialogTitle>Set Monthly Expenses</DialogTitle>
            <DialogDescription>
              Set your monthly expenses amount. This will be used to calculate monthly expenses in analytics.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expense" className="text-right">
                Expenses
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <span className="inline-block text-lg font-medium text-gray-700 dark:text-gray-200">{currencySymbol}</span>
                <Input
                  id="expense"
                  value={tempExpenseAmount}
                  onChange={(e) => setTempExpenseAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                  className="flex-1"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9.]*"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleExpenseSubmit}>
              Save Expenses
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
