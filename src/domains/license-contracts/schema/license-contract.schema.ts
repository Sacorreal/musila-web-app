import * as z from "zod";
import { LicenseDistributionFormat, LicenseTerritoryMode } from "../types/license-contract.types";

const installmentSchema = z.object({
  amount: z
    .number({ invalid_type_error: "El valor de la cuota es obligatorio" })
    .min(1, "El valor de la cuota debe ser mayor a 0"),
  dueDate: z.string().min(1, "La fecha de pago es obligatoria"),
});

const advanceDistributionEntrySchema = z.object({
  userId: z.string().min(1),
  percentage: z
    .number({ invalid_type_error: "El porcentaje es obligatorio" })
    .min(0.01, "El porcentaje debe ser mayor a 0")
    .max(100, "El porcentaje no puede superar 100"),
});

export const licenseTermsSchema = z
  .object({
    validityDate: z
      .string()
      .min(1, "La fecha de vigencia es obligatoria")
      .refine((value) => new Date(value).getTime() > Date.now(), "La fecha de vigencia debe ser futura"),
    territoryMode: z.nativeEnum(LicenseTerritoryMode, {
      errorMap: () => ({ message: "Selecciona el territorio" }),
    }),
    territoryCountries: z.array(z.string()).optional(),
    advanceAmount: z
      .number({ invalid_type_error: "El anticipo es obligatorio" })
      .min(0, "El anticipo no puede ser negativo"),
    advanceInstallmentsCount: z.number().int().min(1),
    installments: z.array(installmentSchema).optional(),
    royaltyPercentage: z
      .number({ invalid_type_error: "La regalía es obligatoria" })
      .min(0, "La regalía no puede ser negativa")
      .max(100, "La regalía no puede superar 100"),
    distributionFormats: z
      .array(z.nativeEnum(LicenseDistributionFormat))
      .min(1, "Selecciona al menos un formato de distribución"),
    advanceDistribution: z.array(advanceDistributionEntrySchema).optional(),
  })
  .refine(
    (data) =>
      data.territoryMode !== LicenseTerritoryMode.SPECIFIC_COUNTRIES ||
      (data.territoryCountries && data.territoryCountries.length > 0),
    { message: "Selecciona al menos un país", path: ["territoryCountries"] },
  )
  .refine(
    (data) => {
      if (data.advanceAmount <= 0) return true;
      return !!data.installments && data.installments.length === data.advanceInstallmentsCount;
    },
    { message: "Indica el monto y la fecha de pago de cada cuota", path: ["installments"] },
  )
  .refine(
    (data) => {
      if (data.advanceAmount <= 0 || !data.installments?.length) return true;
      const sum = data.installments.reduce((acc, i) => acc + (i.amount || 0), 0);
      return Math.round(sum * 100) / 100 === Math.round(data.advanceAmount * 100) / 100;
    },
    { message: "La suma de las cuotas debe ser igual al anticipo", path: ["installments"] },
  )
  .refine(
    (data) => {
      if (!data.advanceDistribution?.length) return true;
      const sum = data.advanceDistribution.reduce((acc, d) => acc + (d.percentage || 0), 0);
      return Math.round(sum * 100) / 100 === 100;
    },
    { message: "La distribución del anticipo debe sumar exactamente 100%", path: ["advanceDistribution"] },
  );

export type LicenseTermsFormValues = z.infer<typeof licenseTermsSchema>;

export const rejectLicenseSignatorySchema = z.object({
  reason: z
    .string()
    .min(1, "El motivo del rechazo es obligatorio")
    .max(500, "El motivo no puede superar 500 caracteres"),
});

export type RejectLicenseSignatoryFormValues = z.infer<typeof rejectLicenseSignatorySchema>;

export const confirmRecordingSchema = z.object({
  isrc: z
    .string()
    .min(1, "El ISRC es obligatorio")
    .max(15, "El ISRC no puede superar 15 caracteres"),
});

export type ConfirmRecordingFormValues = z.infer<typeof confirmRecordingSchema>;

/** Reparte el anticipo en `count` cuotas iguales, ajustando el residuo en la última. */
export function distributeInstallmentsEqually(totalAmount: number, count: number): number[] {
  if (count <= 0 || totalAmount <= 0) return [];
  const base = Math.floor((totalAmount / count) * 100) / 100;
  const amounts = Array(count).fill(base);
  const remainder = Math.round((totalAmount - base * count) * 100) / 100;
  amounts[count - 1] = Math.round((base + remainder) * 100) / 100;
  return amounts;
}
