import { cn } from '@/src/shared/libs/utils'
import Link from 'next/link'
import { MenuRoute } from '../../types'

type Props = {
  item: MenuRoute
  isActive: boolean
  onClick: () => void
}

export function SidebarNavItem({ item, isActive, onClick }: Props) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary/20 text-primary'
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      )}
    >
      <item.icon className="h-5 w-5" />
      {item.label}
    </Link>
  )
}