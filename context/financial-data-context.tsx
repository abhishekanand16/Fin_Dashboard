"use client"

import { createContext, useState, useContext, type ReactNode, useCallback } from "react"
import { PiggyBank, TrendingUp, CreditCard } from "lucide-react"

// Define types for AccountItem and ListItem (Event)
interface AccountItem {
  id: string
  title: string
  description?: string
  balance: string
  type: "savings" | "checking" | "investment" | "debt"
}

interface ListItem {
  // Renamed from ListItem to EventItem for clarity in context
  id: string
  title: string
  subtitle: string
  icon: any // LucideIcon type
  iconStyle: string
  date: string
  time?: string
  amount?: string
  status: "pending" | "in-progress" | "completed"
  progress?: number
}

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
]

// Initial Data for Events
const INITIAL_EVENTS: ListItem[] = [
  {
    id: "1",
    title: "Emergency Fund",
    subtitle: "3 months of expenses saved",
    icon: PiggyBank,
    iconStyle: "savings",
    date: "Target: Dec 2024",
    amount: "₹15,000",
    status: "in-progress",
    progress: 65,
  },
  {
    id: "2",
    title: "Stock Portfolio",
    subtitle: "Tech sector investment plan",
    icon: TrendingUp,
    iconStyle: "investment",
    date: "Target: Jun 2024",
    amount: "₹50,000",
    status: "pending",
    progress: 30,
  },
  {
    id: "3",
    title: "Debt Repayment",
    subtitle: "Student loan payoff plan",
    icon: CreditCard,
    iconStyle: "debt",
    date: "Target: Mar 2025",
    amount: "₹25,000",
    status: "in-progress",
    progress: 45,
  },
]

interface FinancialDataContextType {
  accounts: AccountItem[]
  addAccount: (account: AccountItem) => void
  updateAccount: (account: AccountItem) => void
  events: ListItem[]
  addEvent: (event: ListItem) => void
  updateEvent: (event: ListItem) => void
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined)

export function FinancialDataProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<AccountItem[]>(INITIAL_ACCOUNTS)
  const [events, setEvents] = useState<ListItem[]>(INITIAL_EVENTS)

  const addAccount = useCallback((newAccount: AccountItem) => {
    setAccounts((prev) => [...prev, newAccount])
  }, [])

  const updateAccount = useCallback((updatedAccount: AccountItem) => {
    setAccounts((prev) => prev.map((acc) => (acc.id === updatedAccount.id ? updatedAccount : acc)))
  }, [])

  const addEvent = useCallback((newEvent: ListItem) => {
    setEvents((prev) => [...prev, newEvent])
  }, [])

  const updateEvent = useCallback((updatedEvent: ListItem) => {
    setEvents((prev) => prev.map((evt) => (evt.id === updatedEvent.id ? updatedEvent : evt)))
  }, [])

  return (
    <FinancialDataContext.Provider value={{ accounts, addAccount, updateAccount, events, addEvent, updateEvent }}>
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
