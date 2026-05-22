'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  User, Mail, Lock, Eye, EyeOff, CreditCard, Phone,
  CheckCircle2, ArrowRight, Loader2, AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { registerGuestAction } from '../services/register-guest.actions';
import { InviteValidationResponse, RegisterGuestInput } from '../types/register-guest.types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 font-medium pl-1">
      {msg}
    </motion.p>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ElementType;
  error?: boolean;
  rightElement?: React.ReactNode;
};
function Field({ icon: Icon, error, rightElement, ...props }: InputProps) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
      <input
        {...props}
        className={`w-full pl-11 ${rightElement ? 'pr-12' : 'pr-4'} py-3.5 rounded-2xl bg-background border text-foreground placeholder:text-muted-foreground/40 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-primary/25 ${error ? 'border-red-400 focus:ring-red-300' : 'border-border focus:border-primary/60'}`}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
      )}
    </div>
  );
}

// ─── Estado de éxito ─────────────────────────────────────────────────────────
function SuccessScreen({ guestName }: { guestName: string }) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center gap-6 py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
        className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
      >
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-2xl font-black text-foreground">¡Bienvenido a Musila!</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Tu cuenta ha sido creada exitosamente,{' '}
          <span className="font-bold text-foreground">{guestName}</span>.<br />
          Ahora puedes iniciar sesión y comenzar a colaborar.
        </p>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        onClick={() => router.push('/login')}
        className="w-full max-w-xs h-13 py-3.5 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
      >
        Ir a Iniciar Sesión
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}

// ─── Formulario principal ─────────────────────────────────────────────────────
interface GuestRegisterFormProps {
  invite: InviteValidationResponse;
}

export function GuestRegisterForm({ invite }: GuestRegisterFormProps) {
  const [form, setForm] = useState<Omit<RegisterGuestInput, 'token'>>({
    name: '',
    lastName: '',
    email: invite.email ?? '',
    password: '',
    repeatPassword: '',
    countryCode: '',
    phone: '',
    typeCitizenID: 'CC',
    citizenID: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((err) => ({ ...err, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'El nombre es obligatorio';
    if (!form.lastName.trim()) e.lastName = 'El apellido es obligatorio';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo electrónico inválido';
    if (!form.password || form.password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (form.password !== form.repeatPassword) e.repeatPassword = 'Las contraseñas no coinciden';
    if (!(form.citizenID ?? '').trim()) e.citizenID = 'El número de documento es obligatorio';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await registerGuestAction({ ...form, token: invite.token });
      setDone(true);
      toast.success('¡Cuenta creada con éxito!');
    } catch (err: any) {
      const msg = err?.message || 'Error al crear la cuenta. Intenta de nuevo.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (done) return <SuccessScreen guestName={form.name} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nombre y apellido */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">Nombre</label>
          <Field id="name-input" icon={User} type="text" placeholder="Juan" value={form.name} onChange={set('name')} error={!!errors.name} />
          <FieldError msg={errors.name} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">Apellido</label>
          <Field id="lastname-input" icon={User} type="text" placeholder="Pérez" value={form.lastName} onChange={set('lastName')} error={!!errors.lastName} />
          <FieldError msg={errors.lastName} />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">Correo electrónico</label>
        <Field
          id="email-input"
          icon={Mail}
          type="email"
          placeholder="tu@correo.com"
          value={form.email}
          onChange={set('email')}
          error={!!errors.email}
          // Si el email viene pre-llenado del token no lo bloqueamos completamente, 
          // pero lo marcamos visualmente
          className={invite.email ? 'opacity-80' : ''}
        />
        <FieldError msg={errors.email} />
      </div>

      {/* Tipo y número de documento */}
      <div className="grid grid-cols-5 gap-3">
        <div className="col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">Tipo doc.</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
            <select
              id="doc-type-select"
              value={form.typeCitizenID}
              onChange={set('typeCitizenID')}
              className="w-full pl-10 pr-3 py-3.5 rounded-2xl bg-background border border-border text-foreground text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-primary/25 focus:border-primary/60 appearance-none"
            >
              {['CC', 'CE', 'TI', 'PP', 'NIT'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-span-3 space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">Número</label>
          <Field id="citizen-id-input" icon={CreditCard} type="text" placeholder="12345678" value={form.citizenID} onChange={set('citizenID')} error={!!errors.citizenID} />
          <FieldError msg={errors.citizenID} />
        </div>
      </div>

      {/* Teléfono */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">Teléfono <span className="text-muted-foreground/40 normal-case font-normal">(opcional)</span></label>
        <div className="flex gap-2">
          <input
            id="country-code-input"
            type="text"
            placeholder="+57"
            value={form.countryCode}
            onChange={set('countryCode')}
            className="w-20 px-3 py-3.5 rounded-2xl bg-background border border-border text-foreground text-sm font-medium text-center outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/60"
          />
          <Field id="phone-input" icon={Phone} type="tel" placeholder="3001234567" value={form.phone ?? ''} onChange={set('phone')} className="flex-1" />
        </div>
      </div>

      {/* Contraseña */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">Contraseña</label>
        <Field
          id="password-input"
          icon={Lock}
          type={showPassword ? 'text' : 'password'}
          placeholder="Mínimo 6 caracteres"
          value={form.password}
          onChange={set('password')}
          error={!!errors.password}
          rightElement={
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="p-1 text-muted-foreground/50 hover:text-foreground transition-colors">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />
        <FieldError msg={errors.password} />
      </div>

      {/* Repetir contraseña */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">Confirmar contraseña</label>
        <Field
          id="repeat-password-input"
          icon={Lock}
          type={showRepeat ? 'text' : 'password'}
          placeholder="Repite tu contraseña"
          value={form.repeatPassword}
          onChange={set('repeatPassword')}
          error={!!errors.repeatPassword}
          rightElement={
            <button type="button" onClick={() => setShowRepeat((v) => !v)} className="p-1 text-muted-foreground/50 hover:text-foreground transition-colors">
              {showRepeat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />
        <FieldError msg={errors.repeatPassword} />
      </div>

      {/* Submit */}
      <motion.button
        id="register-guest-submit-btn"
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-primary/25 transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Creando cuenta...</>
        ) : (
          <>Crear mi cuenta <ArrowRight className="w-5 h-5" /></>
        )}
      </motion.button>
    </form>
  );
}
