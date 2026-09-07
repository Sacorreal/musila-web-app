import { cn } from '@/src/shared/libs/cn';
import { WalletWithdrawalStatus } from '../types/wallet.types';

const STATUS_CONFIG: Record<WalletWithdrawalStatus, { label: string; className: string }> = {
  [WalletWithdrawalStatus.PENDING]: {
    label: 'Pendiente',
    className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  [WalletWithdrawalStatus.IN_PROCESS]: {
    label: 'En proceso',
    className: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  },
  [WalletWithdrawalStatus.PAID]: {
    label: 'Pagado',
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  [WalletWithdrawalStatus.REJECTED]: {
    label: 'Rechazado',
    className: 'bg-red-500/10 text-red-500 border-red-500/20',
  },
};

export function WithdrawalStatusBadge({ status }: { status: WalletWithdrawalStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold',
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
