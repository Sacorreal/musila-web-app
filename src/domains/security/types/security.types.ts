export interface PasskeySummary {
  id: string;
  name: string | null;
  deviceType: string | null;
  createdAt: string;
  lastUsedAt: string | null;
}

export interface MfaStatus {
  mfaEnabled: boolean;
  passkeysCount: number;
  totpEnabled: boolean;
  recoveryCodesRemaining: number;
  availableMethods: ('PASSKEY' | 'TOTP' | 'RECOVERY_CODE')[];
  organizationPolicy?: {
    organizationId: string;
    mfaRequired: boolean;
    passkeyRequired: boolean;
    totpAllowed: boolean;
    satisfied: boolean;
    missing: ('MFA' | 'PASSKEY' | 'RECOVERY_CODES')[];
  };
}

export interface TotpSetupResult {
  qrCodeDataUrl: string;
  manualEntryKey: string;
}

export interface OrganizationSecurityPolicy {
  organizationId: string;
  mfaRequired: boolean;
  passkeyRequired: boolean;
  totpAllowed: boolean;
  recoveryCodesRequired: boolean;
}

export type StepUpMethod = 'PASSKEY' | 'TOTP';
