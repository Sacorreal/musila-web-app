'use client';

import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { getBillingInfo, updateBillingInfo } from '../../actions/account.actions';
import { Button } from '@/src/shared/components/UI/button';
import { Input } from '@/src/shared/components/UI/input';
import { Label } from '@/src/shared/components/UI/label';
import { CreditCard, Loader2 } from 'lucide-react';

const billingSchema = z.object({
  fiscalName:    z.string().max(200).optional(),
  taxId:         z.string().max(30).regex(/^(\d{7,12}(-\d)?)?$/, 'Formato de NIT inválido (ej. 900123456-7)').optional(),
  fiscalAddress: z.string().max(300).optional(),
});

type BillingForm = z.infer<typeof billingSchema>;

export function BillingTab() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<BillingForm>({ resolver: zodResolver(billingSchema) });

  useEffect(() => {
    getBillingInfo()
      .then((data) => form.reset({
        fiscalName:    data.fiscalName    ?? '',
        taxId:         data.taxId         ?? '',
        fiscalAddress: data.fiscalAddress ?? '',
      }))
      .catch(() => toast.error('No se pudo cargar los datos de facturación'));
  }, []);

  function onSave(data: BillingForm) {
    startTransition(async () => {
      try {
        await updateBillingInfo(data);
        toast.success('Datos de facturación actualizados');
      } catch (e: any) { toast.error(e.message); }
    });
  }

  return (
    <div className="space-y-6">
      {/* Datos fiscales */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-base font-semibold mb-1">Datos fiscales</h2>
        <p className="text-sm text-muted-foreground mb-5">Opcionales. Se incluyen en los comprobantes de pago PDF.</p>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fiscalName">Razón social / Nombre completo</Label>
            <Input id="fiscalName" {...form.register('fiscalName')} placeholder="Ej. Juan García o Empresa SAS" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="taxId">NIT / RUT</Label>
            <Input id="taxId" {...form.register('taxId')} placeholder="Ej. 900123456-7" />
            {form.formState.errors.taxId && <p className="text-xs text-destructive">{form.formState.errors.taxId.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fiscalAddress">Dirección fiscal</Label>
            <Input id="fiscalAddress" {...form.register('fiscalAddress')} placeholder="Calle, ciudad, país" />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar datos
          </Button>
        </form>
      </section>

      {/* Métodos de pago — placeholder */}
      <section className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-3 mb-3">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-base font-semibold">Métodos de pago</h2>
        </div>
        <div className="rounded-lg bg-muted/50 border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            La gestión de métodos de pago estará disponible próximamente.
          </p>
        </div>
      </section>
    </div>
  );
}
