"use client"

import { Loader2 } from "lucide-react"
import { useState } from "react"
import { ArtistsCarousel } from "@/src/domains/artists/components/ArtistsCarousel"

export default function AppHomePage() {

  const [isLoading, setIsLoading] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
   <main className="container mx-auto p-4 md:p-8">
     {/* Contenido principal de la app */}
     <ArtistsCarousel />
   </main>
  )
}
