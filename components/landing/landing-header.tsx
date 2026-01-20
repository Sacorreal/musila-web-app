"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MusilaLogo } from "@/components/icons"
import { Menu, X } from "lucide-react"

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <MusilaLogo className="h-8 w-8 text-primary" />
            
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Características
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cómo funciona
            </Link>
            <Link
              href="#testimonials"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Testimonios
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button className="shadow-lg" variant="ghost" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Comenzar gratis</Link>
            </Button>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-4 py-4 space-y-4">
            <Link
              href="#features"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Características
            </Link>
            <Link
              href="#how-it-works"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Cómo funciona
            </Link>
            <Link
              href="#testimonials"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonios
            </Link>
            <div className="pt-4 space-y-2">
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/register">Comenzar gratis</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
