import { SocietyAffiliationRightsType, SocietyAffiliationStatus, SocietyAffiliationVerificationStatus } from './society-affiliations.types'

export const RIGHTS_TYPE_LABELS: Record<SocietyAffiliationRightsType, string> = {
  [SocietyAffiliationRightsType.PR]: 'Ejecución pública (PR)',
  [SocietyAffiliationRightsType.MR]: 'Derechos mecánicos (MR)',
  [SocietyAffiliationRightsType.SR]: 'Sincronización (SR)',
}

export const STATUS_LABELS: Record<SocietyAffiliationStatus, string> = {
  [SocietyAffiliationStatus.PENDING]: 'Pendiente',
  [SocietyAffiliationStatus.ACTIVE]: 'Activa',
  [SocietyAffiliationStatus.SUSPENDED]: 'Suspendida',
  [SocietyAffiliationStatus.ENDED]: 'Finalizada',
  [SocietyAffiliationStatus.REJECTED]: 'Rechazada',
}

export const STATUS_BADGE_VARIANT: Record<SocietyAffiliationStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  [SocietyAffiliationStatus.PENDING]: 'secondary',
  [SocietyAffiliationStatus.ACTIVE]: 'default',
  [SocietyAffiliationStatus.SUSPENDED]: 'outline',
  [SocietyAffiliationStatus.ENDED]: 'outline',
  [SocietyAffiliationStatus.REJECTED]: 'destructive',
}

export const VERIFICATION_STATUS_LABELS: Record<SocietyAffiliationVerificationStatus, string> = {
  [SocietyAffiliationVerificationStatus.UNVERIFIED]: 'Sin verificar',
  [SocietyAffiliationVerificationStatus.DECLARED]: 'Autodeclarada',
  [SocietyAffiliationVerificationStatus.DOCUMENT_SUPPORTED]: 'Con soporte documental',
  [SocietyAffiliationVerificationStatus.VERIFIED]: 'Verificada',
  [SocietyAffiliationVerificationStatus.REJECTED]: 'Rechazada',
}

export const VERIFICATION_STATUS_BADGE_VARIANT: Record<SocietyAffiliationVerificationStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  [SocietyAffiliationVerificationStatus.UNVERIFIED]: 'outline',
  [SocietyAffiliationVerificationStatus.DECLARED]: 'secondary',
  [SocietyAffiliationVerificationStatus.DOCUMENT_SUPPORTED]: 'secondary',
  [SocietyAffiliationVerificationStatus.VERIFIED]: 'default',
  [SocietyAffiliationVerificationStatus.REJECTED]: 'destructive',
}
