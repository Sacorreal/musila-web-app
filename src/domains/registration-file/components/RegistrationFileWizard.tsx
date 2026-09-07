'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/src/shared/libs/cn'
import { LoadingState } from '@/src/shared/components/UI/LoadingState'
import { useQueryClient } from '@tanstack/react-query'
import { useRegistrationFile } from '../hooks/use-registration-file.hooks'
import { RegistrationFileBadge } from './RegistrationFileBadge'
import { GeneralInfoStep } from './steps/GeneralInfoStep'
import { ParticipantsStep } from './steps/ParticipantsStep'
import { PhonogramStep } from './steps/PhonogramStep'
import { PublishingStep } from './steps/PublishingStep'
import { DerivativeWorkStep } from './steps/DerivativeWorkStep'
import { CommissionedWorkStep } from './steps/CommissionedWorkStep'
import { AiUsageStep } from './steps/AiUsageStep'
import { DocumentsStep } from './steps/DocumentsStep'
import { ValidationStep } from './steps/ValidationStep'
import { ReadyStep } from './steps/ReadyStep'
import type { RegistrationFileDto } from '../types/registration-file.types'

interface Props {
  registrationFileId: string
  initialData: RegistrationFileDto
}

const STEP_LABELS = [
  'Información General',
  'Participantes',
  'Fonograma',
  'Editorial',
  'Obra Derivada',
  'Obra por Encargo',
  'Inteligencia Artificial',
  'Documentos',
  'Validación',
  'Expediente Listo',
] as const

export function RegistrationFileWizard({ registrationFileId, initialData }: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const queryClient = useQueryClient()

  const { data: registrationFile } = useRegistrationFile(registrationFileId, true)
  const rf = registrationFile ?? initialData

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEP_LABELS.length - 1))

  const handleStepClick = (index: number) => {
    // Refresca datos antes de saltar de paso, para reflejar guardados previos.
    queryClient.invalidateQueries({ queryKey: ['registration-file', registrationFileId] })
    setCurrentStep(index)
  }

  if (!rf) return <LoadingState message="Cargando expediente..." />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Expediente de Registro</p>
          <h1 className="text-2xl font-black text-foreground">{rf.title}</h1>
        </div>
        <RegistrationFileBadge status={rf.status} caseNumber={rf.caseNumber} />
      </div>

      <nav className="flex gap-1 overflow-x-auto pb-2" aria-label="Pasos del expediente">
        {STEP_LABELS.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => handleStepClick(index)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
              index === currentStep
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:bg-accent',
            )}
          >
            {index < currentStep && <CheckCircle2 className="h-3 w-3" />}
            {index + 1}. {label}
          </button>
        ))}
      </nav>

      <div className="rounded-xl border p-4 sm:p-6">
        {currentStep === 0 && <GeneralInfoStep registrationFile={rf} onNext={goNext} />}
        {currentStep === 1 && <ParticipantsStep registrationFile={rf} onNext={goNext} />}
        {currentStep === 2 && <PhonogramStep registrationFile={rf} onNext={goNext} />}
        {currentStep === 3 && <PublishingStep registrationFile={rf} onNext={goNext} />}
        {currentStep === 4 && <DerivativeWorkStep registrationFile={rf} onNext={goNext} />}
        {currentStep === 5 && <CommissionedWorkStep registrationFile={rf} onNext={goNext} />}
        {currentStep === 6 && <AiUsageStep registrationFile={rf} onNext={goNext} />}
        {currentStep === 7 && <DocumentsStep registrationFile={rf} onNext={goNext} />}
        {currentStep === 8 && <ValidationStep registrationFile={rf} onNext={goNext} />}
        {currentStep === 9 && <ReadyStep registrationFile={rf} />}
      </div>
    </div>
  )
}
