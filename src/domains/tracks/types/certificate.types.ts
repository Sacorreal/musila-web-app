export type CertificateStatusValue = 'pending' | 'issued' | 'failed';

export interface CertificateStatusDto {
  status: CertificateStatusValue;
  registryNumber: string | null;
  issuedAt: string | null;
  downloadAvailable: boolean;
}
