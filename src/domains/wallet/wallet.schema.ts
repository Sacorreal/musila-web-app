import * as z from "zod";

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
