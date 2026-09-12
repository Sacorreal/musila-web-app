import * as z from "zod";

/**
 * Cuenta bancaria PERSONAL (wallet del propio usuario): sin campos de
 * titular/documento — se derivan en el backend desde la identidad legal ya
 * verificada del usuario (`GET/PATCH /users/me/legal-identity`), para no
 * pedir de nuevo un dato que ya existe y podría desincronizarse.
 */
export const personalBankAccountSchema = z.object({
  bankCode: z.string().min(1, "Selecciona un banco"),
  bankName: z.string().min(1, "El nombre del banco es obligatorio"),
  accountType: z.string().min(1, "El tipo de cuenta es obligatorio"),
  accountNumber: z.string().min(1, "El número de cuenta es obligatorio"),
});

export type PersonalBankAccountFormValues = z.infer<typeof personalBankAccountSchema>;

/** Cuenta bancaria de una ORGANIZACIÓN (wallet de publisher): el titular es la razón social/NIT, no la identidad legal personal de quien administra el wallet. */
export const bankAccountSchema = z.object({
  bankCode: z.string().min(1, "Selecciona un banco"),
  bankName: z.string().min(1, "El nombre del banco es obligatorio"),
  accountType: z.string().min(1, "El tipo de cuenta es obligatorio"),
  accountNumber: z.string().min(1, "El número de cuenta es obligatorio"),
  accountHolderName: z.string().min(1, "El titular de la cuenta es obligatorio"),
  accountHolderIdType: z.string().min(1, "El tipo de documento es obligatorio"),
  accountHolderIdNumber: z.string().min(1, "El número de documento es obligatorio"),
});

export type BankAccountFormValues = z.infer<typeof bankAccountSchema>;
