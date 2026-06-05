"use client"

import { MusilaLogo } from "@/src/shared/components/Icons/icons"
import { Button } from "@/src/shared/components/UI/button"
import { LanguageSelector } from "@/src/shared/components/UI/language-selector"
import { ThemeToggle } from "@/src/shared/components/Layout/theme-toggle"
import { useTranslation } from "@/src/shared/libs/i18n"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <MusilaLogo className="h-10 w-auto text-primary" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t.nav.features}
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.nav.howItWorks}
            </Link>
            <Link
              href="#testimonials"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.nav.testimonials}
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.nav.pricing}
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
            <Button className="shadow-lg" variant="ghost" asChild>
              <Link href="/login">{t.nav.login}</Link>
            </Button>
            <Button asChild>
              <Link href="/#pricing">{t.nav.getStarted}</Link>
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
              {t.nav.features}
            </Link>
            <Link
              href="#how-it-works"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.nav.howItWorks}
            </Link>
            <Link
              href="#testimonials"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.nav.testimonials}
            </Link>
            <Link
              href="#pricing"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t.nav.pricing}
            </Link>
            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-center gap-2 pb-2">
                <LanguageSelector compact />
                <ThemeToggle />
              </div>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/login">{t.nav.login}</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/#pricing">{t.nav.getStarted}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
