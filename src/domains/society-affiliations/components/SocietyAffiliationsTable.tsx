'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { getSpanishCountryName } from '@/src/domains/auth/utils/get-countries'
import { Badge } from '@/src/shared/components/UI/badge'
import { Button } from '@/src/shared/components/UI/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/shared/components/UI/alert-dialog'
import { useEndSocietyAffiliation } from '../society-affiliations.hooks'
import {
  RIGHTS_TYPE_LABELS,
  STATUS_BADGE_VARIANT,
  STATUS_LABELS,
  VERIFICATION_STATUS_BADGE_VARIANT,
  VERIFICATION_STATUS_LABELS,
} from '../society-affiliations.labels'
import { SocietyAffiliationStatus, SocietyAffiliationTerritoryMode, type SocietyAffiliationDto } from '../society-affiliations.types'

function describeTerritory(affiliation: SocietyAffiliationDto): string {
  const countryNames = (isoCodes: string[]) => isoCodes.map((code) => getSpanishCountryName(code, code)).join(', ')

  switch (affiliation.territoryMode) {
    case SocietyAffiliationTerritoryMode.WORLDWIDE:
      return 'Todo el mundo'
    case SocietyAffiliationTerritoryMode.WORLDWIDE_EXCEPT:
      return `Todo el mundo excepto ${countryNames(affiliation.territoryCountries)}`
    case SocietyAffiliationTerritoryMode.SPECIFIC_COUNTRIES:
    default:
      return countryNames(affiliation.territoryCountries)
  }
}

interface Props {
  affiliations: SocietyAffiliationDto[]
}

export function SocietyAffiliationsTable({ affiliations }: Props) {
  const [endTarget, setEndTarget] = useState<SocietyAffiliationDto | null>(null)
  const { mutate: endAffiliation, isPending } = useEndSocietyAffiliation()

  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
      <AnimatePresence initial={false}>
        {affiliations.map((affiliation, index) => {
          const canEnd = affiliation.status === SocietyAffiliationStatus.ACTIVE || affiliation.status === SocietyAffiliationStatus.PENDING || affiliation.status === SocietyAffiliationStatus.SUSPENDED

          return (
            <motion.div
              key={affiliation.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.03, duration: 0.2 }}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">{affiliation.collectiveManagementSociety.acronym}</span>
                  <span className="text-sm text-muted-foreground">{affiliation.collectiveManagementSociety.officialName}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{RIGHTS_TYPE_LABELS[affiliation.rightsType]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{describeTerritory(affiliation)}</span>
                  {affiliation.membershipNumber && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>N° {affiliation.membershipNumber}</span>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={STATUS_BADGE_VARIANT[affiliation.status]}>{STATUS_LABELS[affiliation.status]}</Badge>
                  <Badge variant={VERIFICATION_STATUS_BADGE_VARIANT[affiliation.verificationStatus]}>
                    {VERIFICATION_STATUS_LABELS[affiliation.verificationStatus]}
                  </Badge>
                </div>
              </div>

              {canEnd && (
                <Button variant="outline" size="sm" onClick={() => setEndTarget(affiliation)} className="shrink-0">
                  Finalizar
                </Button>
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>

      <AlertDialog open={!!endTarget} onOpenChange={(open) => !open && setEndTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Finalizar esta afiliación?</AlertDialogTitle>
            <AlertDialogDescription>
              La afiliación a {endTarget?.collectiveManagementSociety.acronym} quedará marcada como finalizada. No se elimina: el
              historial se conserva y puedes volver a declararla más adelante si corresponde.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (endTarget) endAffiliation({ affiliationId: endTarget.id }, { onSuccess: () => setEndTarget(null) })
              }}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Finalizar afiliación'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
