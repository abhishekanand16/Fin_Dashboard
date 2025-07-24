"use client"

import type { ReactNode } from "react"
import Sidebar from "./sidebar"
import TopNav from "./top-nav"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useStyle } from "@/components/style-provider"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { theme } = useTheme()
  const { style } = useStyle()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={`relative flex h-screen ${theme === "dark" ? "dark" : ""}`}>
      <Sidebar />
      <div className="w-full flex flex-1 flex-col relative z-10 overflow-hidden">
        {style !== "glass" && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: "radial-gradient(circle at 60% 20%, rgba(0, 210, 255, 0.18) 0, rgba(0, 210, 255, 0.10) 40%, transparent 80%)",
              filter: "blur(80px)",
            }}
          />
        )}
        <header className={style === "glass"
          ? "h-16 bg-transparent border-none shadow-none"
          : "h-16 border-b border-gray-200 dark:border-[#1F1F23] bg-white/60 dark:bg-[#0F0F12]/60 backdrop-blur-md shadow-sm"
        }>
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
