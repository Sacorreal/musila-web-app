"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/UI/card";
import { Progress } from "@/src/shared/components/UI/progress";
import { Button } from "@/src/shared/components/UI/button";
import { ErrorState } from "@/src/shared/components/UI/ErrorState";
import { DashboardCardSkeleton } from "@/src/domains/dashboard/components/DashboardCardSkeleton";
import { HealthScoreGauge } from "./HealthScoreGauge";
import { MissingFieldsList } from "./MissingFieldsList";
import type {
  HealthScoreCategory,
  HealthScoreIntellectualProperty,
  TrackHealthScore,
} from "../types/editorial-command-center.types";

interface TrackHealthScorePanelProps {
  data?: TrackHealthScore;
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
}

/** Health Score individual de una canción, desglosado por categoría (Flow 2). */
export function TrackHealthScorePanel({ data, isLoading, isError, onRetry }: TrackHealthScorePanelProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <DashboardCardSkeleton key={i} className="h-36" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-3">
        <ErrorState message="No se pudo calcular el Health Score de esta canción." />
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

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <HealthScoreGauge score={data.overallScore} label={data.title} size={160} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CategoryCard title="Estado Documental" category={data.documentary} />
        <CategoryCard title="Estado Legal" category={data.legal} />
        <IntellectualPropertyCard category={data.intellectualProperty} />
        <CategoryCard title="Estado Comercial" category={data.commercial} />
      </div>
    </div>
  );
}

function CategoryHeaderButton({
  title,
  score,
  expanded,
  onToggle,
}: {
  title: string;
  score: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      className="flex w-full items-center justify-between gap-2 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      <span className="flex items-center gap-2">
        <span className="text-lg font-black tabular-nums">{Math.round(score)}%</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}

function CategoryCard({ title, category }: { title: string; category: HealthScoreCategory }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CategoryHeaderButton title={title} score={category.score} expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={category.score} />
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-1">
                <MissingFieldsList fields={category.fields} warning={category.warning} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

function IntellectualPropertyCard({ category }: { category: HealthScoreIntellectualProperty }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CategoryHeaderButton
          title="Estado de Propiedad Intelectual"
          score={category.score}
          expanded={expanded}
          onToggle={() => setExpanded((v) => !v)}
        />
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={category.score} />
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-1">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Split Autoral ({category.splitAuthoral.signedCount}/{category.splitAuthoral.totalCoauthors} firmado
                    {category.splitAuthoral.totalCoauthors === 1 ? "" : "s"})
                  </p>
                  <Progress value={category.splitAuthoral.score} className="mt-1.5 h-1.5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Split Editorial{" "}
                    {!category.splitEditorial.applicable && "— no aplica (sin editora configurada)"}
                  </p>
                  {category.splitEditorial.applicable && (
                    <>
                      <Progress value={category.splitEditorial.score ?? 0} className="mt-1.5 h-1.5" />
                      {category.splitEditorial.missingFields.length > 0 && (
                        <div className="mt-2">
                          <MissingFieldsList
                            fields={category.splitEditorial.missingFields.map((label) => ({
                              key: label,
                              label,
                              completed: false,
                            }))}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
