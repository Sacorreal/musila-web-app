import React from "react";
import { RequestStatus } from "../../types/request.types";
import { STATUS_CONFIG } from "../../constants/request-status.config";

interface Props {
  status: RequestStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: Props) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG[RequestStatus.PENDIENTE];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${config.color} ${className}`}>
      <Icon size={11} />
      {config.label}
    </div>
  );
}
