"use client"

import { UserIcon } from "@/src/shared/components/Icons/icons"
import { ThemeToggle } from "@/src/shared/components/Layout/theme-toggle"
import { SearchBox } from "@/src/shared/components/Layout/SearchBox"
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store"
import { UserPlanType } from "@/src/domains/users/types/user.types"
import Link from "next/link"
import { Zap } from "lucide-react"

import { Avatar, AvatarImage, AvatarFallback } from "@/src/shared/components/UI/avatar"
import { NotificationMenu } from "@/src/domains/notifications/components/NotificationMenu"
import { VerifiedBadge } from "@/src/shared/components/UI/verified-badge"

export function AppHeader() {
  const user = useAuthStore((s) => s.user)
  const planType = user?.planType
  const showSearch = planType !== UserPlanType.PLAN_AUTOR
  const isFree = user?.plan === 'free'
  
  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md px-4 md:px-6 py-4 border-b">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Spacer for mobile menu toggle */}
        <div className="w-12 md:hidden flex-shrink-0" />

        {/* Search Box — oculto para autores */}
        <div className="flex-1 flex justify-center">
          {showSearch && <SearchBox />}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {isFree && (
            <Link
              href="/#pricing"
              className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-95"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span className="hidden sm:inline">Pásate a Pro</span>
            </Link>
          )}
          <NotificationMenu />
          <ThemeToggle />
          <Link
            href="/music/perfil"
            className="transition-transform hover:scale-105 active:scale-95 relative"
          >
            <Avatar className="h-9 w-9 sm:h-11 sm:w-11 border-2 border-border shadow-md ring-2 ring-background">
              <AvatarImage src={user?.avatarUrl} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-black uppercase">
                {user?.name?.[0] || <UserIcon className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
            {user?.plan === 'pro' && (
              <span className="absolute -bottom-1 -right-1 bg-background rounded-full p-px shadow">
                <VerifiedBadge size={14} />
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
