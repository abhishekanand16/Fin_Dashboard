"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Only toggle between light and dark
  const nextTheme = theme === "dark" ? "light" : "dark"
  const icon = theme === "dark"
    ? <Sun className="h-5 w-5 text-gray-300 transition-all" />
    : <Moon className="h-5 w-5 text-gray-600 transition-all" />
  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme"

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className="relative p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-full transition-colors"
      aria-label={label}
    >
      {icon}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
