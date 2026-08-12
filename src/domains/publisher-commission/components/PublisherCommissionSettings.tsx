'use client';

import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Percent, Users } from 'lucide-react';

import { Button } from '@shared/components/UI/button';
import { Input } from '@shared/components/UI/input';
import { Switch } from '@shared/components/UI/switch';
import { Label } from '@shared/components/UI/label';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/components/UI/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/UI/card';

import {
  usePublisherCommissionPolicy,
  useSetPublisherCommissionEnabled,
  useUpdateRosterCommissions,
} from '../publisher-commission.hooks';
import {
  rosterCommissionsFormSchema,
  type RosterCommissionsFormValues,
} from '../publisher-commission.schema';

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

/**
 * Configuración de la comisión por anticipo de licencia de una publisher:
 * toggle global + porcentaje por miembro del roster. La autorización la resuelve
 * el backend (motor RBAC); este componente solo edita la configuración.
 */
export function PublisherCommissionSettings({ organizationId }: { organizationId: string }) {
  const { data: policy, isLoading } = usePublisherCommissionPolicy(organizationId);
  const setEnabled = useSetPublisherCommissionEnabled(organizationId);
  const updateRoster = useUpdateRosterCommissions(organizationId);

  const { control, register, handleSubmit, reset, formState } = useForm<RosterCommissionsFormValues>({
    resolver: zodResolver(rosterCommissionsFormSchema),
    defaultValues: { items: [] },
  });
  const { fields } = useFieldArray({ control, name: 'items' });

  useEffect(() => {
    if (policy) {
      reset({ items: policy.roster.map((m) => ({ userId: m.userId, percentage: m.percentage })) });
    }
  }, [policy, reset]);

  const commissionEnabled = policy?.commissionEnabled ?? false;

  const onSubmit = (values: RosterCommissionsFormValues) => {
    updateRoster.mutate(values.items);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-primary" />
          Comisión por anticipo de licencia
        </CardTitle>
        <CardDescription>
          Al activarla, tu editorial cobra un porcentaje sobre cada licencia pagada de los autores de
          tu roster. El valor se abona en la wallet de la organización y se descuenta del pago al autor.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Cargando configuración…
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
              <div>
                <Label htmlFor="commissionEnabled" className="font-medium">
                  Activar comisión por anticipo de licencia
                </Label>
                <p className="text-xs text-muted-foreground">
                  Habilita el cobro de comisión y la wallet de la organización.
                </p>
              </div>
              <Switch
                id="commissionEnabled"
                checked={commissionEnabled}
                disabled={setEnabled.isPending}
                onCheckedChange={(value) => setEnabled.mutate(value)}
              />
            </div>

            {commissionEnabled && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Porcentaje por miembro del roster
                </div>

                {fields.length === 0 ? (
                  <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No hay miembros activos en tu roster todavía.
                  </p>
                ) : (
                  <ul className="divide-y rounded-lg border">
                    {fields.map((field, index) => {
                      const member = policy?.roster[index];
                      return (
                        <li key={field.id} className="flex items-center gap-3 p-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={member?.avatarUrl} alt={member?.name} />
                            <AvatarFallback>{initials(member?.name ?? '?')}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{member?.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{member?.email}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Input
                              type="number"
                              step="0.01"
                              min={0}
                              max={100}
                              className="w-24 text-right"
                              aria-label={`Porcentaje de comisión de ${member?.name}`}
                              {...register(`items.${index}.percentage`, { valueAsNumber: true })}
                            />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {formState.errors.items && (
                  <p className="text-xs text-destructive">Revisa los porcentajes: deben estar entre 0 y 100.</p>
                )}

                {fields.length > 0 && (
                  <div className="flex justify-end">
                    <Button type="submit" disabled={updateRoster.isPending || !formState.isDirty}>
                      {updateRoster.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Guardar porcentajes
                    </Button>
                  </div>
                )}
              </form>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
