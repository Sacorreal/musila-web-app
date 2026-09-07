import { z } from 'zod';

export const affiliateLoginSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Correo inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export type AffiliateLoginSchema = z.infer<typeof affiliateLoginSchema>;
