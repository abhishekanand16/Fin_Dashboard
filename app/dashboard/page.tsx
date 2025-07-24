"use client"

import Dashboard from "@/components/ledger/dashboard"
import { useUser } from "@/context/user-context"
import { useState } from "react"

export default function DashboardPage() {
  const { user, login } = useUser()
  const [input, setInput] = useState("")
  const [error, setError] = useState("")

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-zinc-900 dark:to-zinc-800">
        <form
          className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg flex flex-col gap-4 min-w-[320px] border border-gray-200 dark:border-zinc-800"
          onSubmit={e => {
            e.preventDefault()
            if (!input.trim()) {
              setError("Please enter your name or email.")
              return
            }
            login(input.trim())
          }}
        >
          <h2 className="text-2xl font-bold text-center mb-2 text-zinc-900 dark:text-zinc-100">Demo Login</h2>
          <input
            className="border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-zinc-800 dark:text-zinc-100"
            placeholder="Enter your name or email"
            value={input}
            onChange={e => { setInput(e.target.value); setError("") }}
            autoFocus
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors"
          >
            Login
          </button>
          <div className="text-xs text-zinc-500 text-center mt-2">No password needed. Data is stored in your browser only.</div>
        </form>
      </div>
    )
  }

  return (
    <Dashboard />
  )
}
