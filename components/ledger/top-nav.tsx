"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronRight } from "lucide-react"
import Profile01 from "./profile-01"
import Link from "next/link"
import { ThemeToggle } from "../theme-toggle"
import { useFinancialData } from "@/context/financial-data-context"
import { useUser } from "@/context/user-context"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStyle } from "@/components/style-provider"

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function TopNav() {
  const pathname = usePathname()
  const { currency, setCurrency, clearUserData } = useFinancialData()
  const { user, logout } = useUser()
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const { style } = useStyle()

  useEffect(() => {
    if (user) {
      const savedPicture = localStorage.getItem(`profile_picture_${user}`)
      if (savedPicture) {
        setProfilePicture(savedPicture)
      }
    }
  }, [user])

  const currencyOptions = [
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
    { code: "ZAR", symbol: "R", name: "South African Rand" },
  ]

  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter((segment) => segment !== "")
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }]

    pathSegments.forEach((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/")
      const label = segment.charAt(0).toUpperCase() + segment.slice(1)
      breadcrumbs.push({ label, href })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <nav className={
      style === "glass"
        ? "px-3 sm:px-6 flex items-center justify-between bg-transparent border-none shadow-none h-full"
        : "px-3 sm:px-6 flex items-center justify-between bg-white dark:bg-[#0F0F12] border-b border-gray-200 dark:border-[#1F1F23] h-full"
    }>
      <div className="font-medium text-sm flex items-center space-x-1 truncate max-w-[300px]">
        Dashboard
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto sm:ml-0">
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className={
            style === "glass"
              ? "w-[120px] rounded-full bg-white/30 dark:bg-[#1F1F23]/30 backdrop-blur border border-cyan-200/40 shadow-sm"
              : "w-[120px] rounded-full"
          }>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-[#0F0F12] border border-gray-200 dark:border-[#1F1F23]">
            {currencyOptions.map((option) => (
              <SelectItem key={option.code} value={option.code}>
                {option.symbol} {option.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className={
            style === "glass"
              ? "focus:outline-none rounded-full bg-white/30 dark:bg-[#1F1F23]/30 backdrop-blur border border-cyan-200/40 shadow-sm"
              : "focus:outline-none"
          }>
            <img
              src={profilePicture || "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"}
              alt="User avatar"
              width={32}
              height={32}
              className={
                style === "glass"
                  ? "rounded-full ring-2 ring-gray-200 dark:ring-[#2B2B30] sm:w-8 sm:h-8 cursor-pointer object-cover border border-cyan-200/60 bg-white/30 dark:bg-[#1F1F23]/30 backdrop-blur"
                  : "rounded-full ring-2 ring-gray-200 dark:ring-[#2B2B30] sm:w-8 sm:h-8 cursor-pointer object-cover border border-cyan-200/60"
              }
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-[280px] sm:w-80 bg-background border-border rounded-lg shadow-lg"
          >
            <Profile01 avatar={profilePicture || "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"} name={user || undefined} />
            {user && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-zinc-800 flex flex-col gap-2">
                <div className="text-xs text-zinc-500 truncate">{user}</div>
                <div className="flex gap-2">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white rounded px-3 py-1 text-xs font-semibold transition-colors"
                    onClick={logout}
                  >
                    Logout
                  </button>
                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded px-3 py-1 text-xs font-semibold transition-colors"
                    onClick={() => {
                      if (confirm("This will clear all your data. Are you sure?")) {
                        clearUserData()
                        alert("Data cleared! You can now add new events without duplicate ID issues.")
                      }
                    }}
                  >
                    Clear Data
                  </button>
                </div>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
