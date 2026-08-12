'use client';

import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Percent, Users } from 'lucide-react';

import { Button } from '@shared/components/UI/button';
import { Input } from '@shared/components/UI/input';
import { Switch } from '@shared/components/UI/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/components/UI/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/UI/card';

import { usePublisherSharePolicy, useUpdatePublisherShares } from '../publisher-share.hooks';
import {
  publisherSharesFormSchema,
  type PublisherSharesFormValues,
} from '../publisher-share.schema';

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

/**
 * Configuración del Publisher's Share de una publisher: por cada miembro del
 * roster, el porcentaje que la editorial declara en toda canción que ese autor
 * publique. Es metadata informativa del expediente del track (para notificar a
 * entidades externas): no consume porcentaje de los coautores ni interviene en
 * ningún cálculo. La autorización la resuelve el backend (motor RBAC).
 */
export function PublisherShareSettings({ organizationId }: { organizationId: string }) {
  const { data: policy, isLoading } = usePublisherSharePolicy(organizationId);
  const updateShares = useUpdatePublisherShares(organizationId);

  const { control, register, handleSubmit, reset, watch, formState } =
    useForm<PublisherSharesFormValues>({
      resolver: zodResolver(publisherSharesFormSchema),
      defaultValues: { items: [] },
    });
  const { fields } = useFieldArray({ control, name: 'items' });

  useEffect(() => {
    if (policy) {
      reset({
        items: policy.roster.map((m) => ({
          userId: m.userId,
          enabled: m.enabled,
          percentage: m.percentage,
        })),
      });
    }
  }, [policy, reset]);

  const items = watch('items');

  const onSubmit = (values: PublisherSharesFormValues) => {
    updateShares.mutate(values.items);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-primary" />
          Publisher&apos;s Share
        </CardTitle>
        <CardDescription>
          Al activarlo para un autor de tu roster, tu editorial declara un porcentaje en toda canción
          que ese autor publique. Es un dato informativo que viaja en el expediente del track (para
          notificar a entidades externas); no afecta el reparto entre coautores.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Cargando configuración…
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="h-4 w-4" />
              Configuración por miembro del roster
            </div>

            {fields.length === 0 ? (
              <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No hay miembros activos en tu roster todavía.
              </p>
            ) : (
              <ul className="divide-y rounded-lg border">
                {fields.map((field, index) => {
                  const member = policy?.roster[index];
                  const enabled = items?.[index]?.enabled ?? false;
                  return (
                    <li key={field.id} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member?.avatarUrl} alt={member?.name} />
                          <AvatarFallback>{initials(member?.name ?? '?')}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{member?.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{member?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="number"
                            step="0.01"
                            min={0}
                            max={100}
                            disabled={!enabled}
                            className="w-20 text-right"
                            aria-label={`Publisher's Share para ${member?.name}`}
                            {...register(`items.${index}.percentage`, { valueAsNumber: true })}
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>

                        <Controller
                          control={control}
                          name={`items.${index}.enabled`}
                          render={({ field: f }) => (
                            <Switch
                              checked={f.value}
                              onCheckedChange={f.onChange}
                              aria-label={`Activar Publisher's Share para ${member?.name}`}
                            />
                          )}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {formState.errors.items && (
              <p className="text-xs text-destructive">
                Revisa la configuración: para activar el Publisher&apos;s Share el porcentaje debe ser mayor a 0.
              </p>
            )}

            {fields.length > 0 && (
              <div className="flex justify-end">
                <Button type="submit" disabled={updateShares.isPending || !formState.isDirty}>
                  {updateShares.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar configuración
                </Button>
              </div>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
}
