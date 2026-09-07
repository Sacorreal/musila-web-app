import { z } from 'zod';

export const publisherShareItemSchema = z.object({
  userId: z.string().uuid(),
  enabled: z.boolean(),
  percentage: z
    .number({ invalid_type_error: 'Ingresa un porcentaje' })
    .min(0, 'Mínimo 0%')
    .max(100, 'Máximo 100%'),
});

export const publisherSharesFormSchema = z.object({
  items: z.array(publisherShareItemSchema).superRefine((items, ctx) => {
    items.forEach((item, index) => {
      if (item.enabled && item.percentage <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Para activar el Publisher's Share el porcentaje debe ser mayor a 0",
          path: [index, 'percentage'],
        });
      }
    });
  }),
});

export type PublisherSharesFormValues = z.infer<typeof publisherSharesFormSchema>;
