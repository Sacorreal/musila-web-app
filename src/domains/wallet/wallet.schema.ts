import * as z from "zod";

export const createWithdrawalSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Ingresa un monto válido" })
    .positive("El monto debe ser mayor a 0"),
});

export type CreateWithdrawalFormValues = z.infer<typeof createWithdrawalSchema>;

export const bankAccountSchema = z.object({
  bankName: z.string().min(1, "El nombre del banco es obligatorio"),
  accountType: z.string().min(1, "El tipo de cuenta es obligatorio"),
  accountNumber: z.string().min(1, "El número de cuenta es obligatorio"),
  accountHolderName: z.string().min(1, "El titular de la cuenta es obligatorio"),
  accountHolderIdType: z.string().min(1, "El tipo de documento es obligatorio"),
  accountHolderIdNumber: z.string().min(1, "El número de documento es obligatorio"),
});

export type BankAccountFormValues = z.infer<typeof bankAccountSchema>;
