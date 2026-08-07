import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { RegistrationFilesDashboard } from '@/src/domains/registration-file/components/RegistrationFilesDashboard'

export const metadata = { title: 'Expedientes — Musila' }

export default function ExpedientesPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
      <PageHeader
        title="Expedientes de Registro"
        description="Busca por número y gestiona el estado de todos tus expedientes desde un solo lugar."
        titleClassName="text-2xl font-black tracking-tighter uppercase"
      />
      <RegistrationFilesDashboard />
    </div>
  )
}
