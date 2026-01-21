'use client'

import { Menu, X } from 'lucide-react'

type Props = {
  isOpen: boolean
  onToggle: () => void
}

export function SidebarToggle({ isOpen, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle menu"
      className="fixed top-4 left-4 z-50 md:hidden p-2 bg-sidebar rounded-lg border border-sidebar-border"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  )
}