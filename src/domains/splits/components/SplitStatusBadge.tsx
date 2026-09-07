import { Clock, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { SplitAuthorStatus, SplitStatus } from "../types/splits.types";

const SPLIT_STATUS_CONFIG: Record<SplitStatus, { label: string; className: string; icon: React.ReactNode }> = {
  [SplitStatus.PENDING_APPROVAL]: {
    label: "Pendiente de aprobación",
    className: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/30",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  [SplitStatus.COMPLETED]: {
    label: "Completado",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30",
    icon: <ShieldCheck className="h-3.5 w-3.5" />,
  },
  [SplitStatus.BLOCKED]: {
    label: "Bloqueado (rechazado)",
    className: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/30",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

const AUTHOR_STATUS_CONFIG: Record<SplitAuthorStatus, { label: string; className: string; icon: React.ReactNode }> = {
  [SplitAuthorStatus.PENDING]: {
    label: "Pendiente",
    className: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/30",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  [SplitAuthorStatus.APPROVED]: {
    label: "Aprobado",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  [SplitAuthorStatus.REJECTED]: {
    label: "Rechazado",
    className: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/30",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

export function SplitStatusBadge({ status }: { status: SplitStatus }) {
  const config = SPLIT_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

export function SplitAuthorStatusBadge({ status }: { status: SplitAuthorStatus }) {
  const config = AUTHOR_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-xs font-semibold ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
}
