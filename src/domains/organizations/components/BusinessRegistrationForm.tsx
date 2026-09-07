'use client';

import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Building2 } from 'lucide-react';
import { Input } from '@/src/shared/components/UI/input';
import { Label } from '@/src/shared/components/UI/label';
import { Button } from '@/src/shared/components/UI/button';
import { Field, FieldError } from '@/src/shared/components/UI/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/UI/select';
import { CountryCodeSelect } from '@/src/domains/auth/components/CountryCodeSelect';
import { getCountriesWithColombiaFirst } from '@/src/domains/auth/utils/get-countries';
import {
  allowedDocumentTypesFor,
  BUSINESS_DOCUMENT_TYPE_LABELS,
} from '../constants/business-document-catalog';
import {
  businessRegistrationSchema,
  type BusinessRegistrationFormValues,
} from '../schema/business-registration.schema';
import { ORGANIZATION_TYPE_LABELS, OrganizationType } from '../types/business-registration.types';
import { useBusinessPlans, useRegisterBusiness } from '../hooks/business-registration.hooks';

export function BusinessRegistrationForm() {
  const router = useRouter();
  const countries = useMemo(() => getCountriesWithColombiaFirst(), []);
  const { data: plans, isLoading: isLoadingPlans } = useBusinessPlans();
  const { mutate: registerBusiness, isPending } = useRegisterBusiness();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BusinessRegistrationFormValues>({
    resolver: zodResolver(businessRegistrationSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      repeatPassword: '',
      legalName: '',
      organizationType: OrganizationType.LABEL,
      legalCountry: 'CO',
      documentType: undefined,
      documentNumber: '',
      phoneCountryCode: '+57',
      phoneNumber: '',
      planKey: '',
    },
  });

  const legalCountry = watch('legalCountry');
  const availableDocumentTypes = useMemo(
    () => allowedDocumentTypesFor(legalCountry),
    [legalCountry],
  );

  // Si cambia el país, el tipo de documento previamente elegido puede dejar de ser válido.
  useEffect(() => {
    setValue('documentType', availableDocumentTypes[0], { shouldValidate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legalCountry]);

  const onSubmit = (values: BusinessRegistrationFormValues) => {
    const { repeatPassword: _repeatPassword, ...rest } = values;
    registerBusiness(rest, {
      onSuccess: () => router.push('/business-registration/status'),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <Building2 size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">Musila Business</h3>
          <p className="text-sm text-muted-foreground">
            Registra tu empresa para crear tu roster y tu equipo en Musila.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field data-invalid={!!errors.email}>
          <Label>Email empresarial</Label>
          <Input type="email" {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && <FieldError errors={[errors.email]} />}
        </Field>

        <Field data-invalid={!!errors.legalName}>
          <Label>Nombre legal de la empresa</Label>
          <Input {...register('legalName')} aria-invalid={!!errors.legalName} />
          {errors.legalName && <FieldError errors={[errors.legalName]} />}
        </Field>

        <Field data-invalid={!!errors.password}>
          <Label>Contraseña</Label>
          <Input type="password" {...register('password')} aria-invalid={!!errors.password} />
          {errors.password && <FieldError errors={[errors.password]} />}
        </Field>

        <Field data-invalid={!!errors.repeatPassword}>
          <Label>Repetir contraseña</Label>
          <Input type="password" {...register('repeatPassword')} aria-invalid={!!errors.repeatPassword} />
          {errors.repeatPassword && <FieldError errors={[errors.repeatPassword]} />}
        </Field>

        <Field data-invalid={!!errors.organizationType}>
          <Label>Tipo de organización</Label>
          <Controller
            name="organizationType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(OrganizationType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {ORGANIZATION_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.organizationType && <FieldError errors={[errors.organizationType]} />}
        </Field>

        <Field data-invalid={!!errors.planKey}>
          <Label>Plan</Label>
          <Controller
            name="planKey"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingPlans}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingPlans ? 'Cargando planes...' : 'Selecciona un plan'} />
                </SelectTrigger>
                <SelectContent>
                  {(plans ?? []).map((plan) => (
                    <SelectItem key={plan.key} value={plan.key}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.planKey && <FieldError errors={[errors.planKey]} />}
        </Field>

        <Field data-invalid={!!errors.legalCountry}>
          <Label>País de constitución</Label>
          <Controller
            name="legalCountry"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un país" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(([isoCode, country]) => (
                    <SelectItem key={isoCode} value={isoCode}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.legalCountry && <FieldError errors={[errors.legalCountry]} />}
        </Field>

        <Field data-invalid={!!errors.documentType}>
          <Label>Tipo de documento de la empresa</Label>
          <Controller
            name="documentType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  {availableDocumentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {BUSINESS_DOCUMENT_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.documentType && <FieldError errors={[errors.documentType]} />}
        </Field>

        <Field data-invalid={!!errors.documentNumber}>
          <Label>Número de documento</Label>
          <Input
            {...register('documentNumber')}
            placeholder="ej. 901091582-2"
            aria-invalid={!!errors.documentNumber}
          />
          {errors.documentNumber && <FieldError errors={[errors.documentNumber]} />}
        </Field>

        <Field data-invalid={!!errors.phoneCountryCode}>
          <Label>Indicativo de país</Label>
          <Controller
            name="phoneCountryCode"
            control={control}
            render={({ field }) => (
              <CountryCodeSelect value={field.value} onValueChange={field.onChange} />
            )}
          />
          {errors.phoneCountryCode && <FieldError errors={[errors.phoneCountryCode]} />}
        </Field>

        <Field data-invalid={!!errors.phoneNumber}>
          <Label>Número de teléfono</Label>
          <Input {...register('phoneNumber')} aria-invalid={!!errors.phoneNumber} />
          {errors.phoneNumber && <FieldError errors={[errors.phoneNumber]} />}
        </Field>
      </div>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? 'Enviando solicitud...' : 'Registrar mi empresa'}
      </Button>
    </form>
  );
}
