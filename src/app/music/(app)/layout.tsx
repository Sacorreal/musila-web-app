"use client"

import type React from "react"

import { AppHeader } from "@/src/components/app/app-header"
import { AppSidebar } from "@/src/components/app/app-sidebar"
import { MusicPlayer } from "@/src/components/app/music-player"
import { useAuth } from "@/src/domains/auth/components/auth.context"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 pb-28">{children}</main>
        <MusicPlayer />
      </div>
    </div>
  )
}
