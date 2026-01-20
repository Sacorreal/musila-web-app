"use client"

import { useAuth } from "@/domains/auth/auth.context"
import { UserIcon } from "@/components/icons"
import Link from "next/link"

export function AppHeader() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-20 bg-[#2a3a4a] px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Spacer for mobile menu */}
        <div className="w-12 md:hidden" />

        {/* Greeting */}
        <h1 className="text-xl md:text-2xl font-semibold text-white">Hola, {user?.name || "Usuario"}</h1>

        {/* Profile icon */}
        <Link href="/app/profile" className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <UserIcon className="h-6 w-6 text-white" />
        </Link>
      </div>
    </header>
  )
}
