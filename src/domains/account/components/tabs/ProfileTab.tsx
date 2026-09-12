'use client';

import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { changeEmail, changePassword } from '../../actions/account.actions';
import { useAuthStore } from '@/src/domains/auth/store/use-auth-store';
import { ProfileForm } from '@/src/domains/users/components/ProfileForm';
import { Button } from '@/src/shared/components/UI/button';
import { Input } from '@/src/shared/components/UI/input';
import { Label } from '@/src/shared/components/UI/label';
import { Loader2 } from 'lucide-react';
import { StepUpAuthModal } from '@domains/security/components/StepUpAuthModal';

const CHANGE_PASSWORD_STEP_UP_SCOPE = 'account.change_password';

const emailSchema = z.object({
  newEmail: z.string().email('Correo inválido'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Requerido'),
  newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
});

type EmailForm = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export function ProfileTab() {
  const { user } = useAuthStore();
  const [isPending, startTransition] = useTransition();

  const emailForm = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });
  const passForm  = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    if (user) emailForm.reset({ newEmail: user.email });
  }, [user, emailForm]);

  function onChangeEmail(data: EmailForm) {
    startTransition(async () => {
      try {
        await changeEmail(data.newEmail);
        toast.success('Correo actualizado');
      } catch (e: any) { toast.error(e.message); }
    });
  }

  const [stepUpOpen, setStepUpOpen] = useState(false);
  const [pendingPassword, setPendingPassword] = useState<PasswordForm | null>(null);

  function onChangePassword(data: PasswordForm) {
    setPendingPassword(data);
    setStepUpOpen(true);
  }

  function submitPendingPassword() {
    if (!pendingPassword) return;
    const { currentPassword, newPassword } = pendingPassword;
    startTransition(async () => {
      try {
        await changePassword(currentPassword, newPassword);
        toast.success('Contraseña actualizada');
        passForm.reset();
        setPendingPassword(null);
      } catch (e: any) { toast.error(e.message); }
    });
  }

  return (
    <div className="space-y-6">
      <ProfileForm />

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

      <StepUpAuthModal
        open={stepUpOpen}
        onOpenChange={setStepUpOpen}
        scope={CHANGE_PASSWORD_STEP_UP_SCOPE}
        onVerified={() => {
          setStepUpOpen(false);
          submitPendingPassword();
        }}
      />
    </div>
  );
}
