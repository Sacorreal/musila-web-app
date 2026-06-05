'use client';

import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { getUserProfile, updateUserProfile, changeEmail, changePassword } from '../../actions/account.actions';
import { Button } from '@/src/shared/components/UI/button';
import { Input } from '@/src/shared/components/UI/input';
import { Label } from '@/src/shared/components/UI/label';
import { Textarea } from '@/src/shared/components/UI/textarea';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(1, 'Requerido').max(100),
  lastName: z.string().min(1, 'Requerido').max(100),
  biography: z.string().max(1000).optional(),
  phone: z.string().max(20).optional(),
});

const emailSchema = z.object({
  newEmail: z.string().email('Correo inválido'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Requerido'),
  newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
});

type ProfileForm = z.infer<typeof profileSchema>;
type EmailForm = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export function ProfileTab() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const profileForm = useForm<ProfileForm>({ resolver: zodResolver(profileSchema) });
  const emailForm   = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });
  const passForm    = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        setProfile(data);
        profileForm.reset({ name: data.name, lastName: data.lastName, biography: data.biography ?? '', phone: data.phone ?? '' });
        emailForm.reset({ newEmail: data.email });
      })
      .catch(() => toast.error('No se pudo cargar el perfil'))
      .finally(() => setLoading(false));
  }, []);

  function onSaveProfile(data: ProfileForm) {
    startTransition(async () => {
      try {
        await updateUserProfile(data);
        toast.success('Perfil actualizado');
      } catch (e: any) { toast.error(e.message); }
    });
  }

  function onChangeEmail(data: EmailForm) {
    startTransition(async () => {
      try {
        await changeEmail(data.newEmail);
        toast.success('Correo actualizado');
      } catch (e: any) { toast.error(e.message); }
    });
  }

  function onChangePassword(data: PasswordForm) {
    startTransition(async () => {
      try {
        await changePassword(data.currentPassword, data.newPassword);
        toast.success('Contraseña actualizada');
        passForm.reset();
      } catch (e: any) { toast.error(e.message); }
    });
  }

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-32 rounded-xl bg-muted"/><div className="h-24 rounded-xl bg-muted"/></div>;

  return (
    <div className="space-y-6">
      {/* Datos básicos */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-base font-semibold mb-4">Datos personales</h2>
        <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" {...profileForm.register('name')} />
              {profileForm.formState.errors.name && <p className="text-xs text-destructive">{profileForm.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Apellido</Label>
              <Input id="lastName" {...profileForm.register('lastName')} />
              {profileForm.formState.errors.lastName && <p className="text-xs text-destructive">{profileForm.formState.errors.lastName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" {...profileForm.register('phone')} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="biography">Biografía</Label>
            <Textarea id="biography" rows={3} {...profileForm.register('biography')} />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar cambios
          </Button>
        </form>
      </section>

      {/* Cambiar correo */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-base font-semibold mb-4">Correo electrónico</h2>
        <form onSubmit={emailForm.handleSubmit(onChangeEmail)} className="flex gap-3 items-end">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="newEmail">Nuevo correo</Label>
            <Input id="newEmail" type="email" {...emailForm.register('newEmail')} />
            {emailForm.formState.errors.newEmail && <p className="text-xs text-destructive">{emailForm.formState.errors.newEmail.message}</p>}
          </div>
          <Button type="submit" disabled={isPending}>Actualizar</Button>
        </form>
      </section>

      {/* Cambiar contraseña */}
      <section className="rounded-xl border bg-card p-6">
        <h2 className="text-base font-semibold mb-4">Contraseña</h2>
        <form onSubmit={passForm.handleSubmit(onChangePassword)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <Input id="currentPassword" type="password" {...passForm.register('currentPassword')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <Input id="newPassword" type="password" {...passForm.register('newPassword')} />
            {passForm.formState.errors.newPassword && <p className="text-xs text-destructive">{passForm.formState.errors.newPassword.message}</p>}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Cambiar contraseña
          </Button>
        </form>
      </section>
    </div>
  );
}
