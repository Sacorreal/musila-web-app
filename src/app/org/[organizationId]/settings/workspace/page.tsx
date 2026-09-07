'use client'

import { use, useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { organizationsHooks } from '@/src/domains/organizations/organizations.hooks'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Field, FieldLabel } from '@/src/shared/components/UI/field'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'

/** Personalización del workspace: nombre y logo de la organización (§2). */
export default function OrgWorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ organizationId: string }>
}) {
  const { organizationId } = use(params)

  const { data: trackspaces, isLoading } = organizationsHooks.useOrgTrackspaces(organizationId)
  const { mutate: updateTrackspace, isPending } =
    organizationsHooks.useUpdateOrgTrackspace(organizationId)

  const defaultTrackspace = trackspaces?.find((trackspace) => trackspace.isDefault) ?? trackspaces?.[0]

  const [name, setName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    if (defaultTrackspace) {
      setName(defaultTrackspace.name)
      setLogoUrl(defaultTrackspace.logoUrl ?? '')
    }
  }, [defaultTrackspace])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workspace"
        description="Personaliza el nombre y el logo con el que tu equipo y tu roster ven este espacio."
      />

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      ) : !defaultTrackspace ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          La organización no tiene un workspace configurado.
        </div>
      ) : (
        <form
          className="max-w-xl space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault()
            updateTrackspace({
              trackspaceId: defaultTrackspace.id,
              input: { name: name.trim(), logoUrl: logoUrl.trim() || null },
            })
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- preview de URL externa arbitraria
                <img src={logoUrl} alt="Logo del workspace" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-muted-foreground">
                  {name.charAt(0).toUpperCase() || '?'}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium">{name || 'Workspace'}</p>
              <p className="text-xs text-muted-foreground">Vista previa del branding</p>
            </div>
          </div>

          <Field>
            <FieldLabel htmlFor="workspace-name">Nombre del workspace</FieldLabel>
            <Input
              id="workspace-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={150}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="workspace-logo">URL del logo</FieldLabel>
            <Input
              id="workspace-logo"
              type="url"
              placeholder="https://cdn.musila.com/logos/mi-logo.png"
              value={logoUrl}
              onChange={(event) => setLogoUrl(event.target.value)}
            />
          </Field>

          <div className="flex justify-end">
            <Button type="submit" className="gap-2" disabled={isPending || !name.trim()}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Guardar cambios
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
