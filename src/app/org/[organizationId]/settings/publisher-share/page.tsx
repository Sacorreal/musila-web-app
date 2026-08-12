'use client';

import { use } from 'react';
import { PageHeader } from '@/src/shared/components/UI/PageHeader';
import { PublisherShareSettings } from '@/src/domains/publisher-share/components/PublisherShareSettings';

/** Configuración del Publisher's Share de la publisher sobre su roster. */
export default function OrgPublisherSharePage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = use(params);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Publisher's Share"
        description="Define el porcentaje informativo que tu editorial declara en las canciones de cada autor de tu roster."
      />
      <div className="max-w-2xl">
        <PublisherShareSettings organizationId={organizationId} />
      </div>
    </div>
  );
}
