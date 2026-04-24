"use client"

import { UserIcon } from "@/src/shared/components/Icons/icons"
import { ThemeToggle } from "@/src/shared/components/Layout/theme-toggle"
import { SearchBox } from "@/src/shared/components/Layout/SearchBox"
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store"
import { UserRole } from "@/src/domains/users/types/user.types"
import Link from "next/link"

export function AppHeader() {
  const role = useAuthStore((s) => s.user?.role)
  const showSearch = role !== UserRole.AUTOR
  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md px-4 md:px-6 py-4 border-b">
      <div className="flex items-center justify-between gap-4">
        {/* Spacer for mobile menu toggle */}
        <div className="w-12 md:hidden flex-shrink-0" />

        {/* Search Box — oculto para autores */}
        <div className="flex-1 flex justify-start">
          {showSearch && <SearchBox />}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <ThemeToggle />
          <Link
            href="/app/profile"
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <UserIcon className="h-6 w-6 text-foreground" />
          </Link>
        </div>
      </div>
    </header>
  )
}
