'use client'

import { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2, Wand2 } from 'lucide-react'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Field, FieldLabel, FieldError } from '@/src/shared/components/UI/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/UI/select'
import { Card, CardContent } from '@/src/shared/components/UI/card'
import {
  usePopulateParticipantsFromSplit,
  useUpdateParticipants,
} from '../../hooks/use-registration-file.hooks'
import { participantsSchema, type ParticipantsFormValues } from '../../validations/registration-file.schemas'
import {
  PARTICIPANT_ROLE_LABELS,
  RegistrationFileParticipantRole,
  type RegistrationFileDto,
  type RegistrationFileParticipantDto,
} from '../../types/registration-file.types'

interface Props {
  registrationFile: RegistrationFileDto
  onNext: () => void
}

const EMPTY_PARTICIPANT = {
  fullName: '',
  role: RegistrationFileParticipantRole.COMPOSITOR,
  authorialPercentage: 0,
  mechanicalPercentage: 0,
}

function toFormParticipants(participants: RegistrationFileParticipantDto[]): ParticipantsFormValues['participants'] {
  if (!participants.length) return [EMPTY_PARTICIPANT]
  return participants.map((p) => ({
    splitAuthorId: p.splitAuthorId ?? undefined,
    fullName: p.fullName,
    documentType: p.documentType ?? undefined,
    documentNumber: p.documentNumber ?? undefined,
    nationality: p.nationality ?? undefined,
    managementSociety: p.managementSociety ?? undefined,
    ipiCode: p.ipiCode ?? undefined,
    saycoCode: p.saycoCode ?? undefined,
    saycoIpName: p.saycoIpName ?? undefined,
    role: p.role,
    authorialPercentage: p.authorialPercentage,
    mechanicalPercentage: p.mechanicalPercentage,
  }))
}

export function ParticipantsStep({ registrationFile, onNext }: Props) {
  const { mutateAsync, isPending } = useUpdateParticipants()
  const { mutate: populateFromSplit, isPending: isPopulating } = usePopulateParticipantsFromSplit()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ParticipantsFormValues>({
    resolver: zodResolver(participantsSchema),
    defaultValues: {
      participants: toFormParticipants(registrationFile.participants),
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'participants' })

  useEffect(() => {
    reset({ participants: toFormParticipants(registrationFile.participants) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationFile.id, registrationFile.participants])

  const onSubmit = async (data: ParticipantsFormValues) => {
    await mutateAsync({ id: registrationFile.id, payload: data.participants })
    onNext()
  }

  const arrayError = errors.participants?.root?.message ?? (errors.participants as any)?.message

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          disabled={isPopulating}
          onClick={() =>
            populateFromSplit(registrationFile.id, {
              onSuccess: (rf) => reset({ participants: toFormParticipants(rf.participants) }),
            })
          }
        >
          {isPopulating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
          Traer coautores del split
        </Button>
      </div>

      {arrayError && <p className="text-sm text-destructive">{String(arrayError)}</p>}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-3">
                  <Field data-invalid={!!errors.participants?.[index]?.fullName}>
                    <FieldLabel>Nombre completo</FieldLabel>
                    <Input {...register(`participants.${index}.fullName` as const)} />
                    {errors.participants?.[index]?.fullName && (
                      <FieldError errors={[errors.participants[index]?.fullName]} />
                    )}
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Controller
                      control={control}
                      name={`participants.${index}.role` as const}
                      render={({ field: roleField }) => (
                        <Field>
                          <FieldLabel>Rol</FieldLabel>
                          <Select value={roleField.value} onValueChange={roleField.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(RegistrationFileParticipantRole).map((role) => (
                                <SelectItem key={role} value={role}>
                                  {PARTICIPANT_ROLE_LABELS[role]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    />

                    <Field>
                      <FieldLabel>Sociedad de gestión</FieldLabel>
                      <Input {...register(`participants.${index}.managementSociety` as const)} placeholder="SAYCO" />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Field data-invalid={!!errors.participants?.[index]?.authorialPercentage}>
                      <FieldLabel>% PER (autoral)</FieldLabel>
                      <Input type="number" step="0.01" {...register(`participants.${index}.authorialPercentage` as const)} />
                    </Field>
                    <Field data-invalid={!!errors.participants?.[index]?.mechanicalPercentage}>
                      <FieldLabel>% MEC (mecánico)</FieldLabel>
                      <Input type="number" step="0.01" {...register(`participants.${index}.mechanicalPercentage` as const)} />
                    </Field>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Field>
                      <FieldLabel>Carné SAYCO</FieldLabel>
                      <Input {...register(`participants.${index}.saycoCode` as const)} />
                    </Field>
                    <Field>
                      <FieldLabel>IP Name (otra sociedad)</FieldLabel>
                      <Input {...register(`participants.${index}.saycoIpName` as const)} />
                    </Field>
                    <Field>
                      <FieldLabel>Código IPI</FieldLabel>
                      <Input {...register(`participants.${index}.ipiCode` as const)} />
                    </Field>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={fields.length <= 1}
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {fields.length < 10 && (
        <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => append(EMPTY_PARTICIPANT)}>
          <Plus className="h-3.5 w-3.5" />
          Agregar participante
        </Button>
      )}

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar y continuar'}
        </Button>
      </div>
    </form>
  )
}
