'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Building2, Loader2 } from 'lucide-react';

import { Button } from '@shared/components/UI/button';
import { Switch } from '@shared/components/UI/switch';
import { Label } from '@shared/components/UI/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/components/UI/card';

import {
  organizationSecurityPolicySchema,
  type OrganizationSecurityPolicyInput,
} from '../schema/security.schema';
import {
  useOrganizationPolicy,
  useUpdateOrganizationPolicy,
} from '../hooks/security.hooks';

interface ToggleRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ id, label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
      <div>
        <Label htmlFor={id} className="font-medium">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

/**
 * Configuración de la política de seguridad de una organización B2B (§4, §18).
 * Solo administradores con la capability adecuada pueden guardar cambios; la
 * autorización la resuelve el backend (motor RBAC), no este componente.
 */
export function OrganizationSecuritySettings({ organizationId }: { organizationId: string }) {
  const { data: policy, isLoading } = useOrganizationPolicy(organizationId);
  const update = useUpdateOrganizationPolicy(organizationId);

  const { control, handleSubmit, reset, watch, setValue, formState } =
    useForm<OrganizationSecurityPolicyInput>({
      resolver: zodResolver(organizationSecurityPolicySchema),
      defaultValues: {
        mfaRequired: false,
        passkeyRequired: false,
        totpAllowed: true,
        recoveryCodesRequired: false,
      },
    });

  useEffect(() => {
    if (policy) reset(policy);
  }, [policy, reset]);

  const passkeyRequired = watch('passkeyRequired');

  // Coherencia UX: exigir Passkey implica exigir MFA.
  useEffect(() => {
    if (passkeyRequired) setValue('mfaRequired', true);
  }, [passkeyRequired, setValue]);

  const onSubmit = async (values: OrganizationSecurityPolicyInput) => {
    try {
      await update.mutateAsync(values);
      toast.success('Política de seguridad actualizada');
    } catch (error) {
      toast.error((error as Error)?.message || 'No se pudo actualizar la política');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Política de seguridad de la organización
        </CardTitle>
        <CardDescription>
          Define los requisitos de autenticación fuerte para los miembros de esta organización.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Cargando política…
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Controller
              control={control}
              name="mfaRequired"
              render={({ field }) => (
                <ToggleRow
                  id="mfaRequired"
                  label="MFA obligatoria"
                  description="Los miembros deben tener un segundo factor para acceder al workspace."
                  checked={field.value || passkeyRequired}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="passkeyRequired"
              render={({ field }) => (
                <ToggleRow
                  id="passkeyRequired"
                  label="Passkey obligatoria"
                  description="Exige específicamente una Passkey (implica MFA obligatoria)."
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="totpAllowed"
              render={({ field }) => (
                <ToggleRow
                  id="totpAllowed"
                  label="Permitir TOTP"
                  description="Habilita apps de autenticación como método alternativo/fallback."
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="recoveryCodesRequired"
              render={({ field }) => (
                <ToggleRow
                  id="recoveryCodesRequired"
                  label="Recovery Codes obligatorios"
                  description="El onboarding exige generar códigos de recuperación."
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={update.isPending || !formState.isDirty}>
                {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar cambios
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
