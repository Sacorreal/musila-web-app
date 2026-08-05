import { z } from 'zod';

import { UserPlanTypeRegister, MusicRole } from '@/src/domains/users/types/user.types';

/**
 * Schema de validación para el formulario de registro
 */
export const registerSchema = z
    .object({
        name: z
            .string()
            .min(1, "El nombre es obligatorio")
            .max(255, "El nombre no puede superar los 255 caracteres"),

        lastName: z
            .string()
            .min(1, "El apellido es obligatorio"),

        secondName: z
            .string()
            .optional()
        ,
        secondLastName: z
            .string()
            .max(255, "El segundo apellido no puede superar los 255 caracteres")
            .optional(),

        email: z
            .string()
            .min(1, "El email es obligatorio")
            .regex(/^[a-zA-Z0-9._%+-ñÑ]+@[a-zA-Z0-9.-ñÑ]+\.[a-zA-Z]{2,}$/, "Debe proporcionar un email válido"),

        password: z
            .string()
            .min(6, "La contraseña debe tener al menos 6 caracteres"),

        repeatPassword: z
            .string()
            .min(6, "La contraseña debe tener al menos 6 caracteres"),

        countryCode: z
            .string()
            .min(1, "El código de país es obligatorio"),

        phone: z
            .string()
            .min(1, "El teléfono es obligatorio"),

        typeCitizenID: z
            .string()
            .min(1, "El tipo de documento es obligatorio"),

        citizenID: z
            .string()
            .min(1, "El número de documento es obligatorio"),

        planType: z.nativeEnum(UserPlanTypeRegister, {
            errorMap: () => ({ message: "El plan es obligatorio" }),
        }),

        role: z.nativeEnum(MusicRole, {
            errorMap: () => ({ message: "El rol es obligatorio" }),
        }),

        // Campo trampa anti-bot: si un bot lo completa, la validación de humano falla en el submit.
        companyWebsite: z.string().max(0).optional().or(z.literal("")),
    })
    .refine((data) => data.password === data.repeatPassword, {
        path: ["repeatPassword"],
        message: "Las contraseñas no coinciden",
    });

/**
 * Tipo inferido para el formulario
 */
export type RegisterUsersFormValues = z.infer<typeof registerSchema>;
