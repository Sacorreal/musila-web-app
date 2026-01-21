import { MenuRoute } from '../../types'
import { SidebarNavItem } from './SidebarNavItem'

type Props = {
  items: MenuRoute[]
  pathname: string
  onNavigate: () => void
}

export function SidebarNav({ items, pathname, onNavigate }: Props) {
  return (
    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      

      {items.map(item => (
        <SidebarNavItem
          key={item.href}
          item={item}
          isActive={pathname === item.href}
          onClick={onNavigate}
        />
      ))}
    </nav>
  )
}