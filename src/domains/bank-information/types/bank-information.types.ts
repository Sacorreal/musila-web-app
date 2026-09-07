export interface BankOption {
  id: string;
  name: string;
}

export interface AccountTypeOption {
  value: string;
  label: string;
}

export interface DocumentTypeOption {
  value: string;
  label: string;
}

export interface TransferOptionsDto {
  banks: BankOption[];
  accountTypes: AccountTypeOption[];
  documentTypes: DocumentTypeOption[];
}

export interface PendingBankInformationRequestDto {
  requestId: string;
  contractId: string;
  trackTitle: string;
  advanceAmount: number;
}

export interface PendingBankInformationStatusDto {
  pending: boolean;
  request?: PendingBankInformationRequestDto | null;
}

export type BankInformationMethod = "wompi_colombia" | "global66_international";

export interface ColombiaBankInformationPayload {
  bankId: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  accountHolderName: string;
  accountHolderIdType: string;
  accountHolderIdNumber: string;
}

export interface ForeignBankInformationPayload {
  countryCallingCode: string;
  phoneNumber: string;
  email: string;
  global66Username: string;
}

export interface BankInformationDto {
  method: BankInformationMethod;
  data: ColombiaBankInformationPayload | ForeignBankInformationPayload;
  legalNoticeAcceptedAt: string | null;
  updatedAt: string;
}
