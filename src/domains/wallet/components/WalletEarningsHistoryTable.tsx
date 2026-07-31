"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, User, Users } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { useWalletEarnings } from "../hooks/wallet.hooks";
import { WalletEarningRole } from "../types/wallet.types";
import { formatCOP } from "../utils/format-currency";

const LIMIT = 8;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

export function WalletEarningsHistoryTable() {
  const [offset, setOffset] = useState(0);
  const { data, isLoading } = useWalletEarnings(LIMIT, offset);

  const total = data?.total ?? 0;
  const page = Math.floor(offset / LIMIT) + 1;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-lg bg-muted/40" />
        ))}
      </div>
    );
  }

  const earnings = data?.data ?? [];

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-xl border bg-card">
        {earnings.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Aún no tienes ganancias acreditadas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Track</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Origen</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {earnings.map((earning) => (
                  <tr key={earning.id} className="transition-colors hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3">{formatDate(earning.occurredAt)}</td>
                    <td className="max-w-[220px] truncate px-4 py-3 font-medium">{earning.trackTitle}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        {earning.role === WalletEarningRole.OWN ? (
                          <User className="h-3.5 w-3.5" />
                        ) : (
                          <Users className="h-3.5 w-3.5" />
                        )}
                        {earning.role === WalletEarningRole.OWN ? "Propio" : "Coautoría"} ({earning.percentage}%)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      +{formatCOP(earning.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - LIMIT))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setOffset(offset + LIMIT)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
