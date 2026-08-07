'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/src/shared/components/UI/button'
import { Badge } from '@/src/shared/components/UI/badge'
import { Input } from '@/src/shared/components/UI/input'
import { Card, CardContent } from '@/src/shared/components/UI/card'
import { DownloadButton } from '@/src/shared/components/UI/DownloadButton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog'
import { useMarkProfileRegistered, useMarkProfileSubmitted } from '../../hooks/use-registration-file.hooks'
import type { RegistrationFileDto, RegistrationProfileKey } from '../../types/registration-file.types'

interface Props {
  registrationFile: RegistrationFileDto
}

function ProfileStatusRow({ registrationFile, profileKey }: { registrationFile: RegistrationFileDto; profileKey: RegistrationProfileKey }) {
  const profileStatus = registrationFile.profileStatuses.find((p) => p.profileKey === profileKey)
  const status = profileStatus?.status ?? 'pendiente'

  const { mutate: markSubmitted, isPending: isMarkingSubmitted } = useMarkProfileSubmitted()
  const { mutateAsync: markRegistered, isPending: isMarkingRegistered } = useMarkProfileRegistered()

  const [showRegisterDialog, setShowRegisterDialog] = useState(false)
  const [officialNumber, setOfficialNumber] = useState('')

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3">
        <div>
          <p className="font-medium text-foreground">{profileKey}</p>
          {profileStatus?.officialRegistryNumber && (
            <p className="text-xs text-muted-foreground">N.° oficial: {profileStatus.officialRegistryNumber}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={status === 'registrado' ? 'default' : status === 'presentado' ? 'secondary' : 'outline'}>
            {status === 'registrado' ? 'Registrado' : status === 'presentado' ? 'Presentado' : 'Pendiente'}
          </Badge>

          {status === 'pendiente' && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isMarkingSubmitted}
              onClick={() => markSubmitted({ id: registrationFile.id, profileKey })}
            >
              {isMarkingSubmitted ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Marcar presentado'}
            </Button>
          )}

          {status === 'presentado' && (
            <Button type="button" size="sm" variant="outline" onClick={() => setShowRegisterDialog(true)}>
              Marcar registrado
            </Button>
          )}
        </div>
      </CardContent>

      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Marcar {profileKey} como registrado</DialogTitle>
            <DialogDescription>Ingresa el número de registro oficial que recibiste de la entidad.</DialogDescription>
          </DialogHeader>
          <Input
            value={officialNumber}
            onChange={(e) => setOfficialNumber(e.target.value)}
            placeholder="Ej. SAYCO-2026-000123"
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowRegisterDialog(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={!officialNumber || isMarkingRegistered}
              onClick={async () => {
                await markRegistered({ id: registrationFile.id, profileKey, officialRegistryNumber: officialNumber })
                setShowRegisterDialog(false)
                setOfficialNumber('')
              }}
            >
              {isMarkingRegistered ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export function ReadyStep({ registrationFile }: Props) {
  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center gap-2 py-4">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <h3 className="text-lg font-bold text-foreground">¡Expediente listo!</h3>
        <p className="text-sm text-muted-foreground">
          Descarga el paquete y llévalo a cada entidad para presentarlo manualmente.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <DownloadButton
          fetchUrl={`/api/registration-file/${registrationFile.id}/download/pdf`}
          filename={`expediente-${registrationFile.caseNumber}.pdf`}
          label="Descargar PDF resumen"
        />
        <DownloadButton
          fetchUrl={`/api/registration-file/${registrationFile.id}/download/zip`}
          filename={`expediente-${registrationFile.caseNumber}.zip`}
          label="Descargar ZIP completo"
          variant="outline"
        />
      </div>

      <div className="space-y-3 text-left">
        <h4 className="text-sm font-semibold text-foreground">Estado de presentación por entidad</h4>
        {registrationFile.activeProfileKeys.map((profileKey) => (
          <ProfileStatusRow key={profileKey} registrationFile={registrationFile} profileKey={profileKey} />
        ))}
      </div>
    </div>
  )
}
