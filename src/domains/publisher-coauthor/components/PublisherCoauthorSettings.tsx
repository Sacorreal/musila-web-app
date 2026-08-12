'use client';

import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, PenLine, Users } from 'lucide-react';

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
import { COAUTHOR_ROLE_LABELS, CoauthorRole } from '@/src/domains/splits/types/splits.types';

import {
  usePublisherCoauthorPolicy,
  useUpdateRosterCoauthorDefaults,
} from '../publisher-coauthor.hooks';
import {
  rosterCoauthorDefaultsFormSchema,
  type RosterCoauthorDefaultsFormValues,
} from '../publisher-coauthor.schema';

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

/**
 * Configuración de la coautoría por defecto de una publisher: por cada miembro
 * del roster, si la editorial se inyecta como coautora en toda canción que ese
 * usuario publique, con qué rol y qué porcentaje. La autorización la resuelve el
 * backend (motor RBAC); este componente solo edita la configuración.
 */
export function PublisherCoauthorSettings({ organizationId }: { organizationId: string }) {
  const { data: policy, isLoading } = usePublisherCoauthorPolicy(organizationId);
  const updateRoster = useUpdateRosterCoauthorDefaults(organizationId);

  const { control, register, handleSubmit, reset, watch, formState } =
    useForm<RosterCoauthorDefaultsFormValues>({
      resolver: zodResolver(rosterCoauthorDefaultsFormSchema),
      defaultValues: { items: [] },
    });
  const { fields } = useFieldArray({ control, name: 'items' });

  useEffect(() => {
    if (policy) {
      reset({
        items: policy.roster.map((m) => ({
          userId: m.userId,
          enabled: m.enabled,
          role: m.role,
          percentage: m.percentage,
        })),
      });
    }
  }, [policy, reset]);

  const items = watch('items');

  const onSubmit = (values: RosterCoauthorDefaultsFormValues) => {
    updateRoster.mutate(values.items);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenLine className="h-5 w-5 text-primary" />
          Coautoría por defecto
        </CardTitle>
        <CardDescription>
          Al activarla para un autor de tu roster, tu editorial queda automáticamente como coautora
          —con el rol y porcentaje que definas— en toda canción que ese autor publique. Los demás
          coautores repartirán el porcentaje restante.
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
                        <Controller
                          control={control}
                          name={`items.${index}.role`}
                          render={({ field: f }) => (
                            <select
                              {...f}
                              disabled={!enabled}
                              aria-label={`Rol de la publisher para ${member?.name}`}
                              className="h-10 w-40 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {Object.values(CoauthorRole).map((role) => (
                                <option key={role} value={role}>
                                  {COAUTHOR_ROLE_LABELS[role]}
                                </option>
                              ))}
                            </select>
                          )}
                        />

                        <div className="flex items-center gap-1.5">
                          <Input
                            type="number"
                            step="0.01"
                            min={0}
                            max={100}
                            disabled={!enabled}
                            className="w-20 text-right"
                            aria-label={`Porcentaje de la publisher para ${member?.name}`}
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
                              aria-label={`Activar coautoría por defecto para ${member?.name}`}
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
                Revisa la configuración: para activar la coautoría el porcentaje debe ser mayor a 0.
              </p>
            )}

            {fields.length > 0 && (
              <div className="flex justify-end">
                <Button type="submit" disabled={updateRoster.isPending || !formState.isDirty}>
                  {updateRoster.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
