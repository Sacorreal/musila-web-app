import { RequestStatus } from "../types/request.types";
import { Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export const STATUS_CONFIG: Record<RequestStatus, { label: string; color: string; icon: any }> = {
  [RequestStatus.PENDIENTE]: {
    label: "Pendiente",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: Clock,
  },
  [RequestStatus.APROBADA]: {
    label: "Aprobada",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
  [RequestStatus.RECHAZADA]: {
    label: "Rechazada",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: AlertCircle,
  },
  [RequestStatus.CANCELADA]: {
    label: "Cancelada",
    color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    icon: XCircle,
  },
};
