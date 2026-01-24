import { z } from 'zod';

import { UserRoleRegister } from '@domains/users/types';

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

        email: z
            .string()
            .min(1, "El email es obligatorio")
            .email("Debe proporcionar un email válido"),

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

        role: z.nativeEnum(UserRoleRegister, {
            errorMap: () => ({ message: "El rol es obligatorio" }),
        }),
    })
    .refine((data) => data.password === data.repeatPassword, {
        path: ["repeatPassword"],
        message: "Las contraseñas no coinciden",
    });

/**
 * Tipo inferido para el formulario
 */
export type RegisterUsersFormValues = z.infer<typeof registerSchema>;
