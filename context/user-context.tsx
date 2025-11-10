"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import Cookies from "js-cookie"

interface UserContextType {
  user: string | null
  login: (username: string) => void
  logout: () => void
  updateUsername: (newUsername: string) => void
  updateProfilePicture: (pictureData: string) => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  // Always initialize as null to avoid hydration mismatch between server and client
  const [user, setUser] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from cookie on mount (client-side only)
    const cookieUser = Cookies.get("demo_user")
    if (cookieUser) {
      setUser(cookieUser)
    }
    setIsLoading(false)
  }, [])

  const login = (username: string) => {
    setUser(username)
    Cookies.set("demo_user", username, { expires: 30 }) // 30 days
  }

  const logout = () => {
    // Clear all user-related data from localStorage
    if (user) {
      localStorage.removeItem(`dashboard_data_${user}`)
      localStorage.removeItem(`profile_picture_${user}`)
    }
    // Clear broker holdings (these are not user-specific but should be cleared on logout)
    localStorage.removeItem("groww_holdings")
    localStorage.removeItem("kite_holdings")
    
    setUser(null)
    Cookies.remove("demo_user")
  }

  const updateUsername = (newUsername: string) => {
    setUser(newUsername)
    Cookies.set("demo_user", newUsername, { expires: 30 })
  }

  const updateProfilePicture = (pictureData: string) => {
    if (user) {
      localStorage.setItem(`profile_picture_${user}`, pictureData)
    }
  }

  return (
    <UserContext.Provider value={{ user, login, logout, updateUsername, updateProfilePicture, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used within a UserProvider")
  return ctx
} 