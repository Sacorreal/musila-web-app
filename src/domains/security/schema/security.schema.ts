import { z } from 'zod';

export const renamePasskeySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
});
export type RenamePasskeyInput = z.infer<typeof renamePasskeySchema>;

export const totpConfirmSchema = z.object({
  token: z
    .string()
    .trim()
    .regex(/^\d{6,8}$/, 'Introduce el código de 6 dígitos de tu app'),
});
export type TotpConfirmInput = z.infer<typeof totpConfirmSchema>;

export const organizationSecurityPolicySchema = z.object({
  mfaRequired: z.boolean(),
  passkeyRequired: z.boolean(),
  totpAllowed: z.boolean(),
  recoveryCodesRequired: z.boolean(),
});
export type OrganizationSecurityPolicyInput = z.infer<
  typeof organizationSecurityPolicySchema
>;
