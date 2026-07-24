import { z } from 'zod';

/** Planes que tienen tier Pro de pago. */
export const paymentPlanTypeSchema = z.enum(['plan_autor', 'plan_360', 'plan_descubridor']);

export const billingPeriodSchema = z.enum(['monthly', 'annual']);

/** Entrada del checkout (compartida entre cliente y servidor). */
export const checkoutInputSchema = z.object({
  planType: paymentPlanTypeSchema,
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
export type WompiPlanType = z.infer<typeof paymentPlanTypeSchema>;
export type WompiBillingPeriod = z.infer<typeof billingPeriodSchema>;
