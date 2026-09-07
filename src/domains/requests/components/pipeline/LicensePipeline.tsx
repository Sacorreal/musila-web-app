"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Send,
  MessagesSquare,
  HandCoins,
  CheckCircle2,
  FileSignature,
  Ban,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/src/shared/libs/cn";
import { TrackRequest } from "../../types/request.types";
import { LicenseType } from "@/src/domains/tracks/types/track.types";
import { useLicenseContract } from "@/src/domains/license-contracts/hooks/license-contracts.hooks";
import {
  LICENSE_PIPELINE_STAGES,
  LicensePipelineStage,
  deriveLicensePipeline,
} from "../../utils/license-pipeline";

interface Props {
  request: TrackRequest;
  className?: string;
}

const STAGE_ICONS: Record<LicensePipelineStage, LucideIcon> = {
  [LicensePipelineStage.SOLICITUD]: Send,
  [LicensePipelineStage.NEGOCIACION]: MessagesSquare,
  [LicensePipelineStage.OFERTA]: HandCoins,
  [LicensePipelineStage.ACEPTADA]: CheckCircle2,
  [LicensePipelineStage.CONTRATO]: FileSignature,
};

const TERMINAL_META = {
  rechazada: {
    label: "Solicitud rechazada",
    icon: XCircle,
    dotClass: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    chipClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  cancelada: {
    label: "Solicitud cancelada",
    icon: Ban,
    dotClass: "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30",
    chipClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  },
} as const;

export function LicensePipeline({ request, className }: Props) {
  const isFirstUseLicense = request.licenseType === LicenseType.LICENCIA_DE_PRIMER_USO;

  // El contrato solo existe para licencias de primer uso. La consulta se comparte
  // (misma queryKey) con `LicenseContractSection`, así que no genera fetch extra.
  const { data: contract } = useLicenseContract(isFirstUseLicense ? request.id : undefined);

  const state = useMemo(
    () => deriveLicensePipeline(request, contract),
    [request, contract],
  );

  return (
    <section
      className={cn(
        "rounded-[1.5rem] border border-border/60 bg-muted/20 p-5 md:p-6",
        className,
      )}
      aria-label="Estado de la licencia"
    >
      <header className="mb-6 flex items-center justify-between gap-3">
        <h3 className="text-sm font-black uppercase tracking-widest text-primary">
          Estado de la licencia
        </h3>
        {state.isTerminal && state.terminal && (
          <TerminalChip terminal={state.terminal} />
        )}
      </header>

      <ol
        role="list"
        className="flex items-start gap-0 overflow-x-auto pb-2"
      >
        {LICENSE_PIPELINE_STAGES.map((meta, index) => {
          const isDone = !state.isTerminal && index < state.currentIndex;
          const isActive = !state.isTerminal && index === state.currentIndex;
          const isReachedButHalted = state.isTerminal && index <= state.currentIndex;
          const Icon = STAGE_ICONS[meta.stage];
          const isLast = index === LICENSE_PIPELINE_STAGES.length - 1;

          return (
            <li
              key={meta.key}
              role="listitem"
              aria-current={isActive ? "step" : undefined}
              className="flex min-w-[76px] flex-1 flex-col items-center text-center"
            >
              <div className="flex w-full items-center">
                {/* Conector izquierdo (oculto en el primer paso) */}
                <Connector visible={index > 0} filled={isDone || isActive || isReachedButHalted} />

                <StageDot
                  Icon={Icon}
                  isDone={isDone}
                  isActive={isActive}
                  isHalted={isReachedButHalted}
                  terminal={state.terminal}
                />

                {/* Conector derecho (oculto en el último paso) */}
                <Connector visible={!isLast} filled={isDone} />
              </div>

              <div className="mt-3 px-1">
                <p
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-wider transition-colors",
                    isActive
                      ? "text-primary"
                      : isDone
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {meta.label}
                </p>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 hidden text-[10px] font-medium leading-tight text-muted-foreground sm:block"
                  >
                    {meta.description}
                  </motion.p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

interface StageDotProps {
  Icon: LucideIcon;
  isDone: boolean;
  isActive: boolean;
  isHalted: boolean;
  terminal: "rechazada" | "cancelada" | null;
}

function StageDot({ Icon, isDone, isActive, isHalted, terminal }: StageDotProps) {
  const haltedClass = terminal ? TERMINAL_META[terminal].dotClass : "";

  return (
    <div className="relative flex shrink-0 items-center justify-center">
      {isActive && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-primary/25"
          animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
          isDone && "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20",
          isActive && "border-primary bg-primary/10 text-primary",
          isHalted && haltedClass,
          !isDone && !isActive && !isHalted && "border-border bg-background text-muted-foreground",
        )}
      >
        <Icon size={17} strokeWidth={2.4} />
      </div>
    </div>
  );
}

function Connector({ visible, filled }: { visible: boolean; filled: boolean }) {
  return (
    <div className="h-0.5 flex-1" aria-hidden>
      {visible && (
        <div className="relative h-full w-full overflow-hidden rounded-full bg-border">
          <motion.div
            className="absolute inset-0 origin-left rounded-full bg-primary"
            initial={false}
            animate={{ scaleX: filled ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      )}
    </div>
  );
}

function TerminalChip({ terminal }: { terminal: "rechazada" | "cancelada" }) {
  const meta = TERMINAL_META[terminal];
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest",
        meta.chipClass,
      )}
    >
      <Icon size={11} />
      {meta.label}
    </div>
  );
}
