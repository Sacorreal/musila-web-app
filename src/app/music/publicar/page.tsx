"use client"
import { CreateTrackForm } from "@domains/tracks/components/CreateTrackForm"
import { SocietyAffiliationOnboardingPrompt } from "@domains/society-affiliations/components/SocietyAffiliationOnboardingPrompt"

export default function UploadPage() {
    //TODO: middleware para validar roles autorizados para crear track autor | cantautor, sino, redirigir a /music

  return (
    <div>
      <SocietyAffiliationOnboardingPrompt />
      <CreateTrackForm/>
    </div>
  )
}
