"use client"
import React, { createContext, useContext, useEffect, useState } from "react"

// Types for style
export type AppStyle = "normal" | "glass"

interface StyleContextType {
  style: AppStyle
  setStyle: (style: AppStyle) => void
}

const StyleContext = createContext<StyleContextType | undefined>(undefined)

export const StyleProvider = ({ children }: { children: React.ReactNode }) => {
  const [style, setStyleState] = useState<AppStyle>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("app-style") as AppStyle) || "normal"
    }
    return "normal"
  })

  useEffect(() => {
    localStorage.setItem("app-style", style)
  }, [style])

  const setStyle = (newStyle: AppStyle) => {
    setStyleState(newStyle)
  }

  return (
    <StyleContext.Provider value={{ style, setStyle }}>
      {children}
    </StyleContext.Provider>
  )
}

export function useStyle() {
  const context = useContext(StyleContext)
  if (!context) {
    throw new Error("useStyle must be used within a StyleProvider")
  }
  return context
} 