import { z } from 'zod';
import {
  allowedDocumentTypesFor,
  BusinessDocumentType,
} from '../constants/business-document-catalog';
import { OrganizationType } from '../types/business-registration.types';

/**
 * `createBusinessForm` (§Registro Legal B2B, paso 1). El backend
 * (`CreateBusinessRegistrationDto`) es la fuente de verdad de las reglas de
 * negocio — esta validación es solo la primera línea de defensa en UI.
 */
export const businessRegistrationSchema = z
  .object({
    email: z.string().trim().min(1, 'El email es obligatorio').email('Debe proporcionar un email válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    repeatPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    legalName: z
      .string()
      .trim()
      .min(2, 'El nombre legal de la empresa es obligatorio')
      .max(150, 'El nombre legal no puede superar los 150 caracteres'),
    organizationType: z.nativeEnum(OrganizationType, {
      errorMap: () => ({ message: 'Selecciona el tipo de organización' }),
    }),
    legalCountry: z
      .string()
      .trim()
      .regex(/^[A-Z]{2}$/, 'Selecciona el país de constitución'),
    documentType: z.nativeEnum(BusinessDocumentType, {
      errorMap: () => ({ message: 'Selecciona el tipo de documento' }),
    }),
    documentNumber: z
      .string()
      .trim()
      .min(3, 'El número de documento es obligatorio')
      .max(50, 'El número de documento es demasiado largo'),
    phoneCountryCode: z
      .string()
      .trim()
      .regex(/^\+[0-9]{1,4}$/, 'Formato inválido (ej. +57)'),
    phoneNumber: z
      .string()
      .trim()
      .min(7, 'El teléfono debe tener al menos 7 dígitos')
      .max(20, 'El teléfono es demasiado largo'),
    planKey: z.string().min(1, 'Selecciona un plan'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ['repeatPassword'],
    message: 'Las contraseñas no coinciden',
  })
  .refine(
    (data) => allowedDocumentTypesFor(data.legalCountry).includes(data.documentType),
    {
      path: ['documentType'],
      message: 'El tipo de documento no es válido para el país seleccionado',
    },
  );

export type BusinessRegistrationFormValues = z.infer<typeof businessRegistrationSchema>;
