'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { CreditCard, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { getPaymentSource, deletePaymentSource } from '../actions/account.actions';
import { AddCardDialog } from './AddCardDialog';
import { Button } from '@/src/shared/components/UI/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/shared/components/UI/alert-dialog';
import { cn } from '@/src/shared/libs/cn';

type PaymentSourceData = { id: string; brand?: string; last4?: string };

const BRAND_COLORS: Record<string, string> = {
  visa: 'from-blue-600 to-blue-800',
  mastercard: 'from-red-500 to-orange-500',
  amex: 'from-green-600 to-teal-700',
  default: 'from-violet-600 to-purple-800',
};

function brandGradient(brand?: string) {
  const key = (brand ?? '').toLowerCase();
  return BRAND_COLORS[key] ?? BRAND_COLORS.default;
}

function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-40 rounded-2xl bg-muted" />
    </div>
  );
}

export function PaymentMethodSection() {
  const [source, setSource] = useState<PaymentSourceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDeleting, startDelete] = useTransition();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPaymentSource();
      setSource(data);
    } catch {
      toast.error('No se pudo cargar el método de pago');
      setSource(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleDelete(id: string) {
    startDelete(async () => {
      try {
        await deletePaymentSource(id);
        toast.success('Tarjeta eliminada');
        setSource(null);
      } catch (err: any) {
        toast.error(err?.message ?? 'No se pudo eliminar la tarjeta');
      }
    });
  }

  if (loading) return <CardSkeleton />;

  return (
    <>
      {source ? (
        <div className="space-y-4">
          {/* Card visual */}
          <div
            className={cn(
              'relative rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg overflow-hidden',
              brandGradient(source.brand),
            )}
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -right-4 h-40 w-40 rounded-full bg-white/5" />

            <div className="relative">
              <div className="flex items-start justify-between mb-8">
                <CreditCard className="h-8 w-8 opacity-80" />
                {source.brand && (
                  <span className="text-sm font-semibold uppercase tracking-widest opacity-90">
                    {source.brand}
                  </span>
                )}
              </div>
              <p className="font-mono text-xl tracking-widest mb-1">
                **** **** **** {source.last4 ?? '????'}
              </p>
              <p className="text-xs opacity-70 mt-2">Tarjeta para cobro automático</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setDialogOpen(true)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Cambiar tarjeta
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isDeleting}>
                  <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar tarjeta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Se desactivará el cobro automático. Tu plan actual seguirá activo hasta su
                    fecha de vencimiento.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={() => handleDelete(source.id)}
                  >
                    Sí, eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <CreditCard className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">Sin método de pago</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Agrega una tarjeta para habilitar el cobro automático al renovar tu plan.
            </p>
          </div>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar tarjeta
          </Button>
        </div>
      )}

      <AddCardDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={load}
      />
    </>
  );
}
