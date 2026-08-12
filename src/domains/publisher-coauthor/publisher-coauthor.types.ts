import { CoauthorRole } from '@/src/domains/splits/types/splits.types';

export interface RosterCoauthorDefaultDto {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  enabled: boolean;
  role: CoauthorRole;
  percentage: number;
}

export interface PublisherCoauthorPolicyDto {
  organizationId: string;
  roster: RosterCoauthorDefaultDto[];
}

export interface RosterCoauthorDefaultItem {
  userId: string;
  enabled: boolean;
  role: CoauthorRole;
  percentage: number;
}

/** Coautoría por defecto de publisher que aplica al usuario autenticado. */
export interface MyPublisherCoauthorDto {
  organizationId: string;
  organizationName: string;
  role: CoauthorRole;
  percentage: number;
}
