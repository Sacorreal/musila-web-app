'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/src/shared/components/UI/button'
import { Input } from '@/src/shared/components/UI/input'
import { Label } from '@/src/shared/components/UI/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/shared/components/UI/select'
import { registerWorkspaceGuestAction } from '../workspace-guest.actions'
import {
  DOCUMENT_TYPES,
  workspaceGuestRegisterSchema,
  type WorkspaceGuestRegisterInput,
} from '../workspace-guest.schema'

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      role="alert"
      className="pl-1 text-xs font-medium text-red-400"
    >
      {message}
    </motion.p>
  )
}

function PendingScreen({ organizationName }: { organizationName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 py-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        className="flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-500/20 bg-emerald-500/10"
      >
        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
      </motion.div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-foreground">¡Solicitud enviada!</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Tu cuenta fue creada y tu solicitud de acceso a{' '}
          <span className="font-bold text-foreground">{organizationName}</span> quedó pendiente de
          aprobación. Te notificaremos por correo y en la app cuando el administrador la revise y te
          asigne un rol.
        </p>
      </div>
    </motion.div>
  )
}

interface Props {
  token: string
  organizationName: string
}

export function WorkspaceGuestRegisterForm({ token, organizationName }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WorkspaceGuestRegisterInput>({
    resolver: zodResolver(workspaceGuestRegisterSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      typeCitizenID: '',
      citizenID: '',
      password: '',
      repeatPassword: '',
    },
  })

  const documentType = watch('typeCitizenID')

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerWorkspaceGuestAction({ ...values, token })
      setSubmitted(true)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al crear la cuenta')
    }
  })

  if (submitted) return <PendingScreen organizationName={organizationName} />

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nombre</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input id="name" className="pl-10" placeholder="Ana" {...register('name')} />
          </div>
          <FieldError message={errors.name?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Apellido</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input id="lastName" className="pl-10" placeholder="Ruiz" {...register('lastName')} />
          </div>
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Correo electrónico</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            id="email"
            type="email"
            className="pl-10"
            placeholder="ana@ejemplo.com"
            {...register('email')}
          />
        </div>
        <FieldError message={errors.email?.message} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-1.5">
          <Label htmlFor="typeCitizenID">Tipo de documento</Label>
          <Select
            value={documentType}
            onValueChange={(value) =>
              setValue('typeCitizenID', value, { shouldValidate: true, shouldDirty: true })
            }
          >
            <SelectTrigger id="typeCitizenID" aria-label="Tipo de documento">
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_TYPES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.typeCitizenID?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="citizenID">Número de documento</Label>
          <div className="relative">
            <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              id="citizenID"
              className="pl-10"
              placeholder="12345678"
              inputMode="numeric"
              {...register('citizenID')}
            />
          </div>
          <FieldError message={errors.citizenID?.message} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className="pl-10 pr-11"
            placeholder="Mínimo 6 caracteres"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <FieldError message={errors.password?.message} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="repeatPassword">Repetir contraseña</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            id="repeatPassword"
            type={showPassword ? 'text' : 'password'}
            className="pl-10"
            placeholder="Repite tu contraseña"
            {...register('repeatPassword')}
          />
        </div>
        <FieldError message={errors.repeatPassword?.message} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          <>
            Crear cuenta y solicitar acceso
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}
