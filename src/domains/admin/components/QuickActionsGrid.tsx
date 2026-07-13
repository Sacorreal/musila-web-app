import Link from 'next/link'

const quickActions = [
  { href: '/admin/users', label: 'Gestionar Usuarios', colorClass: 'text-blue-500 bg-blue-500/10' },
  { href: '/admin/genres', label: 'Gestionar Géneros', colorClass: 'text-violet-500 bg-violet-500/10' },
  { href: '/admin/tracks', label: 'Ver Tracks', colorClass: 'text-emerald-500 bg-emerald-500/10' },
  { href: '/admin/requests', label: 'Ver Solicitudes', colorClass: 'text-amber-500 bg-amber-500/10' },
]

export function QuickActionsGrid() {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4">Acciones Rápidas</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map(({ href, label, colorClass }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}>
              <span className="text-lg font-black">→</span>
            </div>
            <span className="text-sm font-semibold group-hover:text-primary transition-colors">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
