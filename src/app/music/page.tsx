"use client"

import { Loader2 } from "lucide-react"
import { useState } from "react"

export default function AppHomePage() {



  const [isLoading, setIsLoading] = useState(true)

  

   

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
   <>Contenido principal de la app</>
  )
}
