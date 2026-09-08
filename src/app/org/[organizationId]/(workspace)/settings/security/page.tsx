'use client'

import { use } from 'react'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { OrganizationSecuritySettings } from '@domains/security/components/OrganizationSecuritySettings'

/** Política de seguridad de la organización: MFA/Passkey obligatorios, TOTP, Recovery Codes (§4). */
export default function OrgSecuritySettingsPage({
  params,
}: {
  params: Promise<{ organizationId: string }>
}) {
  const { organizationId } = use(params)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Seguridad"
        description="Define los requisitos de autenticación fuerte que deben cumplir los miembros de esta organización."
      />
      <OrganizationSecuritySettings organizationId={organizationId} />
    </div>
  )
}
