import { redirect } from 'next/navigation'
import { getMfaStatus } from '@domains/security/services/security.actions'

/**
 * Cierra el workspace protegido si la política de seguridad de la
 * organización (§3.2) no está satisfecha — la Passkey/MFA es obligatoria
 * cuando la organización lo exige. Vive en un route group separado de
 * `activate/` y `seguridad-requerida/` (fuera de este grupo) para no
 * redirigir la propia pantalla de remediación hacia sí misma.
 *
 * Solo UX: el backend re-valida en cada request vía
 * `WorkspaceSecurityComplianceGuard`. Si la consulta falla (error de red),
 * se deja pasar para no bloquear el workspace por una falla transitoria.
 */
export default async function WorkspaceComplianceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ organizationId: string }>
}) {
  const { organizationId } = await params

  const status = await getMfaStatus(organizationId).catch(() => null)

  if (status?.organizationPolicy && !status.organizationPolicy.satisfied) {
    redirect(`/org/${organizationId}/seguridad-requerida`)
  }

  return <>{children}</>
}
