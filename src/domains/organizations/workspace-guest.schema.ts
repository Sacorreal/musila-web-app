import { z } from 'zod'

/** Tipos de documento admitidos en el formulario de registro del invitado. */
export const DOCUMENT_TYPES = [
  { value: 'CC', label: 'Cédula de ciudadanía' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'PP', label: 'Pasaporte' },
  { value: 'TI', label: 'Tarjeta de identidad' },
  { value: 'NIT', label: 'NIT' },
] as const

/**
 * Validación del formulario de registro del invitado (nombre completo, tipo y
 * número de documento, email y contraseña). El email se valida implícitamente
 * por el uso del enlace, pero se solicita para crear la cuenta y notificar.
 */
export const workspaceGuestRegisterSchema = z
  .object({
    name: z.string().trim().min(2, 'Ingresa tu nombre'),
    lastName: z.string().trim().min(2, 'Ingresa tu apellido'),
    email: z.string().trim().email('Correo electrónico inválido'),
    typeCitizenID: z
      .string()
      .min(1, 'Selecciona un tipo de documento')
      .refine(
        (value) => DOCUMENT_TYPES.some((documentType) => documentType.value === value),
        'Tipo de documento inválido',
      ),
    citizenID: z.string().trim().min(4, 'Ingresa un número de documento válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    repeatPassword: z.string().min(6, 'Repite la contraseña'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['repeatPassword'],
  })

export type WorkspaceGuestRegisterInput = z.infer<typeof workspaceGuestRegisterSchema>
