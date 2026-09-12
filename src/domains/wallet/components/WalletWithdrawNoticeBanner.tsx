import { CalendarClock } from "lucide-react";

export function WalletWithdrawNoticeBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-foreground">
      <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
      <p className="text-muted-foreground">
        
        <strong className="text-foreground">tu saldo disponible se paga automáticamente cada lunes</strong> a la
        cuenta bancaria registrada. No necesitas hacer ninguna solicitud; pueden descontarse los costos bancarios
        aplicables.
      </p>
    </div>
  );
}
