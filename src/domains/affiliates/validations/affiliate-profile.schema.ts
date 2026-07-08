import { z } from 'zod';

export const affiliateProfileSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  phone: z.string().optional(),
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
});

export type AffiliateProfileSchema = z.infer<typeof affiliateProfileSchema>;
