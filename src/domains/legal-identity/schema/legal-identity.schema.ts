import { z } from 'zod';
import { LegalIdentificationType } from '../types/legal-identity.types';

const NAME_PATTERN = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

const nameField = (label: string) =>
  z
    .string()
    .trim()
    .min(2, `${label} debe tener al menos 2 caracteres`)
    .max(100, `${label} es demasiado largo`)
    .regex(NAME_PATTERN, `${label} solo puede contener letras y espacios`);

export const legalIdentitySchema = z.object({
  primerNombre: nameField('El primer nombre'),
  segundoNombre: nameField('El segundo nombre'),
  primerApellido: nameField('El primer apellido'),
  segundoApellido: nameField('El segundo apellido'),
  tipoIdentificacion: z.nativeEnum(LegalIdentificationType, {
    errorMap: () => ({ message: 'Selecciona un tipo de identificación' }),
  }),
  numeroIdentificacion: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{5,15}$/, 'Debe tener entre 5 y 15 caracteres alfanuméricos'),
  fechaExpedicion: z
    .string()
    .min(1, 'La fecha de expedición es obligatoria')
    .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Fecha inválida')
    .refine((value) => new Date(value).getTime() <= Date.now(), 'La fecha no puede ser futura'),
  numeroCelular: z
    .string()
    .trim()
    .regex(/^[0-9]{7,10}$/, 'Debe tener entre 7 y 10 dígitos'),
  indicativoPais: z
    .string()
    .trim()
    .regex(/^\+[0-9]{1,4}$/, 'Formato inválido (ej. +57)'),
});

export type LegalIdentityFormValues = z.infer<typeof legalIdentitySchema>;
