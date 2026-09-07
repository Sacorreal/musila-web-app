import { Clock, CheckCircle2, XCircle, ShieldCheck, AlertTriangle, FileClock } from "lucide-react";
import { LicenseContractPaymentStatus, LicenseSignatoryStatus } from "../types/license-contract.types";

const PAYMENT_STATUS_CONFIG: Record<LicenseContractPaymentStatus, { label: string; className: string; icon: React.ReactNode }> = {
  [LicenseContractPaymentStatus.PENDIENTE]: {
    label: "Pago pendiente",
    className: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/30",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  [LicenseContractPaymentStatus.PAGADA]: {
    label: "Pagada",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  [LicenseContractPaymentStatus.EN_MORA]: {
    label: "En mora",
    className: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/30",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  [LicenseContractPaymentStatus.APROBADA]: {
    label: "Aprobada (sin anticipo)",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30",
    icon: <ShieldCheck className="h-3.5 w-3.5" />,
  },
};

const SIGNATORY_STATUS_CONFIG: Record<LicenseSignatoryStatus, { label: string; className: string; icon: React.ReactNode }> = {
  [LicenseSignatoryStatus.PENDING]: {
    label: "Pendiente de firma",
    className: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/30",
    icon: <FileClock className="h-3.5 w-3.5" />,
  },
  [LicenseSignatoryStatus.SIGNED]: {
    label: "Firmado",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  [LicenseSignatoryStatus.REJECTED]: {
    label: "Rechazado",
    className: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/30",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

export function LicenseContractPaymentStatusBadge({ status }: { status: LicenseContractPaymentStatus }) {
  const config = PAYMENT_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

export function LicenseSignatoryStatusBadge({ status }: { status: LicenseSignatoryStatus }) {
  const config = SIGNATORY_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-xs font-semibold ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
}
