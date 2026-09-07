'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { adminAuthorizationHooks } from '@/src/domains/admin/authorization/authorization.hooks'
import { Button } from '@/src/shared/components/UI/button'
import { Checkbox } from '@/src/shared/components/UI/checkbox'
import { Switch } from '@/src/shared/components/UI/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog'
import type {
  CapabilityDto,
  OrganizationType,
} from '@/src/domains/admin/authorization/authorization.types'

const ALL_ORGANIZATION_TYPES: { value: OrganizationType; label: string }[] = [
  { value: 'LABEL', label: 'Label' },
  { value: 'PUBLISHER', label: 'Publisher' },
  { value: 'MANAGEMENT', label: 'Management' },
  { value: 'AGENCY', label: 'Agencia' },
  { value: 'MUSIC_LIBRARY', label: 'Music Library' },
  { value: 'OTHER', label: 'Otro' },
]

interface CapabilityConfigDialogProps {
  capability: CapabilityDto | null
  onClose: () => void
}

/** Edición de compatibilidad y estado de una capability; la key nunca cambia (§22). */
export function CapabilityConfigDialog({ capability, onClose }: CapabilityConfigDialogProps) {
  const { mutate: updateConfig, isPending } = adminAuthorizationHooks.useUpdateCapabilityConfig()

  const [organizationTypes, setOrganizationTypes] = useState<OrganizationType[]>([])
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (capability) {
      setOrganizationTypes(capability.organizationTypes)
      setIsActive(capability.isActive)
    }
  }, [capability])

  const toggleType = (type: OrganizationType) => {
    setOrganizationTypes((prev) =>
      prev.includes(type) ? prev.filter((entry) => entry !== type) : [...prev, type],
    )
  }

  return (
    <Dialog open={!!capability} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-base">{capability?.key}</DialogTitle>
          <DialogDescription>{capability?.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">
              Tipos de organización compatibles
              <span className="block text-xs font-normal text-muted-foreground">
                Sin selección = disponible para todos los tipos. El backend rechaza usos
                incompatibles aunque la UI los oculte (§20).
              </span>
            </legend>
            {ALL_ORGANIZATION_TYPES.map((type) => (
              <label key={type.value} className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  checked={organizationTypes.includes(type.value)}
                  onCheckedChange={() => toggleType(type.value)}
                />
                {type.label}
              </label>
            ))}
          </fieldset>

          <label className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
            <span>
              Capability activa
              <span className="block text-xs text-muted-foreground">
                Al desactivarla, deja de otorgarse en todos los contextos.
              </span>
            </span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            className="gap-2"
            disabled={isPending}
            onClick={() =>
              capability &&
              updateConfig(
                { id: capability.id, input: { organizationTypes, isActive } },
                { onSuccess: onClose },
              )
            }
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
