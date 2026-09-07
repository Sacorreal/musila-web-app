import { BusinessDocumentType } from '../constants/business-document-catalog';

/** Espejo del enum backend `organizations/entities/organization-type.enum.ts`. */
export enum OrganizationType {
  LABEL = 'LABEL',
  PUBLISHER = 'PUBLISHER',
  MANAGEMENT = 'MANAGEMENT',
  AGENCY = 'AGENCY',
  MUSIC_LIBRARY = 'MUSIC_LIBRARY',
  OTHER = 'OTHER',
}

export const ORGANIZATION_TYPE_LABELS: Record<OrganizationType, string> = {
  [OrganizationType.LABEL]: 'Label',
  [OrganizationType.PUBLISHER]: 'Publisher (editorial)',
  [OrganizationType.MANAGEMENT]: 'Management',
  [OrganizationType.AGENCY]: 'Agencia',
  [OrganizationType.MUSIC_LIBRARY]: 'Music Library',
  [OrganizationType.OTHER]: 'Otro',
};

export interface CreateBusinessRegistrationInput {
  email: string;
  password: string;
  legalName: string;
  organizationType: OrganizationType;
  legalCountry: string;
  documentType: BusinessDocumentType;
  documentNumber: string;
  phoneCountryCode: string;
  phoneNumber: string;
  planKey: string;
}

export interface BusinessRegistrationResponse {
  token: string;
  organizationId: string;
}

export interface BusinessPlanDto {
  key: string;
  name: string;
  description: string | null;
  tier: 'FREE' | 'PREMIUM' | 'CUSTOM';
}
