import type React from "react"
import { AuthProvider } from "@/domains/auth/auth.context"
import { PlayerProvider } from "@/domains/player/player.context"
import { AppSidebar } from "@/components/app/app-sidebar"
import { AppHeader } from "@/components/app/app-header"
import { MusicPlayer } from "@/components/app/music-player"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PlayerProvider>
        <div className="min-h-screen bg-background flex">
          {/* Sidebar lateral */}
          <AppSidebar />

          {/* Contenido principal */}
          <div className="flex-1 md:ml-64 flex flex-col min-h-screen pb-24">
            <AppHeader />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>

          {/* Reproductor fijo en la parte inferior */}
          <MusicPlayer />
        </div>
      </PlayerProvider>
    </AuthProvider>
  )
}
