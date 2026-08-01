import * as z from "zod";

export const authorizeRecipientSchema = z.object({
  musilaCreatorId: z
    .string()
    .trim()
    .min(1, "Ingresa un Musila Creator ID")
    .regex(/^MC-[A-Z0-9]{6}$/, "El Creator ID debe tener el formato MC-XXXXXX"),
});

export type AuthorizeRecipientFormValues = z.infer<typeof authorizeRecipientSchema>;

export const createShareLinkSchema = z.object({
  expiresInDays: z
    .number({ invalid_type_error: "Debe ser un número" })
    .int()
    .positive("Debe ser mayor a 0")
    .optional(),
});

export type CreateShareLinkFormValues = z.infer<typeof createShareLinkSchema>;
