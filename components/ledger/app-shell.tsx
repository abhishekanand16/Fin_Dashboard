"use client"

import type { ReactNode } from "react"
import Sidebar from "./sidebar"
import TopNav from "./top-nav"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useStyle } from "@/components/style-provider"
import { useUser } from "@/context/user-context"

export default function AppShell({ children }: { children: ReactNode }) {
  const { theme, resolvedTheme } = useTheme()
  const { style } = useStyle()
  const { isLoading } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state until both theme and user are ready
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 to-teal-100 dark:from-zinc-900 dark:to-zinc-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative flex h-screen ${(resolvedTheme || theme) === "dark" ? "dark" : ""} ${style === "glass" ? "bg-gradient-to-br from-sky-300/60 via-teal-200/60 to-cyan-100/80" : ""}` }>
      <Sidebar />
      <div className="w-full flex flex-1 flex-col relative z-10 overflow-hidden">
        {style !== "glass" && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: (resolvedTheme || theme) === "dark"
                ? "radial-gradient(circle at 55% 10%, rgba(100, 220, 240, 0.32) 0, rgba(100, 220, 240, 0.18) 40%, transparent 80%)"
                : "radial-gradient(circle at 55% 10%, rgba(120, 210, 240, 0.45) 0, rgba(100, 200, 230, 0.25) 40%, rgba(140, 230, 250, 0.18) 70%, rgba(130, 220, 245, 0.12) 95%, transparent 100%)",
              filter: (resolvedTheme || theme) === "dark" ? "blur(100px)" : "blur(220px)",
            }}
          />
        )}
        <header className={style === "glass"
          ? "h-16 bg-transparent border-none shadow-none z-20 relative"
          : "h-16 border-b border-gray-200 dark:border-[#1F1F23] bg-white/60 dark:bg-[#0F0F12]/60 backdrop-blur-md shadow-sm"
        }>
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
} 