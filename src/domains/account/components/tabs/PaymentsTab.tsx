'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getPaymentHistory } from '../../actions/account.actions';
import { Button } from '@/src/shared/components/UI/button';
import { Badge } from '@/src/shared/components/UI/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/shared/components/UI/dialog';
import { DownloadButton } from '@/src/shared/components/UI/DownloadButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/shared/libs/cn';

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  approved:  { label: 'Aprobado',  variant: 'default' },
  rejected:  { label: 'Rechazado', variant: 'destructive' },
  cancelled: { label: 'Cancelado', variant: 'secondary' },
  pending:   { label: 'Pendiente', variant: 'outline' },
};

function fmt(date: string) {
  return new Date(date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtMoney(n: number | undefined) {
  if (!n) return '—';
  return `$${Number(n).toLocaleString('es-CO')} COP`;
}

export function PaymentsTab() {
  const [data, setData]       = useState<any[]>([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  const LIMIT = 8;
  const totalPages = Math.ceil(total / LIMIT);

  async function load(p: number) {
    setLoading(true);
    try {
      const res = await getPaymentHistory(p, LIMIT);
      setData(res.data);
      setTotal(res.total);
      setPage(p);
    } catch { toast.error('No se pudo cargar el historial'); }
    finally  { setLoading(false); }
  }

  useEffect(() => { load(1); }, []);

  function openDetail(payment: any) {
    setSelected(payment);
  }

  if (loading && data.length === 0) return (
    <div className="animate-pulse space-y-3">
      {[1,2,3].map(i => <div key={i} className="h-14 rounded-lg bg-muted"/>)}
    </div>
  );

  return (
    <div className="space-y-4">
      <section className="rounded-xl border bg-card overflow-hidden">
        {data.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No hay pagos registrados aún.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fecha</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Monto</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Plan</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((p: any) => {
                const s = STATUS_LABELS[p.status] ?? { label: p.status, variant: 'outline' as const };
                return (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">{fmt(p.createdAt)}</td>
                    <td className="px-4 py-3 font-medium">{fmtMoney(p.amount)}</td>
                    <td className="px-4 py-3 capitalize">{p.planType} {p.roleType}</td>
                    <td className="px-4 py-3"><Badge variant={s.variant}>{s.label}</Badge></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openDetail(p)}>Ver</Button>
                        {p.status === 'approved' && (
                          <DownloadButton
                            fetchUrl={`/api/payments/${p.id}/receipt`}
                            filename={`comprobante-musila-${p.id.substring(0, 8)}.pdf`}
                            label=""
                            loadingLabel=""
                            size="sm"
                            variant="ghost"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Página {page} de {totalPages}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => load(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => load(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal de detalle */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Detalle del pago</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              {[
                ['ID del pago', selected.id?.substring(0, 8).toUpperCase()],
                ['Fecha', fmt(selected.createdAt)],
                ['Monto', fmtMoney(selected.amount)],
                ['Plan', `${selected.roleType} ${selected.planType}`],
                ['Estado', STATUS_LABELS[selected.status]?.label ?? selected.status],
                ['ID de transacción', selected.wompiTransactionId ?? '—'],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between gap-4">
                  <span className="text-muted-foreground shrink-0">{l}</span>
                  <span className="font-medium text-right truncate">{v}</span>
                </div>
              ))}
              {selected.status === 'approved' && (
                <DownloadButton
                  fetchUrl={`/api/payments/${selected.id}/receipt`}
                  filename={`comprobante-musila-${selected.id.substring(0, 8)}.pdf`}
                  label="Descargar comprobante PDF"
                  className="w-full mt-2"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
