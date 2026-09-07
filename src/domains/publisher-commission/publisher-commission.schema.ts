import { z } from 'zod';

export const rosterCommissionItemSchema = z.object({
  userId: z.string().uuid(),
  percentage: z
    .number({ invalid_type_error: 'Ingresa un porcentaje' })
    .min(0, 'Mínimo 0%')
    .max(100, 'Máximo 100%'),
});

export const rosterCommissionsFormSchema = z.object({
  items: z.array(rosterCommissionItemSchema),
});

export type RosterCommissionsFormValues = z.infer<typeof rosterCommissionsFormSchema>;
