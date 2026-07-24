import { z } from "zod";

// Debe coincidir con OTP_CODE_LENGTH del backend (musila-backend/src/shared/otp/otp.constants.ts).
export const OTP_CODE_LENGTH = 4;

export const otpCodeSchema = z.object({
  code: z
    .string()
    .length(OTP_CODE_LENGTH, `El código debe tener ${OTP_CODE_LENGTH} dígitos`)
    .regex(/^\d+$/, "El código solo puede contener números"),
});

export type OtpCodeInput = z.infer<typeof otpCodeSchema>;
