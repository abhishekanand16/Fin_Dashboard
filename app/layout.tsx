import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "@/components/providers" //  <-- NEW

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Ledger Dashboard",
  description: "A modern dashboard with theme switching",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/placeholder-logo.png" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers> {/*  <-- wrap once with client providers */}
      </body>
    </html>
  )
}
