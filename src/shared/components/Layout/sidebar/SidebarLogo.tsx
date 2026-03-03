import { MusilaLogo } from '@/src/shared/components/Icons/icons'
import Link from 'next/link'

export function SidebarLogo() {
  return (
    <div className="p-6 border-b border-[#2a3444]">
      <Link href="/app" className="flex items-center gap-2">
        <MusilaLogo className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold">
          <span className="text-primary">Músila</span>
          <span className="text-white"> -App</span>
        </span>
      </Link>
    </div>
  )
}