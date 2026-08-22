'use client'

import { useEffect, useState } from 'react'
import { Landmark } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/src/shared/components/UI/dialog'
import { useCurrentAuthorId, useSocietyAffiliations } from '../society-affiliations.hooks'
import { SocietyAffiliationFormFields } from './SocietyAffiliationFormFields'

const dismissedKey = (authorId: string) => `musila:cmo-onboarding-dismissed:${authorId}`

/**
 * Antes de publicar un track (`/music/publicar`), invita al autor a
 * registrar su sociedad de gestión colectiva si todavía no tiene ninguna
 * afiliación. Es opcional — un autor puede no pertenecer a ninguna CMO — así
 * que se puede omitir (ESC, click afuera, o "Omitir por ahora") y no vuelve
 * a aparecer en lo que dure la sesión del navegador.
 */
export function SocietyAffiliationOnboardingPrompt() {
  const authorId = useCurrentAuthorId()
  const { data: affiliations, isLoading } = useSocietyAffiliations()
  // Arranca cerrado para evitar un parpadeo mientras se confirma sessionStorage
  // (no disponible durante el primer render) y mientras carga la consulta.
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    if (!authorId) return
    setDismissed(sessionStorage.getItem(dismissedKey(authorId)) === '1')
  }, [authorId])

  const dismiss = () => {
    if (authorId) {
      try {
        sessionStorage.setItem(dismissedKey(authorId), '1')
      } catch {
        // sessionStorage puede no estar disponible (navegación privada); no es crítico.
      }
    }
    setDismissed(true)
  }

  const shouldShow = !isLoading && !!affiliations && affiliations.length === 0 && !dismissed

  return (
    <Dialog open={shouldShow} onOpenChange={(open) => !open && dismiss()}>
      <DialogContent className="max-w-md" aria-describedby="cmo-onboarding-description">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Landmark className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <DialogTitle className="text-center">¿Perteneces a una sociedad de gestión colectiva?</DialogTitle>
          <DialogDescription id="cmo-onboarding-description" className="text-center">
            Registrar tu afiliación (ej. SAYCO) ayuda a que tus futuras obras la incluyan automáticamente en expedientes y
            declaraciones. Es completamente opcional — puedes omitir este paso si no perteneces a ninguna.
          </DialogDescription>
        </DialogHeader>

        <SocietyAffiliationFormFields onSuccess={dismiss} onCancel={dismiss} cancelLabel="Omitir por ahora" />
      </DialogContent>
    </Dialog>
  )
}
