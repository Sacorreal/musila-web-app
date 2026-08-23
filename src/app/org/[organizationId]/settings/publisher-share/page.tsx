'use client';

import { use } from 'react';
import { PageHeader } from '@/src/shared/components/UI/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/shared/components/UI/tabs';
import { PublisherShareSettings } from '@/src/domains/publisher-share/components/PublisherShareSettings';
import { EditorialRelationshipsHistory } from '@/src/domains/editorial-relationships/components/EditorialRelationshipsHistory';
import { useOrganizationEditorialRelationships } from '@/src/domains/editorial-relationships/hooks/editorial-relationships.hooks';

/** Configuración del Publisher's Share de la publisher sobre su roster + historial de relaciones (Flow 3). */
export default function OrgPublisherSharePage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = use(params);
  const { data: relationships, isLoading, isError } = useOrganizationEditorialRelationships(organizationId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Publisher's Share"
        description="Define el porcentaje informativo que tu editorial declara en las canciones de cada autor de tu roster."
      />

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <div className="max-w-2xl">
            <PublisherShareSettings organizationId={organizationId} />
          </div>
        </TabsContent>
        <TabsContent value="history">
          <EditorialRelationshipsHistory
            items={relationships}
            isLoading={isLoading}
            isError={isError}
            perspective="publisher"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
