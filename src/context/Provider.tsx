"use client"

import { ThemeProvider } from "@/context/ThemeProvider"
import AuthProvider from "@/context/AuthProvider"
import { Toaster } from "@/components/ui/sonner"
import { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}