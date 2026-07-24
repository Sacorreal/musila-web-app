export type PlanType = 'free' | 'pro';

export type PaymentPlanType = 'plan_autor' | 'plan_360' | 'plan_descubridor';

export interface PaymentPreference {
  initPoint: string;
  externalReference: string;
}

export type PaymentStatusValue = 'pending' | 'approved' | 'expired' | 'not_found' | 'failed';

export interface PaymentStatus {
  status: PaymentStatusValue;
  userId?: string;
  plan?: PlanType;
  planType?: PaymentPlanType;
}
