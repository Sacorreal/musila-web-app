import { cn } from '@/src/shared/libs/cn';
import type { AffiliateTier } from '../../types/affiliate.types';

const TIER_CONFIG: Record<AffiliateTier, { label: string; className: string }> = {
  standard: { label: 'Estándar', className: 'bg-muted text-muted-foreground border-border' },
  ambassador: { label: 'Embajador', className: 'bg-primary/10 text-primary border-primary/20' },
  partner: { label: 'Partner', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
};

export function TierBadge({ tier }: { tier: AffiliateTier }) {
  const config = TIER_CONFIG[tier];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider',
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
