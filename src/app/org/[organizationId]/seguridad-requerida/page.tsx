'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ShieldAlert, KeyRound, Smartphone, ShieldQuestion } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/components/UI/card'
import { Badge } from '@shared/components/UI/badge'

import { useMfaStatus } from '@domains/security/hooks/security.hooks'
import { PasskeyRegistration } from '@domains/security/components/PasskeyRegistration'
import { MfaStatus } from '@domains/security/components/MfaStatus'
import { RecoveryCodes } from '@domains/security/components/RecoveryCodes'

/**
 * Bloquea el acceso al workspace hasta que se cumpla la política de
 * seguridad de la organización (§3.2). No es omitible: a diferencia de
 * `PasskeySetup` (usuarios personales), aquí no hay botón "Ahora no".
 */
export default function SecurityRequiredPage({
  params,
}: {
  params: Promise<{ organizationId: string }>
}) {
  const { organizationId } = use(params)
  const router = useRouter()

  const { data: status, isLoading } = useMfaStatus(organizationId)
  const policy = status?.organizationPolicy

  useEffect(() => {
    if (policy?.satisfied) {
      router.push(`/org/${organizationId}`)
    }
  }, [policy?.satisfied, organizationId, router])

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const missing = policy?.missing ?? []

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-6 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="h-7 w-7" />
        </span>
        <h1 className="text-2xl font-black uppercase italic tracking-tighter">
          Seguridad requerida para continuar
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Esta organización exige requisitos adicionales de seguridad para acceder al workspace.
          Complétalos para continuar.
        </p>
        {missing.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {missing.map((item) => (
              <Badge key={item} variant="destructive">
                {item === 'PASSKEY' && 'Passkey requerida'}
                {item === 'MFA' && 'Verificación en dos pasos requerida'}
                {item === 'RECOVERY_CODES' && 'Códigos de recuperación requeridos'}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {missing.includes('PASSKEY') && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound className="h-4 w-4 text-primary" /> Crea una Passkey
            </CardTitle>
            <CardDescription>
              Usa Face ID, huella, PIN o el método de seguridad de tu dispositivo. Es obligatoria
              para acceder a este workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasskeyRegistration triggerLabel="Crear Passkey" triggerVariant="default" />
          </CardContent>
        </Card>
      )}

      {missing.includes('MFA') && !missing.includes('PASSKEY') && (
        <MfaStatus organizationId={organizationId} />
      )}

      {missing.includes('RECOVERY_CODES') && (
        <Card className="border-amber-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldQuestion className="h-4 w-4 text-amber-500" /> Genera tus códigos de
              recuperación
            </CardTitle>
            <CardDescription>
              Esta organización exige tener códigos de recuperación vigentes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecoveryCodes />
          </CardContent>
        </Card>
      )}

      <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
        <Smartphone className="h-3.5 w-3.5" />
        Al completar los requisitos, te redirigiremos automáticamente al workspace.
      </p>
    </div>
  )
}
