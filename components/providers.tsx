"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { FinancialDataProvider } from "@/context/financial-data-context"
import { UserProvider } from "@/context/user-context"
import { StyleProvider } from "@/components/style-provider"
import { Toaster } from "@/components/ui/sonner"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <FinancialDataProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <StyleProvider>
            {children}
            <Toaster />
          </StyleProvider>
        </ThemeProvider>
      </FinancialDataProvider>
    </UserProvider>
  )
}
