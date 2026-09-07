import { z } from 'zod'
import { IPI_NUMBER_REGEX } from '@/src/shared/validations/ipi'

export const publishingContractSchema = z
  .object({
    publisherName: z.string().min(1, 'El nombre de la editorial es obligatorio'),
    ipiNumber: z.string().regex(IPI_NUMBER_REGEX, 'El IPI debe tener entre 9 y 11 dígitos numéricos'),
    percentage: z.coerce
      .number({ message: 'El porcentaje es obligatorio' })
      .min(0, 'El porcentaje no puede ser negativo')
      .max(100, 'El porcentaje no puede superar 100'),
    startDate: z.string().min(1, 'La fecha de inicio es obligatoria'),
    endDate: z.string().optional(),
    documentFile: z.instanceof(File).optional(),
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: 'La fecha de fin debe ser posterior a la fecha de inicio',
    path: ['endDate'],
  })

export type PublishingContractFormValues = z.infer<typeof publishingContractSchema>
