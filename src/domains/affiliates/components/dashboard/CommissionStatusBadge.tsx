import { cn } from '@/src/shared/libs/cn';
import type { CommissionStatus } from '../../types/affiliate-dashboard.types';

const STATUS_CONFIG: Record<CommissionStatus, { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  approved: { label: 'Aprobada', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  paid: { label: 'Pagada', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  rejected: { label: 'Rechazada', className: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

export function CommissionStatusBadge({ status }: { status: CommissionStatus }) {
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
