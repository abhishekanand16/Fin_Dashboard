"use client"

import type { ReactNode } from "react"
import Sidebar from "./sidebar"
import TopNav from "./top-nav"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useStyle } from "@/components/style-provider"

export default function AppShell({ children }: { children: ReactNode }) {
  const { theme, resolvedTheme } = useTheme()
  const { style } = useStyle()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={`relative flex h-screen ${(resolvedTheme || theme) === "dark" ? "dark" : ""}`}>
      <Sidebar />
      <div className="w-full flex flex-1 flex-col relative z-10 overflow-hidden">
        {/* Subtle blue/teal background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background: (resolvedTheme || theme) === "dark"
              ? "radial-gradient(circle at 60% 20%, rgba(0, 255, 255, 0.32) 0, rgba(0, 255, 255, 0.18) 40%, transparent 80%)"
              : "radial-gradient(circle at 60% 20%, rgba(0, 180, 255, 0.28) 0, rgba(0, 180, 255, 0.16) 40%, rgba(0, 180, 255, 0.08) 80%)",
            filter: (resolvedTheme || theme) === "dark" ? "blur(80px)" : "blur(100px)",
          }}
        />
        <header className={style === "glass"
          ? "h-16 border-b border-cyan-200/40 bg-white/30 dark:bg-[#0F0F12]/30 backdrop-blur-xl shadow-lg z-20 relative"
          : "h-16 border-b border-gray-200 dark:border-[#1F1F23] bg-white/60 dark:bg-[#0F0F12]/60 backdrop-blur-md shadow-sm"
        }>
          <TopNav />
        </header>
        <main className={style === "glass" ? "flex-1 overflow-auto mt-[5.5rem]" : "flex-1 overflow-auto"}>{children}</main>
      </div>
    </div>
  )
} 