import { PaginatedResponse } from '@shared/types/shared.types';

export enum WalletEarningRole {
  OWN = 'own',
  COAUTHOR = 'coauthor',
}

export enum WalletWithdrawalStatus {
  PENDING = 'pending',
  IN_PROCESS = 'in_process',
  PAID = 'paid',
  REJECTED = 'rejected',
}

export interface WalletBalanceDto {
  totalEarnedOwn: number;
  totalEarnedCoauthor: number;
  totalEarned: number;
  totalWithdrawnPaid: number;
  totalReserved: number;
  availableBalance: number;
  currency: string;
}

export interface WalletEarningDto {
  id: string;
  trackTitle: string;
  role: WalletEarningRole;
  grossAmount: number;
  percentage: number;
  amount: number;
  currency: string;
  occurredAt: string;
  createdAt: string;
}

export interface WalletWithdrawalDto {
  id: string;
  amount: number;
  currency: string;
  status: WalletWithdrawalStatus;
  rejectionReason: string | null;
  inProcessAt: string | null;
  paidAt: string | null;
  rejectedAt: string | null;
  createdAt: string;
}

export interface CreateWithdrawalInput {
  amount: number;
}

export type PaginatedWalletEarnings = PaginatedResponse<WalletEarningDto>;
export type PaginatedWalletWithdrawals = PaginatedResponse<WalletWithdrawalDto>;

export interface BankAccountDto {
  bankName: string;
  accountType: string;
  accountNumber: string;
  accountHolderName: string;
  accountHolderIdType: string;
  accountHolderIdNumber: string;
}
