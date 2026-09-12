'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Checkbox } from '@/src/shared/components/UI/checkbox'
import { Field, FieldError, FieldLabel } from '@/src/shared/components/UI/field'
import { DialogFooter } from '@/src/shared/components/UI/dialog'
import { CollectiveManagementSocietyCombobox } from './CollectiveManagementSocietyCombobox'
import { SocietyTerritorySelector } from './SocietyTerritorySelector'
import { createSocietyAffiliationSchema, type CreateSocietyAffiliationFormValues } from '../society-affiliations.schema'
import { useCreateSocietyAffiliation } from '../society-affiliations.hooks'
import { RIGHTS_TYPE_LABELS } from '../society-affiliations.labels'
import { SocietyAffiliationRightsType, SocietyAffiliationTerritoryMode } from '../society-affiliations.types'

interface Props {
  onSuccess: () => void
  onCancel: () => void
  cancelLabel?: string
  submitLabel?: string
}

const ALL_RIGHTS_TYPES = Object.values(SocietyAffiliationRightsType)

/**
 * Campos del formulario de afiliación, sin el `Dialog` que lo envuelve —
 * reutilizado tanto por `SocietyAffiliationForm` (tab "Derechos y
 * Sociedades") como por `SocietyAffiliationOnboardingPrompt` (aviso antes de
 * publicar un track), que necesitan copy y acciones de cierre distintas.
 */
export function SocietyAffiliationFormFields({ onSuccess, onCancel, cancelLabel = 'Cancelar', submitLabel = 'Guardar afiliación' }: Props) {
  const { mutateAsync: createAffiliation, isPending } = useCreateSocietyAffiliation()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateSocietyAffiliationFormValues>({
    resolver: zodResolver(createSocietyAffiliationSchema),
    defaultValues: {
      collectiveManagementSocietyId: '',
      rightsTypes: [],
      territoryMode: SocietyAffiliationTerritoryMode.SPECIFIC_COUNTRIES,
      territoryCountries: [],
      membershipNumber: '',
      ipiNameNumber: '',
    },
  })

  const onSubmit = async (values: CreateSocietyAffiliationFormValues) => {
    try {
      // Cada tipo de derecho es una afiliación independiente en el backend
      // (una fila por autor+sociedad+derecho+territorio) — "todos" crea una por cada uno.
      for (const rightsType of values.rightsTypes) {
        await createAffiliation({
          collectiveManagementSocietyId: values.collectiveManagementSocietyId,
          rightsType,
          territoryMode: values.territoryMode,
          territoryCountries: values.territoryCountries,
          membershipNumber: values.membershipNumber || undefined,
          ipiNameNumber: values.ipiNameNumber,
        })
      }
      onSuccess()
    } catch {
      // el hook ya notifica el error; dejamos el diálogo abierto para reintentar
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <Controller
        name="collectiveManagementSocietyId"
        control={control}
        render={({ field }) => (
          <Field data-invalid={!!errors.collectiveManagementSocietyId}>
            <FieldLabel>Sociedad de Gestión Colectiva</FieldLabel>
            <CollectiveManagementSocietyCombobox
              value={field.value}
              onChange={field.onChange}
              aria-invalid={!!errors.collectiveManagementSocietyId}
            />
            {errors.collectiveManagementSocietyId && <FieldError errors={[errors.collectiveManagementSocietyId]} />}
          </Field>
        )}
      />

      <Controller
        name="rightsTypes"
        control={control}
        render={({ field }) => {
          const selected = field.value ?? []
          const allSelected = selected.length === ALL_RIGHTS_TYPES.length

          const toggleAll = () => field.onChange(allSelected ? [] : ALL_RIGHTS_TYPES)
          const toggleOne = (type: SocietyAffiliationRightsType) =>
            field.onChange(selected.includes(type) ? selected.filter((t) => t !== type) : [...selected, type])

          return (
            <Field data-invalid={!!errors.rightsTypes}>
              <FieldLabel>Tipo de derecho</FieldLabel>
              <div className="space-y-2 rounded-md border border-input p-3">
                <Field orientation="horizontal">
                  <Checkbox id="rightsType-all" checked={allSelected} onCheckedChange={toggleAll} />
                  <FieldLabel htmlFor="rightsType-all" className="font-medium">
                    Seleccionar todos
                  </FieldLabel>
                </Field>
                <div className="h-px bg-border" />
                {ALL_RIGHTS_TYPES.map((type) => (
                  <Field orientation="horizontal" key={type}>
                    <Checkbox
                      id={`rightsType-${type}`}
                      checked={selected.includes(type)}
                      onCheckedChange={() => toggleOne(type)}
                    />
                    <FieldLabel htmlFor={`rightsType-${type}`} className="font-normal">
                      {RIGHTS_TYPE_LABELS[type]}
                    </FieldLabel>
                  </Field>
                ))}
              </div>
              {errors.rightsTypes && <FieldError errors={[errors.rightsTypes]} />}
            </Field>
          )
        }}
      />

      <Controller
        name="territoryMode"
        control={control}
        render={({ field: modeField }) => (
          <Controller
            name="territoryCountries"
            control={control}
            render={({ field: countriesField }) => (
              <Field data-invalid={!!errors.territoryMode || !!errors.territoryCountries}>
                <FieldLabel>Territorio</FieldLabel>
                <SocietyTerritorySelector
                  mode={modeField.value}
                  countries={countriesField.value}
                  onModeChange={(mode) => {
                    modeField.onChange(mode)
                    // Cambiar de modo invalida la selección de países del modo anterior.
                    countriesField.onChange([])
                  }}
                  onCountriesChange={countriesField.onChange}
                />
                {errors.territoryMode && <FieldError errors={[errors.territoryMode]} />}
                {errors.territoryCountries && <FieldError errors={[errors.territoryCountries]} />}
              </Field>
            )}
          />
        )}
      />

      <Field data-invalid={!!errors.membershipNumber}>
        <FieldLabel>Número de afiliación (opcional)</FieldLabel>
        <Input placeholder="12345" {...register('membershipNumber')} />
      </Field>

      <Field data-invalid={!!errors.ipiNameNumber}>
        <FieldLabel>IPI Name Number</FieldLabel>
        <Input placeholder="12345678901" maxLength={11} {...register('ipiNameNumber')} />
        {errors.ipiNameNumber && <FieldError errors={[errors.ipiNameNumber]} />}
      </Field>

      <DialogFooter className="pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          {cancelLabel}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}
