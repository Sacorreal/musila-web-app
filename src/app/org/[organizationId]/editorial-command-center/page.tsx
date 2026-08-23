"use client";

import { use, useState } from "react";
import { PageHeader } from "@/src/shared/components/UI/PageHeader";
import { CatalogHealthOverview } from "@/src/domains/editorial-command-center/components/CatalogHealthOverview";
import { TrackHealthScorePanel } from "@/src/domains/editorial-command-center/components/TrackHealthScorePanel";
import {
  useOrganizationCatalogHealthScore,
  useOrganizationTrackHealthScore,
} from "@/src/domains/editorial-command-center/hooks/editorial-command-center.hooks";

export default function EditorialCommandCenterOrgPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = use(params);
  const [selectedTrackId, setSelectedTrackId] = useState<string>();

  const overview = useOrganizationCatalogHealthScore(organizationId);
  const trackScore = useOrganizationTrackHealthScore(organizationId, selectedTrackId ?? "");

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <PageHeader
        title="Editorial Command Center"
        description="Health Score documental, legal, de propiedad intelectual y comercial del catálogo del roster"
      />
      <CatalogHealthOverview
        data={overview.data}
        isLoading={overview.isLoading}
        isError={overview.isError}
        onRetry={() => overview.refetch()}
        selectedTrackId={selectedTrackId}
        onSelectTrack={setSelectedTrackId}
        trackDetail={
          selectedTrackId ? (
            <TrackHealthScorePanel
              data={trackScore.data}
              isLoading={trackScore.isLoading}
              isError={trackScore.isError}
              onRetry={() => trackScore.refetch()}
            />
          ) : undefined
        }
      />
    </div>
  );
}
