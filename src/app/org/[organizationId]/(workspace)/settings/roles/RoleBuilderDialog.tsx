'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { organizationsHooks } from '@/src/domains/organizations/organizations.hooks'
import type { CapabilityDto, RoleDto } from '@/src/domains/organizations/organizations.types'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import { Checkbox } from '@/src/shared/components/UI/checkbox'
import { Input } from '@/src/shared/components/UI/input'
import { Textarea } from '@/src/shared/components/UI/textarea'
import { Field, FieldLabel, FieldError } from '@/src/shared/components/UI/field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/UI/select'

type WizardStep = 'details' | 'capabilities' | 'summary'

/** Acciones consideradas sensibles: la UI advierte antes de otorgarlas (§15). */
const SENSITIVE_ACTIONS = new Set(['MANAGE', 'DELETE', 'APPROVE'])

interface RoleBuilderDialogProps {
  organizationId: string
  organizationType?: string
  isOpen: boolean
  editingRole?: RoleDto | null
  onClose: () => void
}

/**
 * Role Builder B2B (§15/§24): wizard que consume la MATRIZ DE CAPACIDADES
 * vía API (nunca hardcoded), agrupa por dominio, filtra por tipo de
 * membership, advierte sobre capabilities sensibles y muestra un resumen
 * antes de guardar. El backend re-valida todo al persistir.
 */
export function RoleBuilderDialog({
  organizationId,
  organizationType,
  isOpen,
  editingRole,
  onClose,
}: RoleBuilderDialogProps) {
  const [step, setStep] = useState<WizardStep>('details')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [roleType, setRoleType] = useState<'ORGANIZATION' | 'ROSTER'>('ORGANIZATION')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [nameError, setNameError] = useState<string | null>(null)

  const assignableTo = roleType === 'ORGANIZATION' ? 'ORGANIZATION_MEMBER' : 'ROSTER_MEMBER'
  const { data: catalog, isLoading: isLoadingCatalog } = organizationsHooks.useCapabilityCatalog(
    isOpen ? organizationId : undefined,
    { assignableTo, organizationType },
  )

  const { mutate: createRole, isPending: isCreating } =
    organizationsHooks.useCreateOrgRole(organizationId)
  const { mutate: updateRole, isPending: isUpdatingRole } =
    organizationsHooks.useUpdateOrgRole(organizationId)
  const { mutate: setCapabilities, isPending: isSettingCapabilities } =
    organizationsHooks.useSetOrgRoleCapabilities(organizationId)

  const isSaving = isCreating || isUpdatingRole || isSettingCapabilities

  useEffect(() => {
    if (isOpen) {
      setStep('details')
      setNameError(null)
      if (editingRole) {
        setName(editingRole.name)
        setDescription(editingRole.description ?? '')
        setRoleType(editingRole.type === 'ROSTER' ? 'ROSTER' : 'ORGANIZATION')
        setSelectedIds(
          (editingRole.roleCapabilities ?? []).map((roleCapability) => roleCapability.capabilityId),
        )
      } else {
        setName('')
        setDescription('')
        setRoleType('ORGANIZATION')
        setSelectedIds([])
      }
    }
  }, [isOpen, editingRole])

  const byDomain = useMemo(() => {
    const groups = new Map<string, CapabilityDto[]>()
    for (const capability of catalog ?? []) {
      const group = groups.get(capability.domain) ?? []
      group.push(capability)
      groups.set(capability.domain, group)
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [catalog])

  const selectedCapabilities = useMemo(
    () => (catalog ?? []).filter((capability) => selectedIds.includes(capability.id)),
    [catalog, selectedIds],
  )

  const sensitiveSelected = selectedCapabilities.filter((capability) =>
    SENSITIVE_ACTIONS.has(capability.action),
  )

  const toggle = (capabilityId: string) => {
    setSelectedIds((prev) =>
      prev.includes(capabilityId)
        ? prev.filter((id) => id !== capabilityId)
        : [...prev, capabilityId],
    )
  }

  const goNextFromDetails = () => {
    if (!name.trim()) {
      setNameError('El nombre del rol es obligatorio')
      return
    }
    setNameError(null)
    setStep('capabilities')
  }

  const save = () => {
    if (editingRole) {
      updateRole(
        { roleId: editingRole.id, input: { name: name.trim(), description: description.trim() || undefined } },
        {
          onSuccess: () =>
            setCapabilities(
              { roleId: editingRole.id, capabilityIds: selectedIds },
              { onSuccess: onClose },
            ),
        },
      )
      return
    }

    createRole(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        type: roleType,
        capabilityIds: selectedIds,
      },
      { onSuccess: onClose },
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingRole ? `Editar rol: ${editingRole.name}` : 'Crear rol'}</DialogTitle>
          <DialogDescription>
            {step === 'details' && 'Paso 1 de 3 · Nombre y tipo del rol'}
            {step === 'capabilities' && 'Paso 2 de 3 · Selecciona capabilities del catálogo global'}
            {step === 'summary' && 'Paso 3 de 3 · Revisa el resumen antes de guardar'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1">
          {step === 'details' && (
            <div className="space-y-4">
              <Field data-invalid={!!nameError}>
                <FieldLabel htmlFor="role-name">Nombre</FieldLabel>
                <Input
                  id="role-name"
                  placeholder="A&R Manager"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                {nameError && <FieldError errors={[{ message: nameError }]} />}
              </Field>

              <Field>
                <FieldLabel htmlFor="role-description">Descripción</FieldLabel>
                <Textarea
                  id="role-description"
                  placeholder="Qué hace este rol dentro de la organización"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </Field>

              {!editingRole && (
                <Field>
                  <FieldLabel>Tipo de rol</FieldLabel>
                  <Select
                    value={roleType}
                    onValueChange={(value) => {
                      setRoleType(value as 'ORGANIZATION' | 'ROSTER')
                      setSelectedIds([])
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ORGANIZATION">Staff de la organización</SelectItem>
                      <SelectItem value="ROSTER">Roster (artistas administrados)</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </div>
          )}

          {step === 'capabilities' && (
            <div className="space-y-5">
              {isLoadingCatalog ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Cargando catálogo" />
                </div>
              ) : byDomain.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No hay capabilities compatibles con este tipo de rol y organización.
                </p>
              ) : (
                byDomain.map(([domain, capabilities]) => (
                  <section key={domain} aria-label={`Capabilities de ${domain}`}>
                    <h3 className="mb-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                      {domain}
                    </h3>
                    <ul className="space-y-1.5">
                      {capabilities.map((capability) => {
                        const isSensitive = SENSITIVE_ACTIONS.has(capability.action)
                        return (
                          <li
                            key={capability.id}
                            className="flex items-start gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/40"
                          >
                            <Checkbox
                              id={`capability-${capability.id}`}
                              checked={selectedIds.includes(capability.id)}
                              onCheckedChange={() => toggle(capability.id)}
                            />
                            <label
                              htmlFor={`capability-${capability.id}`}
                              className="flex-1 cursor-pointer space-y-0.5"
                            >
                              <span className="flex flex-wrap items-center gap-2 text-sm font-medium">
                                <span className="font-mono text-xs">{capability.key}</span>
                                {isSensitive && (
                                  <Badge variant="destructive" className="gap-1 text-[10px]">
                                    <AlertTriangle className="h-3 w-3" aria-hidden />
                                    Sensible
                                  </Badge>
                                )}
                              </span>
                              <span className="block text-xs text-muted-foreground">
                                {capability.description}
                              </span>
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                ))
              )}
            </div>
          )}

          {step === 'summary' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border p-4">
                <h3 className="font-semibold">{name}</h3>
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
                <Badge variant="outline" className="mt-2">
                  {roleType === 'ORGANIZATION' ? 'Staff de la organización' : 'Roster'}
                </Badge>
              </div>

              {sensitiveSelected.length > 0 && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-500/5 p-3 text-sm">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
                  <p>
                    Este rol incluye {sensitiveSelected.length} capability(ies) sensible(s):{' '}
                    <span className="font-mono text-xs">
                      {sensitiveSelected.map((capability) => capability.key).join(', ')}
                    </span>
                  </p>
                </div>
              )}

              <div>
                <h4 className="mb-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Capabilities seleccionadas ({selectedCapabilities.length})
                </h4>
                <div className="flex flex-wrap gap-1">
                  {selectedCapabilities.map((capability) => (
                    <Badge key={capability.id} variant="secondary" className="font-mono text-[10px]">
                      {capability.key}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between border-t border-border pt-4">
          <Button
            variant="outline"
            className="gap-2"
            disabled={isSaving}
            onClick={() => {
              if (step === 'details') onClose()
              else setStep(step === 'summary' ? 'capabilities' : 'details')
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 'details' ? 'Cancelar' : 'Atrás'}
          </Button>

          {step !== 'summary' ? (
            <Button
              className="gap-2"
              disabled={step === 'capabilities' && selectedIds.length === 0}
              onClick={() => (step === 'details' ? goNextFromDetails() : setStep('summary'))}
            >
              Siguiente
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button className="gap-2" onClick={save} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingRole ? 'Guardar cambios' : 'Crear rol'}
            </Button>
          )}
        </footer>
      </DialogContent>
    </Dialog>
  )
}
