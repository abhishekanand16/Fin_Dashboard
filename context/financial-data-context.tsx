"use client"

import { createContext, useState, useContext, type ReactNode, useCallback, useEffect, useRef } from "react"
import { useUser } from "@/context/user-context"

// Define types for AccountItem and ListItem (Event)
interface AccountItem {
  id: string
  title: string
  description?: string
  balance: string
  type: "savings" | "checking" | "investment" | "debt" | "salary"
}

interface EventItem {
  id: string
  title: string
  subtitle: string
  icon: string
  iconStyle: string
  targetDate: string
  time?: string
  amount?: string
  status: "pending" | "in-progress" | "completed"
  progress?: number
}

// Types for analytics data
interface RevenueItem { month: string; revenue: number }
interface ExpensesItem { month: string; expenses: number }

// Types for transactions
export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  accountId?: string
  paymentMethod?: string
  notes?: string
}

// Types for holdings
export interface Holding {
  id: string
  tradingsymbol: string
  exchange: string
  quantity: number
  average_price: number
  last_price: number
  pnl: number
  pnl_percentage: number
  broker: "kite" | "groww" | "other"
  broker_account?: string
}

const EMPTY_REVENUE: RevenueItem[] = []
const EMPTY_EXPENSES: ExpensesItem[] = []
const EMPTY_TRANSACTIONS: Transaction[] = []
const EMPTY_HOLDINGS: Holding[] = []

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
const INITIAL_EVENTS: EventItem[] = [
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
const EMPTY_EVENTS: EventItem[] = []

interface FinancialDataContextType {
  accounts: AccountItem[]
  addAccount: (account: AccountItem) => void
  updateAccount: (account: AccountItem) => void
  deleteAccount: (accountId: string) => void
  events: EventItem[]
  addEvent: (event: EventItem) => void
  updateEvent: (event: EventItem) => void
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
  transactions: Transaction[]
  addTransaction: (transaction: Transaction) => void
  addTransactions: (transactions: Transaction[]) => void
  updateTransaction: (transaction: Transaction) => void
  deleteTransaction: (transactionId: string) => void
  holdings: Holding[]
  addHolding: (holding: Holding) => void
  addHoldings: (holdings: Holding[]) => void
  updateHolding: (holding: Holding) => void
  deleteHolding: (holdingId: string) => void
  clearUserData: () => void
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined)

export function FinancialDataProvider({ children }: { children: ReactNode }) {
  const { user } = useUser()
  // Lazy initialization for accounts and events
  const [accounts, setAccounts] = useState<AccountItem[]>(() => {
    if (typeof window !== "undefined" && user) {
      const data = localStorage.getItem(`dashboard_data_${user}`)
      if (data) {
        try {
          const parsed = JSON.parse(data)
          return parsed.accounts || EMPTY_ACCOUNTS
        } catch {}
      }
    }
    return EMPTY_ACCOUNTS
  })
  const [events, setEvents] = useState<EventItem[]>(() => {
    if (typeof window !== "undefined" && user) {
      const data = localStorage.getItem(`dashboard_data_${user}`)
      if (data) {
        try {
          const parsed = JSON.parse(data)
          return parsed.events || EMPTY_EVENTS
        } catch {}
      }
    }
    return EMPTY_EVENTS
  })
  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window !== "undefined" && user) {
      const data = localStorage.getItem(`dashboard_data_${user}`)
      if (data) {
        try {
          const parsed = JSON.parse(data)
          return parsed.currency || "INR"
        } catch {}
      }
    }
    return "INR"
  })
  const [revenueData, setRevenueData] = useState<RevenueItem[]>(() => {
    if (typeof window !== "undefined" && user) {
      const data = localStorage.getItem(`dashboard_data_${user}`)
      if (data) {
        try {
          const parsed = JSON.parse(data)
          return parsed.revenueData || EMPTY_REVENUE
        } catch {}
      }
    }
    return EMPTY_REVENUE
  })
  const [expensesData, setExpensesData] = useState<ExpensesItem[]>(() => {
    if (typeof window !== "undefined" && user) {
      const data = localStorage.getItem(`dashboard_data_${user}`)
      if (data) {
        try {
          const parsed = JSON.parse(data)
          return parsed.expensesData || EMPTY_EXPENSES
        } catch {}
      }
    }
    return EMPTY_EXPENSES
  })
  const [salaryAmount, setSalaryAmount] = useState<number>(() => {
    if (typeof window !== "undefined" && user) {
      const data = localStorage.getItem(`dashboard_data_${user}`)
      if (data) {
        try {
          const parsed = JSON.parse(data)
          return parsed.salaryAmount || 0
        } catch {}
      }
    }
    return 0
  })
  const [monthlyExpenseAmount, setMonthlyExpenseAmount] = useState<number>(() => {
    if (typeof window !== "undefined" && user) {
      const data = localStorage.getItem(`dashboard_data_${user}`)
      if (data) {
        try {
          const parsed = JSON.parse(data)
          return parsed.monthlyExpenseAmount || 0
        } catch {}
      }
    }
    return 0
  })
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== "undefined" && user) {
      const data = localStorage.getItem(`dashboard_data_${user}`)
      if (data) {
        try {
          const parsed = JSON.parse(data)
          return parsed.transactions || EMPTY_TRANSACTIONS
        } catch {}
      }
    }
    return EMPTY_TRANSACTIONS
  })
  const [holdings, setHoldings] = useState<Holding[]>(() => {
    if (typeof window !== "undefined" && user) {
      const data = localStorage.getItem(`dashboard_data_${user}`)
      if (data) {
        try {
          const parsed = JSON.parse(data)
          return parsed.holdings || EMPTY_HOLDINGS
        } catch {}
      }
    }
    return EMPTY_HOLDINGS
  })

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
        setTransactions(parsed.transactions || EMPTY_TRANSACTIONS)
        setHoldings(parsed.holdings || EMPTY_HOLDINGS)
      } catch {
        setAccounts(EMPTY_ACCOUNTS)
        setEvents(EMPTY_EVENTS)
        setCurrency("INR")
        setRevenueData(EMPTY_REVENUE)
        setExpensesData(EMPTY_EXPENSES)
        setSalaryAmount(0)
        setMonthlyExpenseAmount(0)
        setTransactions(EMPTY_TRANSACTIONS)
        setHoldings(EMPTY_HOLDINGS)
      }
    } else {
      setAccounts(EMPTY_ACCOUNTS)
      setEvents(EMPTY_EVENTS)
      setCurrency("INR")
      setRevenueData(EMPTY_REVENUE)
      setExpensesData(EMPTY_EXPENSES)
      setSalaryAmount(0)
      setMonthlyExpenseAmount(0)
      setTransactions(EMPTY_TRANSACTIONS)
      setHoldings(EMPTY_HOLDINGS)
    }
  }, [user])

  // Debounce localStorage writes
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (!user) return
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    debounceTimeout.current = setTimeout(() => {
      const data = { accounts, events, currency, revenueData, expensesData, salaryAmount, monthlyExpenseAmount, transactions, holdings }
      localStorage.setItem(`dashboard_data_${user}` , JSON.stringify(data))
    }, 100)
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    }
  }, [accounts, events, currency, revenueData, expensesData, salaryAmount, monthlyExpenseAmount, transactions, holdings, user])

  const addAccount = useCallback((newAccount: AccountItem) => {
    setAccounts((prev) => [...prev, newAccount])
  }, [])

  const updateAccount = useCallback((updatedAccount: AccountItem) => {
    setAccounts((prev) => prev.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc)))
  }, [])

  const deleteAccount = useCallback((accountId: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== accountId))
  }, [])

  const addEvent = useCallback((newEvent: EventItem) => {
    setEvents((prev) => [...prev, newEvent])
  }, [])

  const updateEvent = useCallback((updatedEvent: EventItem) => {
    setEvents((prev) => prev.map((evt) => (evt.id === updatedEvent.id ? updatedEvent : evt)))
  }, [])

  const deleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== eventId))
  }, [])

  const addTransaction = useCallback((newTransaction: Transaction) => {
    setTransactions((prev) => [...prev, newTransaction])
  }, [])

  const addTransactions = useCallback((newTransactions: Transaction[]) => {
    setTransactions((prev) => [...prev, ...newTransactions])
  }, [])

  const updateTransaction = useCallback((updatedTransaction: Transaction) => {
    setTransactions((prev) => prev.map((txn) => (txn.id === updatedTransaction.id ? updatedTransaction : txn)))
  }, [])

  const deleteTransaction = useCallback((transactionId: string) => {
    setTransactions((prev) => prev.filter((txn) => txn.id !== transactionId))
  }, [])

  const addHolding = useCallback((newHolding: Holding) => {
    setHoldings((prev) => [...prev, newHolding])
  }, [])

  const addHoldings = useCallback((newHoldings: Holding[]) => {
    setHoldings((prev) => [...prev, ...newHoldings])
  }, [])

  const updateHolding = useCallback((updatedHolding: Holding) => {
    setHoldings((prev) => prev.map((h) => (h.id === updatedHolding.id ? updatedHolding : h)))
  }, [])

  const deleteHolding = useCallback((holdingId: string) => {
    setHoldings((prev) => prev.filter((h) => h.id !== holdingId))
  }, [])

  // Batch state resets in clearUserData
  const clearUserData = useCallback(() => {
    setAccounts(() => EMPTY_ACCOUNTS)
    setEvents(() => EMPTY_EVENTS)
    setCurrency(() => "INR")
    setRevenueData(() => EMPTY_REVENUE)
    setExpensesData(() => EMPTY_EXPENSES)
    setSalaryAmount(() => 0)
    setMonthlyExpenseAmount(() => 0)
    setTransactions(() => EMPTY_TRANSACTIONS)
    setHoldings(() => EMPTY_HOLDINGS)
    
    // Clear localStorage data
    if (user) {
      localStorage.removeItem(`dashboard_data_${user}`)
      localStorage.removeItem(`profile_picture_${user}`)
    }
    // Clear broker holdings
    localStorage.removeItem("groww_holdings")
    localStorage.removeItem("kite_holdings")
  }, [user])

  return (
    <FinancialDataContext.Provider value={{ accounts, addAccount, updateAccount, deleteAccount, events, addEvent, updateEvent, deleteEvent, currency, setCurrency, revenueData, setRevenueData, expensesData, setExpensesData, salaryAmount, setSalaryAmount, monthlyExpenseAmount, setMonthlyExpenseAmount, transactions, addTransaction, addTransactions, updateTransaction, deleteTransaction, holdings, addHolding, addHoldings, updateHolding, deleteHolding, clearUserData }}>
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
