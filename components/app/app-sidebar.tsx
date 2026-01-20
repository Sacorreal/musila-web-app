"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/domains/auth/auth.context"
import { cn } from "@/lib/utils"
import { MusilaLogo, HomeIcon, SearchIcon, PlaylistIcon, UploadIcon, RequestIcon, UserIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/app", icon: HomeIcon, label: "Inicio" },
  { href: "/app/explore", icon: SearchIcon, label: "Explorar" },
  { href: "/app/playlists", icon: PlaylistIcon, label: "Mis playlists" },
  { href: "/app/upload", icon: UploadIcon, label: "Subir canción" },
  { href: "/app/requests", icon: RequestIcon, label: "Solicitudes" },
  { href: "/app/profile", icon: UserIcon, label: "Mi perfil" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-sidebar rounded-lg border border-sidebar-border"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-sidebar-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-sidebar-foreground" />
        )}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-[#1a2332] border-r border-[#2a3444] transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo section */}
        <div className="p-6 border-b border-[#2a3444]">
          <Link href="/app" className="flex items-center gap-2">
            <MusilaLogo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">
              <span className="text-primary">Músila</span>
              <span className="text-white"> -App</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4 px-4">
            Barra de Navegación Vertical
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            if (item.href === "/app/upload" && user?.role !== "COMPOSER") {
              return null
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive ? "bg-primary/20 text-primary" : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User section at bottom */}
        <div className="p-4 border-t border-[#2a3444]">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">{user?.name?.charAt(0) || "U"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.artisticName || user?.name || "Usuario"}</p>
              <p className="text-xs text-white/60 truncate">
                {user?.role === "COMPOSER" ? "Compositor" : "Intérprete"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {isOpen && <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
