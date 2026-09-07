'use client'

import { AlertCircle, Landmark } from 'lucide-react'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { useSocietyAffiliations } from '../society-affiliations.hooks'
import { SocietyAffiliationForm } from './SocietyAffiliationForm'
import { SocietyAffiliationsTable } from './SocietyAffiliationsTable'
import { SocietyAffiliationsTableSkeleton } from './SocietyAffiliationsTableSkeleton'

/**
 * Sección "Derechos y Sociedades" del perfil del autor (§6 del requerimiento
 * `musila_cmo_society_affiliation_metadata_requirement.md`): lista y gestiona
 * las afiliaciones propias a sociedades de gestión colectiva, seleccionadas
 * siempre desde el catálogo controlado (nunca texto libre).
 */
export function SocietyAffiliationsTab() {
  const { data: affiliations, isLoading, error } = useSocietyAffiliations()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Derechos y Sociedades"
        description="Sociedades de gestión colectiva a las que estás afiliado, por tipo de derecho y territorio."
        actions={<SocietyAffiliationForm />}
      />

      {isLoading ? (
        <SocietyAffiliationsTableSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-12 text-center">
          <AlertCircle className="h-10 w-10 text-destructive/60" />
          <p className="text-sm text-muted-foreground">No se pudieron cargar tus afiliaciones. Intenta de nuevo más tarde.</p>
        </div>
      ) : !affiliations || affiliations.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-12 text-center">
          <Landmark className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground">Aún no tienes afiliaciones registradas</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Agrega tu primera sociedad de gestión colectiva (ej. SAYCO) indicando el tipo de derecho y el territorio.
          </p>
        </div>
      ) : (
        <SocietyAffiliationsTable affiliations={affiliations} />
      )}
    </div>
  )
}
