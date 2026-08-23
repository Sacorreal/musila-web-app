'use client'

import { useState } from 'react'
import { Check, Clock, Loader2, UserCheck, X } from 'lucide-react'
import { organizationsHooks } from '../organizations.hooks'
import type {
  AccessRequestDto,
  MembershipType,
  RoleDto,
} from '../organizations.types'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import { Label } from '@/src/shared/components/UI/label'
import { Input } from '@/src/shared/components/UI/input'
import { Textarea } from '@/src/shared/components/UI/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/UI/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/shared/components/UI/dialog'
import { useUploadStorage } from '@/src/domains/storage/hooks/use-upload-storage'
import { StorageFolder } from '@/src/domains/storage/types/storage.types'

function displayName(request: AccessRequestDto): string {
  if (!request.user) return request.userId
  return `${request.user.name} ${request.user.lastName ?? ''}`.trim()
}

function RequestSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border p-4">
      <div className="space-y-2">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="h-3 w-56 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-8 w-40 animate-pulse rounded bg-muted" />
    </div>
  )
}

interface Props {
  organizationId: string
}

export function AccessRequestsPanel({ organizationId }: Props) {
  const { data: requests, isLoading, error } = organizationsHooks.useAccessRequests(
    organizationId,
    'PENDING',
  )
  const { data: roles } = organizationsHooks.useOrgRoles(organizationId)
  const { data: memberships } = organizationsHooks.useMyMemberships()
  const { mutate: approve, isPending: isApproving } =
    organizationsHooks.useApproveAccessRequest(organizationId)
  const { mutate: reject, isPending: isRejecting } =
    organizationsHooks.useRejectAccessRequest(organizationId)
  const { mutateAsync: uploadFiles, isPending: isUploading } = useUploadStorage()

  const organization = memberships?.organizationMemberships.find(
    (m) => m.organizationId === organizationId,
  )?.organization
  const isPublisher = organization?.type === 'PUBLISHER'

  const [approveTarget, setApproveTarget] = useState<AccessRequestDto | null>(null)
  const [rejectTarget, setRejectTarget] = useState<AccessRequestDto | null>(null)
  const [membershipType, setMembershipType] = useState<MembershipType>('ORGANIZATION')
  const [roleId, setRoleId] = useState<string>('')
  const [reason, setReason] = useState('')
  const [editorialPercentage, setEditorialPercentage] = useState('')
  const [editorialFile, setEditorialFile] = useState<File | null>(null)
  const [editorialError, setEditorialError] = useState<string | null>(null)

  const requiresEditorialRelationship = membershipType === 'ROSTER' && isPublisher

  const openApprove = (request: AccessRequestDto) => {
    setMembershipType('ORGANIZATION')
    setRoleId('')
    setEditorialPercentage('')
    setEditorialFile(null)
    setEditorialError(null)
    setApproveTarget(request)
  }

  const isApprovePending = isApproving || isUploading

  const handleApprove = async () => {
    if (!approveTarget) return

    let editorialRelationship: { percentage: number; contractKey?: string; contractUrl?: string } | undefined

    if (requiresEditorialRelationship) {
      const percentage = Number(editorialPercentage)
      if (!editorialPercentage || Number.isNaN(percentage) || percentage <= 0 || percentage > 100) {
        setEditorialError('Ingresa un porcentaje válido entre 0 y 100')
        return
      }
      setEditorialError(null)

      editorialRelationship = { percentage }
      if (editorialFile) {
        const [uploaded] = await uploadFiles([
          { field: 'publishingContractDoc', file: editorialFile, folder: StorageFolder.PUBLISHING_CONTRACT_DOCS },
        ])
        editorialRelationship.contractKey = uploaded.key
        editorialRelationship.contractUrl = uploaded.publicUrl
      }
    }

    approve(
      { requestId: approveTarget.id, input: { membershipType, roleId, editorialRelationship } },
      { onSuccess: () => setApproveTarget(null) },
    )
  }

  const openReject = (request: AccessRequestDto) => {
    setReason('')
    setRejectTarget(request)
  }

  // Al cambiar el tipo, el rol seleccionado deja de ser válido para el nuevo tipo.
  const changeMembershipType = (value: MembershipType) => {
    setMembershipType(value)
    setRoleId('')
  }

  const assignableRoles = (roles ?? []).filter((role: RoleDto) => role.type === membershipType)

  if (isLoading) {
    return (
      <div className="space-y-3">
        <RequestSkeleton />
        <RequestSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
        Error al cargar las solicitudes de acceso.
      </p>
    )
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
          <Clock className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No hay solicitudes pendientes</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Cuando alguien se registre con tu enlace de invitación, su solicitud aparecerá aquí.
        </p>
      </div>
    )
  }

  return (
    <>
      <ul className="space-y-3">
        {requests.map((request) => (
          <li
            key={request.id}
            className="flex flex-col gap-3 rounded-2xl border border-border p-4 transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{displayName(request)}</p>
              <p className="truncate text-xs text-muted-foreground">
                {request.user?.email}
                {request.user?.citizenID
                  ? ` · ${request.user.typeCitizenID ?? 'Doc'} ${request.user.citizenID}`
                  : ''}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                Solicitó el{' '}
                {new Date(request.createdAt).toLocaleDateString('es-CO', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                Pendiente
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-red-500 hover:text-red-600"
                onClick={() => openReject(request)}
              >
                <X className="h-3.5 w-3.5" />
                Rechazar
              </Button>
              <Button size="sm" className="gap-1" onClick={() => openApprove(request)}>
                <UserCheck className="h-3.5 w-3.5" />
                Aprobar
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* Aprobación: tipo + rol */}
      <Dialog open={!!approveTarget} onOpenChange={(open) => !open && setApproveTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Aprobar a {approveTarget ? displayName(approveTarget) : ''}</DialogTitle>
            <DialogDescription>
              Elige el tipo de usuario y el rol. El usuario recibirá una notificación con sus
              funciones y podrá acceder al workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="membership-type">Tipo de usuario</Label>
              <Select
                value={membershipType}
                onValueChange={(value) => changeMembershipType(value as MembershipType)}
              >
                <SelectTrigger id="membership-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORGANIZATION">Staff</SelectItem>
                  <SelectItem value="ROSTER">Roster</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role">Rol</Label>
              <Select value={roleId} onValueChange={setRoleId}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {assignableRoles.length === 0 ? (
                    <div className="px-2 py-3 text-center text-xs text-muted-foreground">
                      No hay roles para este tipo. Crea uno en la sección de Roles.
                    </div>
                  ) : (
                    assignableRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                        {role.source === 'SYSTEM' ? ' · SYSTEM' : ''}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {requiresEditorialRelationship && (
              <div className="space-y-3 rounded-xl border border-border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">Relación editora-autor</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Editora</Label>
                    <p className="rounded-md border border-transparent bg-background px-2.5 py-1.5 text-sm">
                      {organization?.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label>IPI</Label>
                    <p className="rounded-md border border-transparent bg-background px-2.5 py-1.5 text-sm">
                      {organization?.ipiNumber || 'Sin IPI registrado'}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="editorial-percentage">Porcentaje de participación</Label>
                  <Input
                    id="editorial-percentage"
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    value={editorialPercentage}
                    onChange={(e) => setEditorialPercentage(e.target.value)}
                    placeholder="20"
                  />
                  {editorialError && <p className="text-xs text-destructive">{editorialError}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="editorial-contract">Contrato (PDF, opcional)</Label>
                  <Input
                    id="editorial-contract"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setEditorialFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveTarget(null)} disabled={isApprovePending}>
              Cancelar
            </Button>
            <Button className="gap-2" disabled={isApprovePending || !roleId} onClick={handleApprove}>
              {isApprovePending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Aprobar acceso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rechazo: motivo opcional */}
      <Dialog open={!!rejectTarget} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rechazar solicitud</DialogTitle>
            <DialogDescription>
              Rechazarás la solicitud de {rejectTarget ? displayName(rejectTarget) : ''}. Puedes
              indicar un motivo (opcional).
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Motivo del rechazo (opcional)"
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)} disabled={isRejecting}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="gap-2"
              disabled={isRejecting}
              onClick={() =>
                rejectTarget &&
                reject(
                  { requestId: rejectTarget.id, reason: reason.trim() || undefined },
                  { onSuccess: () => setRejectTarget(null) },
                )
              }
            >
              {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
              Rechazar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
