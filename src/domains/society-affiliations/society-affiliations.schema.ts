import * as z from 'zod'
import { SocietyAffiliationRightsType } from './society-affiliations.types'

export const createSocietyAffiliationSchema = z.object({
  collectiveManagementSocietyId: z.string().min(1, 'Debes seleccionar una sociedad'),
  rightsType: z.nativeEnum(SocietyAffiliationRightsType, {
    errorMap: () => ({ message: 'Debes seleccionar un tipo de derecho' }),
  }),
  territory: z
    .string()
    .length(2, 'Usa el código de país ISO de 2 letras (ej. CO)')
    .toUpperCase(),
  membershipNumber: z.string().optional().or(z.literal('')),
  ipiNameNumber: z
    .string()
    .regex(/^\d{11}$/, 'El IPI Name Number debe tener 11 dígitos numéricos')
    .optional()
    .or(z.literal('')),
  validFrom: z.string().optional().or(z.literal('')),
})

export type CreateSocietyAffiliationFormValues = z.infer<typeof createSocietyAffiliationSchema>
