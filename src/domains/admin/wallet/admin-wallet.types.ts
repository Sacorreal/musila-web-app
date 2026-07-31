import { PaginatedResponse } from '@shared/types/shared.types'
import { WalletWithdrawalStatus, BankAccountDto } from '@/src/domains/wallet/types/wallet.types'

export { WalletWithdrawalStatus }

export interface AdminWalletWithdrawalDto {
  id: string
  amount: number
  currency: string
  status: WalletWithdrawalStatus
  bankAccountSnapshot: BankAccountDto
  rejectionReason: string | null
  inProcessAt: string | null
  paidAt: string | null
  rejectedAt: string | null
  createdAt: string
  user: { id: string; name: string; lastName: string; email: string }
  processedByAdmin?: { id: string; name: string; lastName: string } | null
}

export interface AdminWalletFilters {
  status?: WalletWithdrawalStatus
  userId?: string
}

export type PaginatedAdminWithdrawals = PaginatedResponse<AdminWalletWithdrawalDto>
