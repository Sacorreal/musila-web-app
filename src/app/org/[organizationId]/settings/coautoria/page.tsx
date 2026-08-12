'use client';

import { use } from 'react';
import { PageHeader } from '@/src/shared/components/UI/PageHeader';
import { PublisherCoauthorSettings } from '@/src/domains/publisher-coauthor/components/PublisherCoauthorSettings';

/** Configuración de la coautoría por defecto de la publisher sobre su roster. */
export default function OrgCoauthorSettingsPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = use(params);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coautoría por defecto"
        description="Define en qué canciones de tu roster tu editorial queda como coautora automáticamente."
      />
      <div className="max-w-2xl">
        <PublisherCoauthorSettings organizationId={organizationId} />
      </div>
    </div>
  );
}
