import { AppHeader } from "@/src/components/app/app-header"
import { AppSidebar } from "@/src/components/app/app-sidebar"
import { MusicPlayer } from "@/src/components/app/music-player"
import { AuthProvider } from "@/src/domains/auth/components/auth.context"
import { PlayerProvider } from "@/src/domains/player/player.context"
import type React from "react"

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
