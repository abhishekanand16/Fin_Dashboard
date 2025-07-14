"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { FinancialDataProvider } from "@/context/financial-data-context"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <FinancialDataProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </FinancialDataProvider>
  )
}
