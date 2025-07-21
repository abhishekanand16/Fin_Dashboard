"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import Cookies from "js-cookie"

interface UserContextType {
  user: string | null
  login: (username: string) => void
  logout: () => void
  updateUsername: (newUsername: string) => void
  updateProfilePicture: (pictureData: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null)

  useEffect(() => {
    // Try to load user from cookie on mount
    const cookieUser = Cookies.get("demo_user")
    if (cookieUser) setUser(cookieUser)
  }, [])

  const login = (username: string) => {
    setUser(username)
    Cookies.set("demo_user", username, { expires: 30 }) // 30 days
  }

  const logout = () => {
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
    <UserContext.Provider value={{ user, login, logout, updateUsername, updateProfilePicture }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used within a UserProvider")
  return ctx
} 