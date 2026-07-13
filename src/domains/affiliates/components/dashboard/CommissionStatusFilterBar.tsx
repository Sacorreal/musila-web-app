import React from 'react';
import { Button } from '@/src/shared/components/UI/button';
import type { CommissionStatus } from '@/src/domains/affiliates/types/affiliate-dashboard.types';

export interface CommissionStatusFilter {
  label: string;
  value: CommissionStatus | undefined;
}

export const COMMISSION_STATUS_FILTERS: CommissionStatusFilter[] = [
  { label: 'Todas', value: undefined },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Aprobadas', value: 'approved' },
  { label: 'Pagadas', value: 'paid' },
  { label: 'Rechazadas', value: 'rejected' },
];

interface CommissionStatusFilterBarProps {
  status: CommissionStatus | undefined;
  onChange: (status: CommissionStatus | undefined) => void;
}

export function CommissionStatusFilterBar({ status, onChange }: CommissionStatusFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {COMMISSION_STATUS_FILTERS.map((filter) => (
        <Button
          key={filter.label}
          size="sm"
          variant={status === filter.value ? 'default' : 'outline'}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
