import * as z from "zod";

export const authorizeRecipientSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Ingresa un nombre de usuario")
    .regex(/^[A-Za-z0-9_]{3,20}$/, "El nombre de usuario debe tener entre 3 y 20 caracteres (letras, números y guion bajo)"),
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
