import { cn } from '@/src/shared/libs/cn'
import Link from 'next/link'
import type { MenuRoute } from '@shared/types/shared.types'

type Props = {
  item: MenuRoute
  isActive: boolean
  onClick: () => void
  badge?: number
}

export function SidebarNavItem({ item, isActive, onClick, badge }: Props) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary/20 text-primary'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      )}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      <span className="flex-1">{item.label}</span>
      {badge != null && badge > 0 && (
        <span className="ml-auto inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black shadow-sm shadow-primary/30 animate-in zoom-in duration-200">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  )
}