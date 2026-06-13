import { z } from 'zod';

/** Roles que tienen plan Pro de pago. */
export const paymentRoleSchema = z.enum(['autor', 'cantautor', 'interprete']);

export const billingPeriodSchema = z.enum(['monthly', 'annual']);

/** Entrada del checkout (compartida entre cliente y servidor). */
export const checkoutInputSchema = z.object({
  role: paymentRoleSchema,
  plan: z.literal('pro'),
  billingPeriod: billingPeriodSchema.default('monthly'),
  customerEmail: z.string().email().optional(),
});

/** Parámetros del Widget devueltos por el backend. */
export const widgetParamsSchema = z.object({
  publicKey: z.string().min(1),
  currency: z.string().min(1),
  amountInCents: z.number().int().positive(),
  reference: z.string().min(1),
  signature: z.string().min(1),
  redirectUrl: z.string().url(),
});

export const checkoutResponseSchema = z.object({
  widget: widgetParamsSchema,
  externalReference: z.string().min(1),
});

export const licenseCheckoutResponseSchema = checkoutResponseSchema.extend({
  licensePrice: z.number(),
  commission: z.number(),
  total: z.number(),
});

export type CheckoutInput = z.infer<typeof checkoutInputSchema>;
export type WidgetParams = z.infer<typeof widgetParamsSchema>;
export type CheckoutResponse = z.infer<typeof checkoutResponseSchema>;
export type LicenseCheckoutResponse = z.infer<typeof licenseCheckoutResponseSchema>;
export type WompiPaymentRole = z.infer<typeof paymentRoleSchema>;
export type WompiBillingPeriod = z.infer<typeof billingPeriodSchema>;
