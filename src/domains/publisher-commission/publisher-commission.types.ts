export interface RosterCommissionDto {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  percentage: number;
}

export interface PublisherCommissionPolicyDto {
  organizationId: string;
  commissionEnabled: boolean;
  roster: RosterCommissionDto[];
}

export interface RosterCommissionItem {
  userId: string;
  percentage: number;
}
