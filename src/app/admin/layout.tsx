import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/src/domains/admin/components/AdminSidebar'
import { AdminHeader } from '@/src/domains/admin/components/AdminHeader'
import { MusicPlayer } from '@/src/domains/player/components/MusicPlayer'
import { fetchMyStaffPermissions } from '@/src/domains/admin/staff-members/staff-members.actions'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) redirect('/login')

  let userName: string | undefined
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.planType !== 'admin' && payload.planType !== 'superadmin') redirect('/music')
    userName = payload.name
  } catch {
    redirect('/login')
  }

  // Solo UX: filtra qué secciones ve el staff en el menú, según su rol interno.
  // La autorización real ocurre en el backend vía StaffPermissionGuard en cada request.
  const { permissions } = await fetchMyStaffPermissions().catch(() => ({ permissions: [] as string[] }))

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle admin grid pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <AdminSidebar permissions={permissions} />

      <div className="flex min-h-screen flex-col md:ml-64">
        <AdminHeader userName={userName} />
        <main className="flex-1 p-4 md:p-8 pb-28">{children}</main>
      </div>

      <MusicPlayer />
    </div>
  )
}
