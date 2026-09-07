import { z } from 'zod';

export const affiliateRegisterSchema = z
  .object({
    name: z.string().min(1, 'El nombre es requerido'),
    lastName: z.string().min(1, 'El apellido es requerido'),
    email: z.string().min(1, 'El correo es requerido').email('Correo inválido'),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    repeatPassword: z.string().min(6, 'Mínimo 6 caracteres'),
    phone: z.string().optional(),
    countryCode: z.string().optional(),
    companyOrBrand: z.string().optional(),
    website: z.string().url('URL inválida').optional().or(z.literal('')),
    audienceDescription: z.string().optional(),
    instagram: z.string().optional(),
    tiktok: z.string().optional(),
    youtube: z.string().optional(),
    paymentPhone: z.string().optional(),
    bankName: z.string().optional(),
    accountType: z.string().optional(),
    accountNumber: z.string().optional(),
    accountHolderName: z.string().optional(),
    accountHolderIdType: z.string().optional(),
    accountHolderIdNumber: z.string().optional(),
    acceptedTerms: z
      .boolean()
      .refine((value) => value === true, { message: 'Debes aceptar los términos del programa' }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['repeatPassword'],
  });

export type AffiliateRegisterSchema = z.infer<typeof affiliateRegisterSchema>;
