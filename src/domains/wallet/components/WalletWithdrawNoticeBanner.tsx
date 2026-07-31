import { Info } from "lucide-react";

export function WalletWithdrawNoticeBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-foreground">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
      <p className="text-muted-foreground">
        Las transferencias se procesan manualmente en un plazo de hasta <strong className="text-foreground">24 horas</strong> y
        pueden descontarse los costos bancarios aplicables.
      </p>
    </div>
  );
}
