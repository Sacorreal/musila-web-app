'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { CreditCard, Loader2, Lock } from 'lucide-react';
import { addPaymentSource } from '../actions/account.actions';
import { Button } from '@/src/shared/components/UI/button';
import { Input } from '@/src/shared/components/UI/input';
import { Label } from '@/src/shared/components/UI/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/shared/components/UI/dialog';

const cardSchema = z.object({
  number: z
    .string()
    .min(12, 'Mínimo 12 dígitos')
    .max(19, 'Máximo 19 dígitos')
    .regex(/^\d+$/, 'Solo dígitos'),
  expMonth: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, 'Mes inválido (01-12)'),
  expYear: z
    .string()
    .regex(/^\d{2}$/, 'Año inválido (ej. 27)'),
  cvc: z
    .string()
    .min(3, 'Mínimo 3 dígitos')
    .max(4, 'Máximo 4 dígitos')
    .regex(/^\d+$/, 'Solo dígitos'),
  cardHolder: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  customerEmail: z.string().email('Correo inválido'),
});

type CardForm = z.infer<typeof cardSchema>;

interface AddCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddCardDialog({ open, onOpenChange, onSuccess }: AddCardDialogProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CardForm>({
    resolver: zodResolver(cardSchema),
    defaultValues: { number: '', expMonth: '', expYear: '', cvc: '', cardHolder: '', customerEmail: '' },
  });

  function onSubmit(data: CardForm) {
    startTransition(async () => {
      try {
        await addPaymentSource(data);
        toast.success('Tarjeta guardada correctamente');
        form.reset();
        onOpenChange(false);
        onSuccess();
      } catch (err: any) {
        toast.error(err?.message ?? 'No se pudo guardar la tarjeta');
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Agregar tarjeta
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1.5 text-xs">
            <Lock className="h-3.5 w-3.5" />
            Tus datos son tokenizados de forma segura por Wompi. Nunca los almacenamos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Número de tarjeta */}
          <div className="space-y-1.5">
            <Label htmlFor="card-number">Número de tarjeta</Label>
            <Input
              id="card-number"
              inputMode="numeric"
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              {...form.register('number')}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 19);
                form.setValue('number', digits);
              }}
            />
            {form.formState.errors.number && (
              <p className="text-xs text-destructive">{form.formState.errors.number.message}</p>
            )}
          </div>

          {/* Expiración + CVV */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="exp-month">Mes</Label>
              <Input
                id="exp-month"
                inputMode="numeric"
                maxLength={2}
                placeholder="MM"
                {...form.register('expMonth')}
              />
              {form.formState.errors.expMonth && (
                <p className="text-xs text-destructive">{form.formState.errors.expMonth.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="exp-year">Año</Label>
              <Input
                id="exp-year"
                inputMode="numeric"
                maxLength={2}
                placeholder="AA"
                {...form.register('expYear')}
              />
              {form.formState.errors.expYear && (
                <p className="text-xs text-destructive">{form.formState.errors.expYear.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cvc">CVV</Label>
              <Input
                id="cvc"
                inputMode="numeric"
                maxLength={4}
                placeholder="123"
                {...form.register('cvc')}
              />
              {form.formState.errors.cvc && (
                <p className="text-xs text-destructive">{form.formState.errors.cvc.message}</p>
              )}
            </div>
          </div>

          {/* Titular */}
          <div className="space-y-1.5">
            <Label htmlFor="card-holder">Nombre del titular</Label>
            <Input
              id="card-holder"
              placeholder="Como aparece en la tarjeta"
              {...form.register('cardHolder')}
            />
            {form.formState.errors.cardHolder && (
              <p className="text-xs text-destructive">{form.formState.errors.cardHolder.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="customer-email">Correo electrónico</Label>
            <Input
              id="customer-email"
              type="email"
              placeholder="correo@ejemplo.com"
              {...form.register('customerEmail')}
            />
            {form.formState.errors.customerEmail && (
              <p className="text-xs text-destructive">{form.formState.errors.customerEmail.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar tarjeta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
