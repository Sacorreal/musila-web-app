export type RegistrationProfileKey = 'SAYCO' | 'DNDA'

export enum RegistrationFileStatus {
  EN_CONSTRUCCION = 'en_construccion',
  INCOMPLETO = 'incompleto',
  VALIDADO_PARCIALMENTE = 'validado_parcialmente',
  LISTO_PARA_PRESENTAR = 'listo_para_presentar',
}

export enum WorkState {
  INEDITA = 'inedita',
  PUBLICADA = 'publicada',
}

export enum RecordingType {
  MAQUETA = 'maqueta',
  PROFESIONAL = 'profesional',
}

export enum OriginalWorkOrigin {
  PRIVADA = 'privada',
  DOMINIO_PUBLICO = 'dominio_publico',
}

export enum RegistrationFileParticipantRole {
  AUTOR = 'autor',
  COMPOSITOR = 'compositor',
  COMPOSITOR_AUTOR = 'compositor_autor',
  ARREGLISTA = 'arreglista',
  ADAPTADOR = 'adaptador',
  EDITOR = 'editor',
  ADMINISTRADOR = 'administrador',
}

export const PARTICIPANT_ROLE_LABELS: Record<RegistrationFileParticipantRole, string> = {
  [RegistrationFileParticipantRole.AUTOR]: 'Autor',
  [RegistrationFileParticipantRole.COMPOSITOR]: 'Compositor',
  [RegistrationFileParticipantRole.COMPOSITOR_AUTOR]: 'Compositor/Autor',
  [RegistrationFileParticipantRole.ARREGLISTA]: 'Arreglista',
  [RegistrationFileParticipantRole.ADAPTADOR]: 'Adaptador',
  [RegistrationFileParticipantRole.EDITOR]: 'Editor',
  [RegistrationFileParticipantRole.ADMINISTRADOR]: 'Administrador',
}

export enum RegistrationFileDocumentType {
  LETRA = 'letra',
  PARTITURA = 'partitura',
  AUDIO_MP3 = 'audio_mp3',
  AUDIO_WAV = 'audio_wav',
  CARATULA = 'caratula',
  CONTRATO_EDITORIAL = 'contrato_editorial',
  CONTRATO_ENCARGO = 'contrato_encargo',
  REGISTRO_DNDA = 'registro_dnda',
  DECLARACION_SAYCO = 'declaracion_sayco',
  AUTORIZACION = 'autorizacion',
  LICENCIA = 'licencia',
  CERTIFICADO_PI = 'certificado_pi',
  OTRO = 'otro',
}

export const DOCUMENT_TYPE_LABELS: Record<RegistrationFileDocumentType, string> = {
  [RegistrationFileDocumentType.LETRA]: 'Letra de la obra',
  [RegistrationFileDocumentType.PARTITURA]: 'Partitura',
  [RegistrationFileDocumentType.AUDIO_MP3]: 'Audio (MP3)',
  [RegistrationFileDocumentType.AUDIO_WAV]: 'Audio (WAV)',
  [RegistrationFileDocumentType.CARATULA]: 'Carátula',
  [RegistrationFileDocumentType.CONTRATO_EDITORIAL]: 'Contrato Editorial',
  [RegistrationFileDocumentType.CONTRATO_ENCARGO]: 'Contrato por Encargo',
  [RegistrationFileDocumentType.REGISTRO_DNDA]: 'Certificado de Registro DNDA',
  [RegistrationFileDocumentType.DECLARACION_SAYCO]: 'Declaración SAYCO',
  [RegistrationFileDocumentType.AUTORIZACION]: 'Autorización',
  [RegistrationFileDocumentType.LICENCIA]: 'Licencia',
  [RegistrationFileDocumentType.CERTIFICADO_PI]: 'Certificado de Registro de Propiedad Intelectual',
  [RegistrationFileDocumentType.OTRO]: 'Otro',
}

export interface RegistrationFileParticipantDto {
  id: string
  splitAuthorId: string | null
  fullName: string
  documentType: string | null
  documentNumber: string | null
  nationality: string | null
  managementSociety: string | null
  ipiCode: string | null
  saycoCode: string | null
  saycoIpName: string | null
  role: RegistrationFileParticipantRole
  authorialPercentage: number
  mechanicalPercentage: number
}

export interface RegistrationFileDocumentDto {
  id: string
  documentType: RegistrationFileDocumentType
  fileKey: string
  fileUrl: string
  fileName: string
  mimeType: string
  fileSizeBytes: number
  version: number
  status: 'pendiente' | 'cargado' | 'rechazado'
  sha256Hash: string | null
  createdAt: string
}

export interface RegistrationFileProfileStatusDto {
  id: string
  profileKey: RegistrationProfileKey
  status: 'pendiente' | 'presentado' | 'registrado'
  submittedAt: string | null
  registeredAt: string | null
  officialRegistryNumber: string | null
}

export interface PhonogramData {
  hasRecording: boolean
  recordingType: RecordingType | null
  isrc: string | null
  upc: string | null
  mainArtistName: string | null
  albumOrEpName: string | null
  releaseDate: string | null
  phonogramProducer: string | null
  phonogramOwner: string | null
  recordingDate: string | null
}

export interface DerivativeWorkData {
  isDerivative: boolean
  originalWorkOrigin: OriginalWorkOrigin | null
  iswc: string | null
  preexistingWorkName: string | null
  adaptationType: string | null
}

export interface CommissionedWorkData {
  isCommissioned: boolean
  contractingCompany: string | null
  observations: string | null
}

export interface AiUsageData {
  usedAi: boolean
  toolUsed: string | null
  participationLevel: string | null
  observations: string | null
}

export interface RegistrationFileDto {
  id: string
  caseNumber: string
  status: RegistrationFileStatus
  activeProfileKeys: RegistrationProfileKey[]
  title: string
  alternativeTitles: string[]
  language: string
  genre: string
  ritmo: string | null
  durationSeconds: number | null
  creationDate: string | null
  creationPlace: string | null
  workState: WorkState | null
  version: string | null
  description: string | null
  internalCode: string
  hasPublishingDeal: boolean
  publishingContract: { id: string; publisherName: string } | null
  publishingAdministeredPercentage: number | null
  phonogramData: PhonogramData | null
  derivativeWorkData: DerivativeWorkData | null
  commissionedWorkData: CommissionedWorkData | null
  aiUsageData: AiUsageData | null
  participants: RegistrationFileParticipantDto[]
  documents: RegistrationFileDocumentDto[]
  profileStatuses: RegistrationFileProfileStatusDto[]
  generatedPdfUrl: string | null
  generatedZipUrl: string | null
  generatedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface RegistrationFileSummaryDto {
  id: string
  caseNumber: string
  status: RegistrationFileStatus
}

export interface RegistrationFileListItemDto {
  id: string
  caseNumber: string
  title: string
  status: RegistrationFileStatus
  trackId: string
  completenessPercentage: number | null
  activeProfileKeys: RegistrationProfileKey[]
  updatedAt: string
  ownerName: string
}

export interface RegistrationFileListQuery {
  page?: number
  limit?: number
  search?: string
  status?: RegistrationFileStatus
  ownerId?: string
}

export interface PaginatedRegistrationFiles {
  data: RegistrationFileListItemDto[]
  total: number
  page: number
  limit: number
}

export type RegistrationFileValidationSeverity = 'error' | 'warning'

export interface RegistrationFileValidationIssue {
  domain: string
  code: string
  severity: RegistrationFileValidationSeverity
  message: string
  field?: string
}

export interface RegistrationFileDomainCompleteness {
  domain: string
  applicable: boolean
  percentage: number
  issues: RegistrationFileValidationIssue[]
}

export interface RegistrationFileChecklistItem {
  label: string
  satisfied: boolean
  severity: 'ok' | RegistrationFileValidationSeverity
}

export interface RegistrationFileValidationResult {
  overallPercentage: number
  domains: RegistrationFileDomainCompleteness[]
  errors: RegistrationFileValidationIssue[]
  warnings: RegistrationFileValidationIssue[]
  checklist: RegistrationFileChecklistItem[]
  status: RegistrationFileStatus
}
