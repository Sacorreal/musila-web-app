import { BadgeCheck } from 'lucide-react';
import { cn } from '@/src/shared/libs/cn';

interface VerifiedBadgeProps {
  className?: string;
  size?: number;
}

export function VerifiedBadge({ className, size = 20 }: VerifiedBadgeProps) {
  return (
    <span title="Artista verificado Pro" aria-label="Artista verificado Pro">
      <BadgeCheck
        size={size}
        className={cn('text-primary drop-shadow-sm', className)}
        aria-hidden="true"
      />
    </span>
  );
}
