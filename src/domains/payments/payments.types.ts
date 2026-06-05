export type PlanType = 'free' | 'pro';

export type PaymentRole = 'autor' | 'cantautor' | 'interprete';

export interface PaymentPreference {
  initPoint: string;
  externalReference: string;
}

export type PaymentStatusValue = 'pending' | 'approved' | 'expired' | 'not_found' | 'failed';

export interface PaymentStatus {
  status: PaymentStatusValue;
  userId?: string;
  plan?: PlanType;
  role?: PaymentRole;
}
