"use client"

import { createContext, useState, useContext, type ReactNode, useCallback, useEffect } from "react"
import { PiggyBank, TrendingUp, CreditCard } from "lucide-react"
import { useUser } from "@/context/user-context"

// Define types for AccountItem and ListItem (Event)
interface AccountItem {
  id: string
  title: string
  description?: string
  balance: string
  type: "savings" | "checking" | "investment" | "debt" | "salary"
}

interface ListItem {
  // Renamed from ListItem to EventItem for clarity in context
  id: string
  title: string
  subtitle: string
  icon: string // Store as string instead of LucideIcon
  iconStyle: string
  targetDate: string // Change from date to targetDate for completion
  time?: string
  amount?: string
  status: "pending" | "in-progress" | "completed"
  progress?: number
}

// Types for analytics data
interface RevenueItem { month: string; revenue: number }
interface ExpensesItem { month: string; expenses: number }

const EMPTY_REVENUE: RevenueItem[] = []
const EMPTY_EXPENSES: ExpensesItem[] = []

// Initial Data for Accounts
const INITIAL_ACCOUNTS: AccountItem[] = [
  {
    id: "1",
    title: "Main Savings",
    description: "Personal savings",
    balance: "₹8,459.45",
    type: "savings",
  },
  {
    id: "2",
    title: "Checking Account",
    description: "Daily expenses",
    balance: "₹2,850.00",
    type: "checking",
  },
  {
    id: "3",
    title: "Investment Portfolio",
    description: "Stock & ETFs",
    balance: "₹15,230.80",
    type: "investment",
  },
  {
    id: "4",
    title: "Credit Card",
    description: "Pending charges",
    balance: "₹1,200.00",
    type: "debt",
  },
  {
    id: "5",
    title: "Savings Account",
    description: "Emergency fund",
    balance: "₹3,000.00",
    type: "savings",
  },
  {
    id: "6",
    title: "Monthly Salary",
    description: "Primary income source",
    balance: "0",
    type: "salary",
  },
]

// Initial Data for Events
const INITIAL_EVENTS: ListItem[] = [
  {
    id: "1",
    title: "Emergency Fund",
    subtitle: "3 months of expenses saved",
    icon: "PiggyBank",
    iconStyle: "savings",
    targetDate: "2024-12-31T00:00:00.000Z",
    amount: "₹15,000",
    status: "in-progress",
    progress: 65,
  },
  {
    id: "2",
    title: "Stock Portfolio",
    subtitle: "Tech sector investment plan",
    icon: "TrendingUp",
    iconStyle: "investment",
    targetDate: "2024-06-30T00:00:00.000Z",
    amount: "₹50,000",
    status: "pending",
    progress: 30,
  },
  {
    id: "3",
    title: "Debt Repayment",
    subtitle: "Student loan payoff plan",
    icon: "CreditCard",
    iconStyle: "debt",
    targetDate: "2025-03-31T00:00:00.000Z",
    amount: "₹25,000",
    status: "in-progress",
    progress: 45,
  },
]

// Initial Data for Accounts (all zero/empty for new users)
const EMPTY_ACCOUNTS: AccountItem[] = [
  { id: "1", title: "Main Savings", description: "Personal savings", balance: "0", type: "savings" },
  { id: "2", title: "Checking Account", description: "Daily expenses", balance: "0", type: "checking" },
  { id: "3", title: "Investment Portfolio", description: "Stock & ETFs", balance: "0", type: "investment" },
  { id: "4", title: "Credit Card", description: "Pending charges", balance: "0", type: "debt" },
  { id: "5", title: "Savings Account", description: "Emergency fund", balance: "0", type: "savings" },
  { id: "6", title: "Monthly Salary", description: "Primary income source", balance: "0", type: "salary" },
]

// Initial Data for Events (empty for new users)
const EMPTY_EVENTS: ListItem[] = []

interface FinancialDataContextType {
  accounts: AccountItem[]
  addAccount: (account: AccountItem) => void
  updateAccount: (account: AccountItem) => void
  deleteAccount: (accountId: string) => void
  events: ListItem[]
  addEvent: (event: ListItem) => void
  updateEvent: (event: ListItem) => void
  deleteEvent: (eventId: string) => void
  currency: string
  setCurrency: (currency: string) => void
  revenueData: RevenueItem[]
  setRevenueData: (data: RevenueItem[]) => void
  expensesData: ExpensesItem[]
  setExpensesData: (data: ExpensesItem[]) => void
  salaryAmount: number
  setSalaryAmount: (amount: number) => void
  monthlyExpenseAmount: number
  setMonthlyExpenseAmount: (amount: number) => void
  clearUserData: () => void
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined)

export function FinancialDataProvider({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const [accounts, setAccounts] = useState<AccountItem[]>(EMPTY_ACCOUNTS)
  const [events, setEvents] = useState<ListItem[]>(EMPTY_EVENTS)
  const [currency, setCurrency] = useState<string>("INR")
  const [revenueData, setRevenueData] = useState<RevenueItem[]>(EMPTY_REVENUE)
  const [expensesData, setExpensesData] = useState<ExpensesItem[]>(EMPTY_EXPENSES)
  const [salaryAmount, setSalaryAmount] = useState<number>(0)
  const [monthlyExpenseAmount, setMonthlyExpenseAmount] = useState<number>(0)

  // Load data from localStorage when user changes
  useEffect(() => {
    if (!user) return
    const data = localStorage.getItem(`dashboard_data_${user}`)
    if (data) {
      try {
        const parsed = JSON.parse(data)
        setAccounts(parsed.accounts || EMPTY_ACCOUNTS)
        setEvents(parsed.events || EMPTY_EVENTS)
        setCurrency(parsed.currency || "INR")
        setRevenueData(parsed.revenueData || EMPTY_REVENUE)
        setExpensesData(parsed.expensesData || EMPTY_EXPENSES)
        setSalaryAmount(parsed.salaryAmount || 0)
        setMonthlyExpenseAmount(parsed.monthlyExpenseAmount || 0)
      } catch {
        setAccounts(EMPTY_ACCOUNTS)
        setEvents(EMPTY_EVENTS)
        setCurrency("INR")
        setRevenueData(EMPTY_REVENUE)
        setExpensesData(EMPTY_EXPENSES)
        setSalaryAmount(0)
        setMonthlyExpenseAmount(0)
      }
    } else {
      setAccounts(EMPTY_ACCOUNTS)
      setEvents(EMPTY_EVENTS)
      setCurrency("INR")
      setRevenueData(EMPTY_REVENUE)
      setExpensesData(EMPTY_EXPENSES)
      setSalaryAmount(0)
      setMonthlyExpenseAmount(0)
    }
  }, [user])

  // Save data to localStorage when any data changes
  useEffect(() => {
    if (!user) return
    const data = { accounts, events, currency, revenueData, expensesData, salaryAmount, monthlyExpenseAmount }
    localStorage.setItem(`dashboard_data_${user}` , JSON.stringify(data))
  }, [accounts, events, currency, revenueData, expensesData, salaryAmount, monthlyExpenseAmount, user])

  const addAccount = useCallback((newAccount: AccountItem) => {
    setAccounts((prev) => [...prev, newAccount])
  }, [])

  const updateAccount = useCallback((updatedAccount: AccountItem) => {
    setAccounts((prev) => prev.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc)))
  }, [])

  const deleteAccount = useCallback((accountId: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== accountId))
  }, [])

  const addEvent = useCallback((newEvent: ListItem) => {
    setEvents((prev) => [...prev, newEvent])
  }, [])

  const updateEvent = useCallback((updatedEvent: ListItem) => {
    setEvents((prev) => prev.map((evt) => (evt.id === updatedEvent.id ? updatedEvent : evt)))
  }, [])

  const deleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== eventId))
  }, [])

  const clearUserData = useCallback(() => {
    setAccounts(EMPTY_ACCOUNTS)
    setEvents(EMPTY_EVENTS)
    setCurrency("INR")
    setRevenueData(EMPTY_REVENUE)
    setExpensesData(EMPTY_EXPENSES)
    setSalaryAmount(0)
    setMonthlyExpenseAmount(0)
  }, [])

  return (
    <FinancialDataContext.Provider value={{ accounts, addAccount, updateAccount, deleteAccount, events, addEvent, updateEvent, deleteEvent, currency, setCurrency, revenueData, setRevenueData, expensesData, setExpensesData, salaryAmount, setSalaryAmount, monthlyExpenseAmount, setMonthlyExpenseAmount, clearUserData }}>
      {children}
    </FinancialDataContext.Provider>
  )
}

export function useFinancialData() {
  const context = useContext(FinancialDataContext)
  if (context === undefined) {
    throw new Error("useFinancialData must be used within a FinancialDataProvider")
  }
  return context
}
