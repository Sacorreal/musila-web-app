"use client"
import { CreateTrackForm } from "@domains/tracks/components/CreateTrackForm"

export default function UploadPage() {  
    //TODO: middleware para validar roles autorizados para crear track autor | cantautor, sino, redirigir a /music

  return (
    <div>
      <CreateTrackForm/>
    </div>
  )
}
