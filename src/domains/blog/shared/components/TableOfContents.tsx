'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/src/shared/libs/cn'
import type { MarkdownHeading } from '../markdown-heading.util'

interface Props {
  headings: MarkdownHeading[]
}

export function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-100px 0px -70% 0px' },
    )

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="Tabla de contenido" className="space-y-1">
      <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground">En este artículo</p>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={cn(
            'block rounded-lg px-2 py-1.5 text-sm transition-colors',
            heading.level === 3 && 'ml-3',
            activeId === heading.id
              ? 'bg-primary/10 font-medium text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  )
}
