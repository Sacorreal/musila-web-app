"use client";

import React, { useMemo } from "react";
import { cn } from "@/src/shared/libs/cn";
import { TrackRequest } from "../../types/request.types";
import {
  LICENSE_PIPELINE_STAGES,
  deriveLicensePipeline,
} from "../../utils/license-pipeline";

interface Props {
  request: TrackRequest;
  className?: string;
}

/**
 * Mini-visualización del pipeline (5 puntos) para listas y tablas.
 *
 * Deriva la etapa únicamente de los campos ya cargados en la solicitud (sin
 * consultar el contrato online), para no disparar una petición por cada fila.
 */
export function LicensePipelineCompact({ request, className }: Props) {
  const state = useMemo(() => deriveLicensePipeline(request), [request]);

  const activeLabel = LICENSE_PIPELINE_STAGES[state.currentIndex]?.label ?? "";
  const summary = state.isTerminal
    ? state.terminal === "rechazada"
      ? "Solicitud rechazada"
      : "Solicitud cancelada"
    : `Etapa actual: ${activeLabel}`;

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="img"
      aria-label={`Pipeline de licencia. ${summary}`}
      title={summary}
    >
      {LICENSE_PIPELINE_STAGES.map((meta, index) => {
        const isDone = !state.isTerminal && index < state.currentIndex;
        const isActive = !state.isTerminal && index === state.currentIndex;
        const isHalted = state.isTerminal && index <= state.currentIndex;
        const isLast = index === LICENSE_PIPELINE_STAGES.length - 1;

        const haltedColor =
          state.terminal === "rechazada"
            ? "bg-rose-500"
            : "bg-slate-400 dark:bg-slate-500";

        return (
          <React.Fragment key={meta.key}>
            <span
              className={cn(
                "h-2 w-2 shrink-0 rounded-full transition-colors",
                isDone && "bg-primary",
                isActive && "bg-primary ring-2 ring-primary/25",
                isHalted && haltedColor,
                !isDone && !isActive && !isHalted && "bg-border",
              )}
            />
            {!isLast && (
              <span
                className={cn(
                  "h-0.5 w-2.5 shrink-0 rounded-full transition-colors sm:w-3.5",
                  isDone ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
