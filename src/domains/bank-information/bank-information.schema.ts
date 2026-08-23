import * as z from "zod";

export const bankInformationMethodSchema = z.enum(["colombia", "foreign"]);
export type BankInformationMethodOption = z.infer<typeof bankInformationMethodSchema>;

export const colombiaBankInformationSchema = z.object({
  requestId: z.string().optional(),
  bankId: z.string().min(1, "Selecciona un banco"),
  bankName: z.string().min(1, "Selecciona un banco"),
  accountType: z.string().min(1, "Selecciona el tipo de cuenta"),
  accountNumber: z
    .string()
    .regex(/^\d{6,20}$/, "El número de cuenta debe tener entre 6 y 20 dígitos numéricos"),
  accountHolderName: z.string().min(1, "El titular de la cuenta es obligatorio"),
  accountHolderIdType: z.string().min(1, "Selecciona el tipo de documento"),
  accountHolderIdNumber: z
    .string()
    .regex(/^[A-Za-z0-9-]{5,20}$/, "Número de documento inválido"),
});

export type ColombiaBankInformationFormValues = z.infer<typeof colombiaBankInformationSchema>;

export const foreignBankInformationSchema = z.object({
  requestId: z.string().optional(),
  countryCallingCode: z
    .string()
    .regex(/^\+\d{1,4}$/, "El indicativo debe tener el formato +57"),
  phoneNumber: z.string().regex(/^\d{6,15}$/, "El número de teléfono debe tener entre 6 y 15 dígitos"),
  email: z.string().email("Correo electrónico inválido"),
  global66Username: z
    .string()
    .regex(/^@?[\w.]{3,32}$/, "Nombre de usuario de Global66 inválido"),
  acceptedLegalNotice: z
    .boolean()
    .refine((value) => value === true, { message: "Debes aceptar los avisos legales para continuar" }),
});

export type ForeignBankInformationFormValues = z.infer<typeof foreignBankInformationSchema>;
