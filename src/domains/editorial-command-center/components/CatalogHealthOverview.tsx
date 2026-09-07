"use client";

import type { ReactNode } from "react";
import { RankedBarChart } from "@/src/domains/dashboard/components/RankedBarChart";
import { DashboardCardSkeletonGrid } from "@/src/domains/dashboard/components/DashboardCardSkeleton";
import { ErrorState } from "@/src/shared/components/UI/ErrorState";
import { Button } from "@/src/shared/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/UI/card";
import { HealthScoreGauge } from "./HealthScoreGauge";
import type { CatalogHealthScore } from "../types/editorial-command-center.types";

interface CatalogHealthOverviewProps {
  data?: CatalogHealthScore;
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  selectedTrackId?: string;
  onSelectTrack: (trackId: string) => void;
  /** Slot para el detalle del track seleccionado (Flow 2), inyectado por la página para no acoplar este componente a un hook específico (org vs. personal). */
  trackDetail?: ReactNode;
}

/** Health Score consolidado del catálogo (Flow 1). */
export function CatalogHealthOverview({
  data,
  isLoading,
  isError,
  onRetry,
  selectedTrackId,
  onSelectTrack,
  trackDetail,
}: CatalogHealthOverviewProps) {
  if (isLoading) {
    return <DashboardCardSkeletonGrid count={4} />;
  }

  if (isError || !data) {
    return (
      <div className="space-y-3">
        <ErrorState message="No se pudo cargar el Health Score del catálogo. Intenta de nuevo." />
        {onRetry && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={onRetry}>
              Reintentar
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (data.totalTracks === 0) {
    return <ErrorState message="Todavía no hay obras en el catálogo para calcular un Health Score." />;
  }

  const categoryAverages = [
    { label: "Documental", count: data.categoryAverages.documentary },
    { label: "Legal", count: data.categoryAverages.legal },
    { label: "Propiedad Intelectual", count: data.categoryAverages.intellectualProperty },
    { label: "Comercial", count: data.categoryAverages.commercial },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex justify-center">
          <HealthScoreGauge score={data.globalScore} label={`${data.totalTracks} obras`} size={160} />
        </div>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Distribución por categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <RankedBarChart data={categoryAverages} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Obras del catálogo</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-2">Obra</th>
                <th className="px-2 py-2 text-right">Documental</th>
                <th className="px-2 py-2 text-right">Legal</th>
                <th className="px-2 py-2 text-right">Prop. Intelectual</th>
                <th className="px-2 py-2 text-right">Comercial</th>
                <th className="py-2 pl-2 text-right">Global</th>
              </tr>
            </thead>
            <tbody>
              {data.tracks.map((track) => (
                <tr
                  key={track.trackId}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver detalle del Health Score de ${track.title}`}
                  aria-current={selectedTrackId === track.trackId ? "true" : undefined}
                  onClick={() => onSelectTrack(track.trackId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectTrack(track.trackId);
                    }
                  }}
                  className={`cursor-pointer border-b border-border/40 transition-colors outline-none hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${
                    selectedTrackId === track.trackId ? "bg-muted/60" : ""
                  }`}
                >
                  <td className="py-2 pr-2 font-medium text-foreground">{track.title}</td>
                  <td className="px-2 py-2 text-right tabular-nums">{Math.round(track.documentaryScore)}%</td>
                  <td className="px-2 py-2 text-right tabular-nums">{Math.round(track.legalScore)}%</td>
                  <td className="px-2 py-2 text-right tabular-nums">{Math.round(track.intellectualPropertyScore)}%</td>
                  <td className="px-2 py-2 text-right tabular-nums">{Math.round(track.commercialScore)}%</td>
                  <td className="py-2 pl-2 text-right font-bold tabular-nums">{Math.round(track.overallScore)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {selectedTrackId && <div className="space-y-2">{trackDetail}</div>}
    </div>
  );
}
