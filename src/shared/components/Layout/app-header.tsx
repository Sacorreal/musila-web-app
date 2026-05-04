"use client"

import { UserIcon } from "@/src/shared/components/Icons/icons"
import { ThemeToggle } from "@/src/shared/components/Layout/theme-toggle"
import { SearchBox } from "@/src/shared/components/Layout/SearchBox"
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store"
import { UserRole } from "@/src/domains/users/types/user.types"
import Link from "next/link"

import { Avatar, AvatarImage, AvatarFallback } from "@/src/shared/components/UI/avatar"

export function AppHeader() {
  const user = useAuthStore((s) => s.user)
  const role = user?.role
  const showSearch = role !== UserRole.AUTOR
  
  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md px-4 md:px-6 py-4 border-b">
      <div className="flex items-center justify-between gap-4">
        {/* Spacer for mobile menu toggle */}
        <div className="w-12 md:hidden flex-shrink-0" />

        {/* Search Box — oculto para autores */}
        <div className="flex-1 flex justify-center">
          {showSearch && <SearchBox />}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <ThemeToggle />
          <Link
            href="/music/perfil"
            className="transition-transform hover:scale-105 active:scale-95"
          >
            <Avatar className="h-11 w-11 border-2 border-border shadow-md ring-2 ring-background">
              <AvatarImage src={user?.avatarUrl} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-black uppercase">
                {user?.name?.[0] || <UserIcon className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  )
}
