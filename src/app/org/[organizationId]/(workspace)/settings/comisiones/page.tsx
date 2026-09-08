'use client';

import { use } from 'react';
import { PageHeader } from '@/src/shared/components/UI/PageHeader';
import { PublisherCommissionSettings } from '@/src/domains/publisher-commission/components/PublisherCommissionSettings';

/** Configuración de la comisión por anticipo de licencia de la publisher. */
export default function OrgCommissionsSettingsPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = use(params);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comisiones"
        description="Define la comisión que tu editorial cobra sobre las licencias de los autores de tu roster."
      />
      <div className="max-w-2xl">
        <PublisherCommissionSettings organizationId={organizationId} />
      </div>
    </div>
  );
}
