import Link from 'next/link'
import {
  Briefcase,
  Disc3,
  FileText,
  Globe,
  Headphones,
  Link as LinkIcon,
  Mic,
  Music,
  Radio,
  Settings,
  SlidersHorizontal,
  Star,
  type LucideIcon,
} from 'lucide-react'
import type { BlogTagDto } from '../../shared/blog.types'

export const RELATED_SERVICE_ICONS: Record<string, LucideIcon> = {
  headphones: Headphones,
  music: Music,
  mic: Mic,
  disc: Disc3,
  radio: Radio,
  sliders: SlidersHorizontal,
  settings: Settings,
  briefcase: Briefcase,
  globe: Globe,
  document: FileText,
  star: Star,
  link: LinkIcon,
}

export const RELATED_SERVICE_ICON_NAMES = Object.keys(RELATED_SERVICE_ICONS)

interface Props {
  tags: BlogTagDto[]
}

export function RelatedServicesSection({ tags }: Props) {
  if (tags.length === 0) return null

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="mb-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
        Servicios Relacionados
      </p>
      <div className="flex flex-col gap-1">
        {tags.map((tag) => {
          const Icon = RELATED_SERVICE_ICONS[tag.icon] ?? LinkIcon
          return (
            <Link
              key={tag.id}
              href={tag.url}
              className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-primary"
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" />
              {tag.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
