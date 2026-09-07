export interface RosterPublisherShareDto {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  enabled: boolean;
  percentage: number;
}

export interface PublisherSharePolicyDto {
  organizationId: string;
  roster: RosterPublisherShareDto[];
}

export interface PublisherShareItem {
  userId: string;
  enabled: boolean;
  percentage: number;
}

/** Publisher's Share que aplica al usuario autenticado (dato informativo). */
export interface MyPublisherShareDto {
  organizationId: string;
  organizationName: string;
  percentage: number;
}
