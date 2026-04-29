import type { MenuRoute } from '@shared/types/shared.types'
import { SidebarNavItem } from './SidebarNavItem'

type Props = {
  items: MenuRoute[]
  pathname: string
  onNavigate: () => void
  unreadChatCount?: number
}

export function SidebarNav({ items, pathname, onNavigate, unreadChatCount }: Props) {
  return (
    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      {items.map(item => (
        <SidebarNavItem
          key={item.href}
          item={item}
          isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
          onClick={onNavigate}
          badge={item.href === '/music/chat' ? unreadChatCount : undefined}
        />
      ))}
    </nav>
  )
}