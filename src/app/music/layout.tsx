import { AppHeader } from "@/src/shared/components/Layout/app-header"
import { AppSidebar } from '@/src/shared/components/Layout/sidebar/AppSidebar'

import type React from "react"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
   
     
        <div className="min-h-screen bg-background flex">
          {/* Sidebar lateral */}
          <AppSidebar />

          {/* Contenido principal */}
          <div className="flex-1 md:ml-64 flex flex-col min-h-screen pb-24">
            <AppHeader />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>

          {/* Reproductor fijo en la parte inferior
          <MusicPlayer />
          
          */}
          
        </div>
     
    
  )
}
