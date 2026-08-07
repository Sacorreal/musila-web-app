'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useUploadStorage } from '@/src/domains/storage/hooks/use-upload-storage'
import { StorageFolder } from '@/src/domains/storage/types/storage.types'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Field, FieldLabel, FieldError, FieldDescription } from '@/src/shared/components/UI/field'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/src/shared/components/UI/dialog'
import { useCreatePublishingContract, useUpdatePublishingContract } from '../hooks/use-publishing-contracts.hooks'
import { publishingContractSchema, type PublishingContractFormValues } from '../validations/publishing-contract.schema'
import type { PublishingContractDto } from '../types/publishing-contract.types'

interface Props {
  isOpen: boolean
  onClose: () => void
  initialData?: PublishingContractDto | null
}

export function CreatePublishingContractDialog({ isOpen, onClose, initialData }: Props) {
  const isEdit = !!initialData
  const { mutateAsync: createContract, isPending: isCreating } = useCreatePublishingContract()
  const { mutateAsync: updateContract, isPending: isUpdating } = useUpdatePublishingContract()
  const { mutateAsync: uploadFiles, isPending: isUploading } = useUploadStorage()
  const isPending = isCreating || isUpdating || isUploading

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
  } = useForm<PublishingContractFormValues>({ resolver: zodResolver(publishingContractSchema) })

  useEffect(() => {
    if (isOpen) {
      reset({
        publisherName: initialData?.publisherName ?? '',
        startDate: initialData?.startDate?.slice(0, 10) ?? '',
        endDate: initialData?.endDate?.slice(0, 10) ?? '',
        documentFile: undefined,
      })
    }
  }, [isOpen, initialData, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data: PublishingContractFormValues) => {
    if (!isEdit && !data.documentFile) {
      setError('documentFile', { message: 'Debes adjuntar el PDF del contrato' })
      return
    }

    let documentKey: string | undefined
    let documentUrl: string | undefined

    if (data.documentFile) {
      const [uploaded] = await uploadFiles([
        { field: 'publishingContractDoc', file: data.documentFile, folder: StorageFolder.PUBLISHING_CONTRACT_DOCS },
      ])
      documentKey = uploaded.key
      documentUrl = uploaded.publicUrl
    }

    const payload = {
      publisherName: data.publisherName,
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      ...(documentKey && documentUrl ? { documentKey, documentUrl } : {}),
    }

    if (isEdit && initialData) {
      await updateContract({ id: initialData.id, input: payload })
    } else {
      await createContract(payload as Required<typeof payload>)
    }
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Contrato Editorial' : 'Nuevo Contrato Editorial'}</DialogTitle>
          <DialogDescription>
            Registra el contrato una sola vez y reutilízalo en el expediente de cualquiera de tus obras cubiertas por él.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Field data-invalid={!!errors.publisherName}>
            <FieldLabel>Nombre de la editorial</FieldLabel>
            <Input placeholder="Editorial Musical S.A.S" {...register('publisherName')} />
            {errors.publisherName && <FieldError errors={[errors.publisherName]} />}
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field data-invalid={!!errors.startDate}>
              <FieldLabel>Fecha inicio</FieldLabel>
              <Input type="date" {...register('startDate')} />
              {errors.startDate && <FieldError errors={[errors.startDate]} />}
            </Field>

            <Field data-invalid={!!errors.endDate}>
              <FieldLabel>Fecha fin (opcional)</FieldLabel>
              <Input type="date" {...register('endDate')} />
              {errors.endDate && <FieldError errors={[errors.endDate]} />}
            </Field>
          </div>

          <Controller
            name="documentFile"
            control={control}
            render={({ field: { onChange, ref, name, onBlur } }) => (
              <Field data-invalid={!!errors.documentFile}>
                <FieldLabel>PDF del contrato</FieldLabel>
                <Input
                  type="file"
                  accept="application/pdf"
                  name={name}
                  ref={ref}
                  onBlur={onBlur}
                  onChange={(e) => onChange(e.target.files?.[0])}
                />
                {isEdit && <FieldDescription>Déjalo vacío para conservar el documento actual.</FieldDescription>}
                {errors.documentFile && <FieldError errors={[errors.documentFile]} />}
              </Field>
            )}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : isEdit ? (
                'Guardar Cambios'
              ) : (
                'Crear Contrato'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
