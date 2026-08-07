import { z } from 'zod'

export const publishingContractSchema = z
  .object({
    publisherName: z.string().min(1, 'El nombre de la editorial es obligatorio'),
    startDate: z.string().min(1, 'La fecha de inicio es obligatoria'),
    endDate: z.string().optional(),
    documentFile: z.instanceof(File, { message: 'Debes adjuntar el PDF del contrato' }).optional(),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: 'La fecha de fin debe ser posterior a la fecha de inicio',
    path: ['endDate'],
  })

export type PublishingContractFormValues = z.infer<typeof publishingContractSchema>
