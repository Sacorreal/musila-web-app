'use client';

import React, { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/shared/components/UI/dialog';
import { Button } from '@/src/shared/components/UI/button';
import { Input } from '@/src/shared/components/UI/input';
import { Label } from '@/src/shared/components/UI/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/UI/select';
import { cn } from '@/src/shared/libs/cn';
import { getPseBanks, createPsePayment, type PseBank } from '@/src/domains/payments/pse.actions';
import { CheckIcon, ChevronDownIcon, Loader2, SearchIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { PaymentPlanType } from '../payments.types';

interface PseCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planType: PaymentPlanType;
  plan: 'pro';
  billingPeriod?: 'monthly' | 'annual';
  planName: string;
  planPrice: string;
  userEmail?: string;
}

type IdType = 'CC' | 'CE' | 'NIT' | 'TI' | 'PP';

const ID_TYPE_LABELS: Record<IdType, string> = {
  CC: 'Cédula de Ciudadanía',
  CE: 'Cédula de Extranjería',
  NIT: 'NIT',
  TI: 'Tarjeta de Identidad',
  PP: 'Pasaporte',
};

export function PseCheckoutModal({
  open,
  onOpenChange,
  planType,
  plan,
  billingPeriod = 'monthly',
  planName,
  planPrice,
  userEmail = '',
}: PseCheckoutModalProps) {
  const [banks, setBanks] = useState<PseBank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

  const [selectedBank, setSelectedBank] = useState<PseBank | null>(null);
  const [bankSearch, setBankSearch] = useState('');
  const [bankPopoverOpen, setBankPopoverOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState(userEmail);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [entityType, setEntityType] = useState<'individual' | 'association'>('individual');
  const [idType, setIdType] = useState<IdType>('CC');
  const [idNumber, setIdNumber] = useState('');

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) return;
    setLoadingBanks(true);
    getPseBanks()
      .then(setBanks)
      .catch(() => toast.error('No se pudo cargar la lista de bancos'))
      .finally(() => setLoadingBanks(false));
  }, [open]);

  useEffect(() => {
    if (bankPopoverOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setBankSearch('');
    }
  }, [bankPopoverOpen]);

  const filteredBanks = useMemo(() => {
    if (!bankSearch.trim()) return banks;
    const q = bankSearch.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    return banks.filter((b) =>
      b.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(q),
    );
  }, [banks, bankSearch]);

  const isValid =
    selectedBank && email && firstName && lastName && idNumber && idType && entityType;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    startTransition(async () => {
      try {
        const { redirectUrl, externalReference } = await createPsePayment({
          planType,
          plan,
          billingPeriod,
          email,
          firstName,
          lastName,
          entityType,
          identificationType: idType,
          identificationNumber: idNumber,
          financialInstitution: selectedBank!.id,
        });
        sessionStorage.setItem('mp_pending_ref', externalReference);
        sessionStorage.setItem('mp_pending_role', planType);
        window.location.href = redirectUrl;
      } catch (err) {
        toast.error('No se pudo procesar el pago PSE', {
          description: err instanceof Error ? err.message : 'Intenta nuevamente',
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 bg-white dark:bg-slate-900 border-none rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-8 pt-8 pb-5 border-b border-slate-100 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              Pago con PSE
            </DialogTitle>
          </DialogHeader>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 px-4 py-3">
            <span className="text-sm text-slate-600 dark:text-slate-300">{planName}</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">{planPrice}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
          {/* Selector de banco */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Entidad bancaria <span className="text-red-500">*</span>
            </Label>
            <PopoverPrimitive.Root open={bankPopoverOpen} onOpenChange={setBankPopoverOpen}>
              <PopoverPrimitive.Trigger asChild>
                <button
                  type="button"
                  disabled={loadingBanks}
                  className={cn(
                    'flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors outline-none',
                    'hover:bg-slate-50 dark:hover:bg-slate-800/50',
                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    !selectedBank && 'text-muted-foreground',
                  )}
                >
                  {loadingBanks ? (
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Cargando bancos…
                    </span>
                  ) : (
                    <span className="truncate">{selectedBank ? selectedBank.name : 'Selecciona tu banco'}</span>
                  )}
                  <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
                </button>
              </PopoverPrimitive.Trigger>

              <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  className="z-50 w-[var(--radix-popover-trigger-width)] min-w-[280px] rounded-xl border border-border bg-popover shadow-lg"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  {/* Buscador */}
                  <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                    <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <input
                      ref={searchRef}
                      value={bankSearch}
                      onChange={(e) => setBankSearch(e.target.value)}
                      placeholder="Buscar banco…"
                      className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Lista scrollable */}
                  <div className="max-h-52 overflow-y-auto overscroll-contain p-1">
                    {filteredBanks.length === 0 ? (
                      <p className="py-6 text-center text-sm text-muted-foreground">
                        No se encontró ningún banco
                      </p>
                    ) : (
                      filteredBanks.map((bank) => (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => {
                            setSelectedBank(bank);
                            setBankPopoverOpen(false);
                          }}
                          className={cn(
                            'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
                            'hover:bg-accent hover:text-accent-foreground',
                            selectedBank?.id === bank.id && 'bg-accent text-accent-foreground',
                          )}
                        >
                          <span>{bank.name}</span>
                          {selectedBank?.id === bank.id && (
                            <CheckIcon className="h-4 w-4 shrink-0 text-primary" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>
          </div>

          {/* Tipo de persona */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Tipo de persona <span className="text-red-500">*</span>
            </Label>
            <Select value={entityType} onValueChange={(v) => setEntityType(v as 'individual' | 'association')}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Persona natural</SelectItem>
                <SelectItem value="association">Persona jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nombre y apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Juan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Apellido <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Pérez"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Tipo de documento + número */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Tipo de documento <span className="text-red-500">*</span>
              </Label>
              <Select value={idType} onValueChange={(v) => setIdType(v as IdType)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(ID_TYPE_LABELS) as [IdType, string][]).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Número <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="12345678"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Correo electrónico <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Serás redirigido al portal de tu banco para completar el pago de forma segura.
          </p>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              className="h-10 px-5 rounded-xl"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25"
              disabled={!isValid || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirigiendo…
                </>
              ) : (
                'Ir al banco'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
