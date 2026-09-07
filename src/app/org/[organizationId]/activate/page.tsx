'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, ShieldCheck, UserCog, Wand2 } from 'lucide-react'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Label } from '@/src/shared/components/UI/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/shared/components/UI/card'
import { Badge } from '@/src/shared/components/UI/badge'
import { LegalIdentityForm } from '@/src/domains/legal-identity/components/LegalIdentityForm'
import {
  useActivateOrganizationAdmin,
  useCheckOrganizationVerification,
  useMyOrganization,
  useMyTrackspaces,
  useUpdateMyTrackspace,
} from '@/src/domains/organizations/hooks/business-registration.hooks'

const STATUS_LABELS: Record<string, string> = {
  EN_TRAMITE: 'En trámite',
  APROBADA: 'Aprobada',
  CREADA: 'Creada',
  VERIFICADA: 'Verificada',
  RECHAZADA: 'Rechazada',
}

export default function ActivateOrganizationPage({
  params,
}: {
  params: Promise<{ organizationId: string }>
}) {
  const { organizationId } = use(params)
  const router = useRouter()

  const { data: organization, isLoading: isLoadingOrg } = useMyOrganization(organizationId)
  const { data: trackspaces } = useMyTrackspaces(organizationId)
  const trackspace = trackspaces?.[0]

  const { mutate: activateAdmin, isPending: isActivating } = useActivateOrganizationAdmin(organizationId)
  const { mutate: updateTrackspace, isPending: isSavingWorkspace } = useUpdateMyTrackspace(organizationId)
  const { mutate: checkVerification, isPending: isVerifying } = useCheckOrganizationVerification(organizationId)

  const [workspaceName, setWorkspaceName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    if (trackspace) {
      setWorkspaceName(trackspace.name ?? '')
      setLogoUrl(trackspace.logoUrl ?? '')
    }
  }, [trackspace])

  useEffect(() => {
    if (organization?.status === 'VERIFICADA') {
      router.push(`/org/${organizationId}`)
    }
  }, [organization?.status, organizationId, router])

  if (isLoadingOrg) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        No se encontró la organización.
      </div>
    )
  }

  if (organization.status === 'RECHAZADA') {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center space-y-3">
        <h1 className="text-2xl font-black uppercase tracking-tighter italic">Solicitud rechazada</h1>
        <p className="text-muted-foreground">{organization.rejectionReason}</p>
      </div>
    )
  }

  if (organization.status === 'EN_TRAMITE' || organization.status === 'APROBADA') {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center space-y-3">
        <h1 className="text-2xl font-black uppercase tracking-tighter italic">
          {STATUS_LABELS[organization.status]}
        </h1>
        <p className="text-muted-foreground">
          Musila está revisando tu registro. Te notificaremos por email cuando puedas continuar.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">Activa tu organización</h1>
          <p className="text-sm text-muted-foreground">{organization.name}</p>
        </div>
        <Badge variant="secondary">{STATUS_LABELS[organization.status]}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserCog className="h-4 w-4" /> 1. Activa tu perfil de administrador
          </CardTitle>
          <CardDescription>
            Confirma que eres el administrador de esta organización dentro de Musila.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => activateAdmin()} disabled={isActivating} className="gap-2">
            {isActivating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Activar mi perfil de administrador
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wand2 className="h-4 w-4" /> 2. Personaliza tu workspace
          </CardTitle>
          <CardDescription>Nombre y logo con los que verá tu equipo el espacio de trabajo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre del workspace</Label>
            <Input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>URL del logo</Label>
            <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
          </div>
          <Button
            variant="outline"
            disabled={isSavingWorkspace || !trackspace}
            onClick={() =>
              trackspace &&
              updateTrackspace({ trackspaceId: trackspace.id, input: { name: workspaceName, logoUrl } })
            }
          >
            {isSavingWorkspace ? 'Guardando...' : 'Guardar workspace'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4" /> 3. Registra al Representante Legal
          </CardTitle>
          <CardDescription>
            Completa tu identidad legal — es el requisito para que la organización quede verificada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LegalIdentityForm />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => checkVerification()} disabled={isVerifying} size="lg" className="gap-2">
          {isVerifying && <Loader2 className="h-4 w-4 animate-spin" />}
          Verificar mi organización
        </Button>
      </div>
    </div>
  )
}
