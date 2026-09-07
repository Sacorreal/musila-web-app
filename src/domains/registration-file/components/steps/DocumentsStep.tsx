'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2, Trash2, Upload } from 'lucide-react'
import { Button } from '@/src/shared/components/UI/button'
import { Card, CardContent } from '@/src/shared/components/UI/card'
import { useUploadStorage } from '@/src/domains/storage/hooks/use-upload-storage'
import { StorageFolder } from '@/src/domains/storage/types/storage.types'
import { useAddDocument, useRemoveDocument } from '../../hooks/use-registration-file.hooks'
import { DOCUMENT_TYPE_LABELS, RegistrationFileDocumentType, type RegistrationFileDto } from '../../types/registration-file.types'

interface Props {
  registrationFile: RegistrationFileDto
  onNext: () => void
}

interface DocumentSlot {
  type: RegistrationFileDocumentType
  recommended?: boolean
}

function buildRelevantSlots(registrationFile: RegistrationFileDto): DocumentSlot[] {
  const slots: DocumentSlot[] = [
    { type: RegistrationFileDocumentType.LETRA },
    { type: RegistrationFileDocumentType.PARTITURA, recommended: true },
    { type: RegistrationFileDocumentType.CARATULA, recommended: true },
    { type: RegistrationFileDocumentType.CERTIFICADO_PI, recommended: true },
  ]

  if (registrationFile.phonogramData?.hasRecording) {
    slots.push({ type: RegistrationFileDocumentType.AUDIO_MP3 }, { type: RegistrationFileDocumentType.AUDIO_WAV })
  }
  if (registrationFile.hasPublishingDeal) {
    slots.push({ type: RegistrationFileDocumentType.CONTRATO_EDITORIAL }, { type: RegistrationFileDocumentType.REGISTRO_DNDA })
  }
  if (registrationFile.commissionedWorkData?.isCommissioned) {
    slots.push({ type: RegistrationFileDocumentType.CONTRATO_ENCARGO })
  }
  if (registrationFile.derivativeWorkData?.isDerivative) {
    slots.push({ type: RegistrationFileDocumentType.AUTORIZACION })
  }

  return slots
}

function latestDocumentOfType(registrationFile: RegistrationFileDto, type: RegistrationFileDocumentType) {
  const matches = registrationFile.documents.filter((d) => d.documentType === type)
  if (!matches.length) return null
  return matches.reduce((latest, current) => (current.version > latest.version ? current : latest))
}

function DocumentSlotRow({ slot, registrationFile }: { slot: DocumentSlot; registrationFile: RegistrationFileDto }) {
  const { mutateAsync: uploadFiles, isPending: isUploading } = useUploadStorage()
  const { mutateAsync: addDocument, isPending: isRegistering } = useAddDocument()
  const { mutate: removeDocument, isPending: isRemoving } = useRemoveDocument()
  const [localError, setLocalError] = useState<string | null>(null)

  const current = latestDocumentOfType(registrationFile, slot.type)
  const isBusy = isUploading || isRegistering || isRemoving

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setLocalError(null)

    try {
      const [uploaded] = await uploadFiles([
        { field: `rf_doc_${slot.type}`, file, folder: StorageFolder.REGISTRATION_FILE_DOCUMENTS },
      ])
      await addDocument({
        id: registrationFile.id,
        payload: {
          documentType: slot.type,
          fileKey: uploaded.key,
          fileUrl: uploaded.publicUrl,
          fileName: file.name,
          mimeType: file.type,
          fileSizeBytes: file.size,
        },
      })
    } catch {
      setLocalError('No se pudo subir el documento')
    }
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {current ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          ) : (
            <div className="h-5 w-5 shrink-0 rounded-full border-2 border-dashed border-muted-foreground/40" />
          )}
          <div>
            <p className="text-sm font-medium text-foreground">
              {DOCUMENT_TYPE_LABELS[slot.type]}
              {slot.recommended && !current && <span className="ml-1.5 text-xs text-muted-foreground">(recomendado)</span>}
            </p>
            {current && <p className="text-xs text-muted-foreground">{current.fileName} · v{current.version}</p>}
            {localError && <p className="text-xs text-destructive">{localError}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id={`upload-${slot.type}`}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={isBusy}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isBusy}
            className="gap-1.5"
            onClick={() => document.getElementById(`upload-${slot.type}`)?.click()}
          >
            {isUploading || isRegistering ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {current ? 'Reemplazar' : 'Subir'}
          </Button>
          {current && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={isBusy}
              onClick={() => removeDocument({ id: registrationFile.id, documentId: current.id })}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function DocumentsStep({ registrationFile, onNext }: Props) {
  const slots = buildRelevantSlots(registrationFile)

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {slots.map((slot) => (
          <DocumentSlotRow key={slot.type} slot={slot} registrationFile={registrationFile} />
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="button" onClick={onNext}>
          Continuar
        </Button>
      </div>
    </div>
  )
}
