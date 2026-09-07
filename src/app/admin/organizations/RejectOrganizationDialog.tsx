'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog'
import { Button } from '@/src/shared/components/UI/button'
import { Label } from '@/src/shared/components/UI/label'
import { Textarea } from '@/src/shared/components/UI/textarea'
import { adminOrganizationsHooks } from '@/src/domains/admin/organizations/organizations.hooks'
import type { OrganizationDto } from '@/src/domains/admin/organizations/organizations.types'

interface RejectOrganizationDialogProps {
  organization: OrganizationDto | null
  onClose: () => void
}

export function RejectOrganizationDialog({ organization, onClose }: RejectOrganizationDialogProps) {
  const [reason, setReason] = useState('')
  const { mutate: rejectOrganization, isPending } = adminOrganizationsHooks.useRejectOrganization()

  const handleClose = () => {
    setReason('')
    onClose()
  }

  const handleConfirm = () => {
    if (!organization || !reason.trim()) return
    rejectOrganization(
      { id: organization.id, reason: reason.trim() },
      { onSuccess: handleClose },
    )
  }

  return (
    <Dialog open={!!organization} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rechazar solicitud</DialogTitle>
          <DialogDescription>
            &ldquo;{organization?.name}&rdquo; será notificada del rechazo con el motivo que escribas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Motivo del rechazo</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ej. El nombre legal no coincide con el documento aportado"
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending || !reason.trim()}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rechazando...
              </>
            ) : (
              'Rechazar solicitud'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
