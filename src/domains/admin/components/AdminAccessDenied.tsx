import { ShieldAlert } from 'lucide-react'

interface AdminAccessDeniedProps {
  message?: string
}

/** Solo UX: la autorización real ocurre en el backend vía StaffPermissionGuard en cada request. */
export function AdminAccessDenied({
  message = 'Tu rol interno no tiene permiso para acceder a esta sección.',
}: AdminAccessDeniedProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
      <ShieldAlert className="h-10 w-10 text-muted-foreground/50" />
      <h2 className="text-lg font-bold text-foreground">Acceso denegado</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
