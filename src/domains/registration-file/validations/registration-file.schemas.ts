import { z } from 'zod'
import {
  OriginalWorkOrigin,
  RecordingType,
  RegistrationFileParticipantRole,
  WorkState,
} from '../types/registration-file.types'

// ─── Dominio 1: Información General ─────────────────────────────────────────
export const generalInfoSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  alternativeTitles: z.array(z.string()).max(4, 'Máximo 4 títulos alternativos').default([]),
  language: z.string().min(1, 'El idioma es obligatorio'),
  ritmo: z.string().min(1, 'El ritmo es obligatorio'),
  durationSeconds: z.coerce.number().min(1, 'La duración es obligatoria'),
  creationDate: z.string().optional(),
  creationPlace: z.string().optional(),
  workState: z.nativeEnum(WorkState).optional(),
  version: z.string().optional(),
  description: z.string().optional(),
})
export type GeneralInfoFormValues = z.infer<typeof generalInfoSchema>

// ─── Dominio 2: Participantes ────────────────────────────────────────────────
export const participantInputSchema = z.object({
  splitAuthorId: z.string().optional(),
  fullName: z.string().min(1, 'El nombre es obligatorio'),
  documentType: z.string().optional(),
  documentNumber: z.string().optional(),
  nationality: z.string().optional(),
  managementSociety: z.string().optional(),
  ipiCode: z.string().optional(),
  saycoCode: z.string().optional(),
  saycoIpName: z.string().optional(),
  role: z.nativeEnum(RegistrationFileParticipantRole),
  authorialPercentage: z.coerce.number().min(0).max(100),
  mechanicalPercentage: z.coerce.number().min(0).max(100),
})

export const participantsSchema = z
  .object({
    participants: z.array(participantInputSchema).min(1, 'Agrega al menos un participante').max(10, 'Máximo 10 participantes'),
  })
  .refine(
    (data) => {
      const sum = data.participants.reduce((acc, p) => acc + p.authorialPercentage, 0)
      return Math.round(sum * 100) / 100 === 100
    },
    { message: 'La suma de %PER debe ser exactamente 100%', path: ['participants'] },
  )
  .refine(
    (data) => {
      const sum = data.participants.reduce((acc, p) => acc + p.mechanicalPercentage, 0)
      return Math.round(sum * 100) / 100 === 100
    },
    { message: 'La suma de %MEC debe ser exactamente 100%', path: ['participants'] },
  )
export type ParticipantsFormValues = z.infer<typeof participantsSchema>

// ─── Dominio 3: Fonograma ────────────────────────────────────────────────────
export const phonogramSchema = z
  .object({
    hasRecording: z.boolean(),
    recordingType: z.nativeEnum(RecordingType).optional(),
    isrc: z.string().optional(),
    phonogramProducer: z.string().optional(),
    phonogramOwner: z.string().optional(),
    recordingDate: z.string().optional(),
  })
  .refine((data) => !data.hasRecording || !!data.recordingType, {
    message: 'Selecciona el tipo de grabación',
    path: ['recordingType'],
  })
  .refine((data) => !data.hasRecording || !!data.isrc, { message: 'El ISRC es obligatorio', path: ['isrc'] })
  .refine((data) => !data.hasRecording || !!data.phonogramOwner, {
    message: 'Indica el titular del fonograma',
    path: ['phonogramOwner'],
  })
export type PhonogramFormValues = z.infer<typeof phonogramSchema>

// ─── Dominio 4: Editorial ────────────────────────────────────────────────────
export const publishingSchema = z
  .object({
    hasPublishingDeal: z.boolean(),
    publishingContractId: z.string().optional(),
    publishingAdministeredPercentage: z.coerce.number().min(0).max(100).optional(),
  })
  .refine((data) => !data.hasPublishingDeal || !!data.publishingContractId, {
    message: 'Selecciona el contrato editorial que cubre esta obra',
    path: ['publishingContractId'],
  })
export type PublishingFormValues = z.infer<typeof publishingSchema>

// ─── Dominio 5: Obra Derivada ────────────────────────────────────────────────
export const derivativeWorkSchema = z
  .object({
    isDerivative: z.boolean(),
    originalWorkOrigin: z.nativeEnum(OriginalWorkOrigin).optional(),
    iswc: z.string().optional(),
    preexistingWorkName: z.string().optional(),
    adaptationType: z.string().optional(),
  })
  .refine((data) => !data.isDerivative || !!data.originalWorkOrigin, {
    message: 'Indica el origen de la obra preexistente',
    path: ['originalWorkOrigin'],
  })
  .refine((data) => !data.isDerivative || !!data.iswc, { message: 'El ISWC es obligatorio', path: ['iswc'] })
  .refine((data) => !data.isDerivative || !!data.preexistingWorkName, {
    message: 'Indica el nombre de la obra preexistente',
    path: ['preexistingWorkName'],
  })
export type DerivativeWorkFormValues = z.infer<typeof derivativeWorkSchema>

// ─── Dominio 6: Obra por Encargo ─────────────────────────────────────────────
export const commissionedWorkSchema = z
  .object({
    isCommissioned: z.boolean(),
    contractingCompany: z.string().optional(),
    observations: z.string().optional(),
  })
  .refine((data) => !data.isCommissioned || !!data.contractingCompany, {
    message: 'Indica la compañía contratante',
    path: ['contractingCompany'],
  })
export type CommissionedWorkFormValues = z.infer<typeof commissionedWorkSchema>

// ─── Dominio 7: Inteligencia Artificial ──────────────────────────────────────
export const aiUsageSchema = z.object({
  usedAi: z.boolean(),
  toolUsed: z.string().optional(),
  participationLevel: z.string().optional(),
  observations: z.string().optional(),
})
export type AiUsageFormValues = z.infer<typeof aiUsageSchema>
