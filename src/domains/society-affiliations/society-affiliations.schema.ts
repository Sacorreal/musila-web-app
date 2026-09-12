import * as z from 'zod'
import { SocietyAffiliationRightsType, SocietyAffiliationTerritoryMode } from './society-affiliations.types'

export const createSocietyAffiliationSchema = z
  .object({
    collectiveManagementSocietyId: z.string().min(1, 'Debes seleccionar una sociedad'),
    rightsTypes: z
      .array(z.nativeEnum(SocietyAffiliationRightsType))
      .min(1, 'Selecciona al menos un tipo de derecho'),
    territoryMode: z.nativeEnum(SocietyAffiliationTerritoryMode, {
      errorMap: () => ({ message: 'Selecciona cómo administra el territorio esta sociedad' }),
    }),
    territoryCountries: z.array(z.string().length(2)),
    membershipNumber: z.string().optional().or(z.literal('')),
    ipiNameNumber: z
      .string()
      .regex(/^\d{11}$/, 'El Número IPI debe tener 11 dígitos numéricos'),
  })
  .refine(
    (data) => data.territoryMode === SocietyAffiliationTerritoryMode.WORLDWIDE || data.territoryCountries.length > 0,
    {
      message: 'Selecciona al menos un país',
      path: ['territoryCountries'],
    },
  )

export type CreateSocietyAffiliationFormValues = z.infer<typeof createSocietyAffiliationSchema>
