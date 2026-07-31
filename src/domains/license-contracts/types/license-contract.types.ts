export enum LicenseContractStatus {
  DRAFT = "draft",
  AWAITING_SIGNATURES = "awaiting_signatures",
  SIGNED = "signed",
  FULFILLED = "fulfilled",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

export enum LicenseContractPaymentStatus {
  PENDIENTE = "pendiente",
  PAGADA = "pagada",
  EN_MORA = "en_mora",
  APROBADA = "aprobada",
}

export enum LicenseTerritoryMode {
  GLOBAL = "global",
  SPECIFIC_COUNTRIES = "specific_countries",
}

export enum LicenseDistributionFormat {
  STREAMING = "streaming",
  DOWNLOAD = "download",
  PHYSICAL = "physical",
}

export const DISTRIBUTION_FORMAT_LABELS: Record<LicenseDistributionFormat, string> = {
  [LicenseDistributionFormat.STREAMING]: "Streaming",
  [LicenseDistributionFormat.DOWNLOAD]: "Descarga digital",
  [LicenseDistributionFormat.PHYSICAL]: "Formato físico",
};

export enum LicenseSignatoryRole {
  AUTOR_PRINCIPAL = "autor_principal",
  COAUTOR = "coautor",
  LICENCIATARIO = "licenciatario",
}

export const SIGNATORY_ROLE_LABELS: Record<LicenseSignatoryRole, string> = {
  [LicenseSignatoryRole.AUTOR_PRINCIPAL]: "Compositor (licenciante)",
  [LicenseSignatoryRole.COAUTOR]: "Coautor",
  [LicenseSignatoryRole.LICENCIATARIO]: "Intérprete (licenciatario)",
};

export enum LicenseSignatoryStatus {
  PENDING = "pending",
  SIGNED = "signed",
  REJECTED = "rejected",
}

export interface LicenseContractSignatoryDto {
  id: string;
  user: { id: string; name: string; lastName: string; email: string };
  role: LicenseSignatoryRole;
  status: LicenseSignatoryStatus;
  signedAt?: string | null;
  rejectionReason?: string | null;
}

export interface LicenseAdvanceInstallment {
  amount: number;
  dueDate: string;
}

export interface LicenseAdvanceDistributionEntry {
  userId: string;
  percentage: number;
}

export interface LicenseContractDto {
  id: string;
  requestedTrack: { id: string };
  validityDate: string;
  territoryMode: LicenseTerritoryMode;
  territoryCountries: string[] | null;
  advanceAmount: number;
  advanceCurrency: string;
  advanceInstallmentsCount: number;
  advanceInstallments: LicenseAdvanceInstallment[] | null;
  commissionAmount: number;
  totalPayableByLicensee: number;
  royaltyPercentage: number;
  distributionFormats: LicenseDistributionFormat[];
  advanceDistribution: LicenseAdvanceDistributionEntry[] | null;
  status: LicenseContractStatus;
  paymentStatus: LicenseContractPaymentStatus;
  documentUrl: string | null;
  contractHash: string | null;
  generatedAt: string | null;
  fullySignedAt: string | null;
  fulfilledAt: string | null;
  expiredAt: string | null;
  signatories: LicenseContractSignatoryDto[];
}

export interface UpsertLicenseContractTermsInput {
  validityDate: string;
  territoryMode: LicenseTerritoryMode;
  territoryCountries?: string[];
  advanceAmount: number;
  advanceInstallmentsCount: number;
  installments?: LicenseAdvanceInstallment[];
  royaltyPercentage: number;
  distributionFormats: LicenseDistributionFormat[];
  advanceDistribution?: LicenseAdvanceDistributionEntry[];
}

export interface LicenseCollectionDto {
  id: string;
  amount: number;
  dueDate: string;
  status: "pendiente" | "enlace_enviado" | "pagado" | "en_mora";
  installmentNumber: number;
  paidAt?: string | null;
}

export interface SplitCoauthorForDistribution {
  userId: string;
  name: string;
  royaltyPercentage: number;
}
