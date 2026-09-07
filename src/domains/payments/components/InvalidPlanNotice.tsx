import React from 'react';
import Link from 'next/link';

export function InvalidPlanNotice() {
  return (
    <div className="rounded-2xl border border-border bg-card p-8 text-center">
      <p className="text-muted-foreground">No se especificó un plan válido.</p>
      <Link href="/#pricing" className="mt-4 inline-block text-primary underline">
        Ver planes disponibles
      </Link>
    </div>
  );
}
