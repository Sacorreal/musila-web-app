"use client"

import { UserIcon } from "@/src/shared/components/Icons/icons"
import Link from "next/link"

import { ThemeToggle } from "@/src/shared/components/Layout/theme-toggle"

export function AppHeader() {
 const user = {
  name : "fernando"
 }

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md px-4 md:px-6 py-4 border-b">
      <div className="flex items-center justify-between">
        {/* Spacer for mobile menu */}
        <div className="w-12 md:hidden" />

        {/* Greeting */}
        <h1 className="text-xl md:text-2xl font-semibold text-foreground">Hola, {user?.name || "Usuario"}</h1>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* Profile icon */}
          <Link href="/app/profile" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
            <UserIcon className="h-6 w-6 text-foreground" />
          </Link>
        </div>
      </div>
    </header>
  )
}
