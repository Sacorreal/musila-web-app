'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/src/shared/components/UI/button'
import { LoadingState } from '@/src/shared/components/UI/LoadingState'
import { CompletenessProgress } from '../CompletenessProgress'
import { ChecklistPanel } from '../ChecklistPanel'
import { useCompleteness, useMarkReadyForSubmission } from '../../hooks/use-registration-file.hooks'
import type { RegistrationFileDto } from '../../types/registration-file.types'

interface Props {
  registrationFile: RegistrationFileDto
  onNext: () => void
}

export function ValidationStep({ registrationFile, onNext }: Props) {
  const { data: validation, isLoading } = useCompleteness(registrationFile.id)
  const { mutateAsync: markReady, isPending } = useMarkReadyForSubmission()

  if (isLoading || !validation) {
    return <LoadingState message="Calculando completitud del expediente..." />
  }

  const hasErrors = validation.errors.length > 0

  const handleMarkReady = async () => {
    try {
      await markReady(registrationFile.id)
      onNext()
    } catch {
      // el toast de error ya lo maneja el hook
    }
  }

  return (
    <div className="space-y-6">
      <CompletenessProgress percentage={validation.overallPercentage} />

      <div className="grid gap-3 sm:grid-cols-2">
        {validation.domains
          .filter((d) => d.applicable)
          .map((domain) => (
            <div key={domain.domain} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
              <span className="text-muted-foreground">{domain.domain.replace(/_/g, ' ')}</span>
              <span className="font-semibold">{domain.percentage}%</span>
            </div>
          ))}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Checklist</h3>
        <ChecklistPanel items={validation.checklist} />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="button" disabled={hasErrors || isPending} onClick={handleMarkReady}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Marcar listo para presentar'}
        </Button>
      </div>
    </div>
  )
}
