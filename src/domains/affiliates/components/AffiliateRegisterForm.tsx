'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Building2,
  Globe,
  Instagram,
  Youtube,
  Music2,
  Landmark,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAffiliateAuth } from '../hooks/use-affiliate-auth';
import { affiliateRegisterSchema, type AffiliateRegisterSchema } from '../validations/affiliate-register.schema';

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs text-red-400 font-medium pl-1"
    >
      {msg}
    </motion.p>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ElementType;
  error?: boolean;
  rightElement?: React.ReactNode;
};

function Field({ icon: Icon, error, rightElement, className, ...props }: InputProps) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
      <input
        {...props}
        className={`w-full pl-11 ${rightElement ? 'pr-12' : 'pr-4'} py-3.5 rounded-2xl bg-background border text-foreground placeholder:text-muted-foreground/40 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-primary/25 ${
          error ? 'border-red-400 focus:ring-red-300' : 'border-border focus:border-primary/60'
        } ${className ?? ''}`}
      />
      {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold text-primary uppercase tracking-widest pt-2 first:pt-0">
      {children}
    </h3>
  );
}

const EMPTY_FORM: AffiliateRegisterSchema = {
  name: '',
  lastName: '',
  email: '',
  password: '',
  repeatPassword: '',
  phone: '',
  countryCode: '+57',
  companyOrBrand: '',
  website: '',
  audienceDescription: '',
  instagram: '',
  tiktok: '',
  youtube: '',
  paymentPhone: '',
  bankName: '',
  accountType: '',
  accountNumber: '',
  accountHolderName: '',
  accountHolderIdType: '',
  accountHolderIdNumber: '',
  acceptedTerms: false,
};

export function AffiliateRegisterForm() {
  const router = useRouter();
  const { registerAffiliate } = useAffiliateAuth();

  const [form, setForm] = useState<AffiliateRegisterSchema>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof AffiliateRegisterSchema, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set =
    (key: keyof AffiliateRegisterSchema) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((err) => ({ ...err, [key]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = affiliateRegisterSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof AffiliateRegisterSchema, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof AffiliateRegisterSchema;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const socialNetworks: Record<string, string> = {};
      if (form.instagram) socialNetworks.instagram = form.instagram;
      if (form.tiktok) socialNetworks.tiktok = form.tiktok;
      if (form.youtube) socialNetworks.youtube = form.youtube;

      const hasBankInfo = Boolean(
        form.bankName && form.accountType && form.accountNumber && form.accountHolderName &&
          form.accountHolderIdType && form.accountHolderIdNumber,
      );

      await registerAffiliate({
        name: form.name,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        repeatPassword: form.repeatPassword,
        phone: form.phone || undefined,
        countryCode: form.countryCode || undefined,
        companyOrBrand: form.companyOrBrand || undefined,
        website: form.website || undefined,
        audienceDescription: form.audienceDescription || undefined,
        socialNetworks: Object.keys(socialNetworks).length > 0 ? socialNetworks : undefined,
        paymentPhone: form.paymentPhone || undefined,
        bankAccount: hasBankInfo
          ? {
              bankName: form.bankName!,
              accountType: form.accountType!,
              accountNumber: form.accountNumber!,
              accountHolderName: form.accountHolderName!,
              accountHolderIdType: form.accountHolderIdType!,
              accountHolderIdNumber: form.accountHolderIdNumber!,
            }
          : undefined,
        acceptedTerms: form.acceptedTerms,
      });

      setDone(true);
      toast.success('¡Cuenta de afiliado creada con éxito!');
    } catch (err: any) {
      toast.error(err?.message || 'Error al crear la cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
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
          <h2 className="text-2xl font-black text-foreground">¡Bienvenido al programa!</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Tu cuenta de afiliado fue creada exitosamente. Ya puedes acceder a tu panel y
            compartir tu enlace de referido.
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => router.push('/programa-afiliados/dashboard')}
          className="w-full max-w-xs h-13 py-3.5 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
        >
          Ir a mi panel
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <SectionTitle>Datos personales</SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">Nombre</label>
          <Field icon={User} type="text" placeholder="Juan" value={form.name} onChange={set('name')} error={!!errors.name} />
          <FieldError msg={errors.name} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">Apellido</label>
          <Field icon={User} type="text" placeholder="Pérez" value={form.lastName} onChange={set('lastName')} error={!!errors.lastName} />
          <FieldError msg={errors.lastName} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">Correo electrónico</label>
        <Field icon={Mail} type="email" placeholder="tu@correo.com" value={form.email} onChange={set('email')} error={!!errors.email} />
        <FieldError msg={errors.email} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">Contraseña</label>
          <Field
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
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">Confirmar contraseña</label>
          <Field
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
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="+57"
          value={form.countryCode}
          onChange={set('countryCode')}
          className="w-20 px-3 py-3.5 rounded-2xl bg-background border border-border text-foreground text-sm font-medium text-center outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/60"
        />
        <Field icon={Phone} type="tel" placeholder="3001234567" value={form.phone} onChange={set('phone')} className="flex-1" />
      </div>

      <SectionTitle>Perfil como afiliado</SectionTitle>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
          Marca, estudio o academia <span className="text-muted-foreground/40 normal-case font-normal">(opcional)</span>
        </label>
        <Field icon={Building2} type="text" placeholder="Estudio de Grabación XYZ" value={form.companyOrBrand} onChange={set('companyOrBrand')} />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
          Sitio web <span className="text-muted-foreground/40 normal-case font-normal">(opcional)</span>
        </label>
        <Field icon={Globe} type="url" placeholder="https://miweb.com" value={form.website} onChange={set('website')} error={!!errors.website} />
        <FieldError msg={errors.website} />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
          ¿Cómo planeas promocionar Musila? <span className="text-muted-foreground/40 normal-case font-normal">(opcional)</span>
        </label>
        <textarea
          placeholder="Canal de YouTube sobre producción musical con 50k suscriptores..."
          value={form.audienceDescription}
          onChange={set('audienceDescription')}
          rows={3}
          className="w-full px-4 py-3.5 rounded-2xl bg-background border border-border text-foreground placeholder:text-muted-foreground/40 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-primary/25 focus:border-primary/60 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field icon={Instagram} type="text" placeholder="Instagram" value={form.instagram} onChange={set('instagram')} />
        <Field icon={Music2} type="text" placeholder="TikTok" value={form.tiktok} onChange={set('tiktok')} />
        <Field icon={Youtube} type="text" placeholder="YouTube" value={form.youtube} onChange={set('youtube')} />
      </div>

      <SectionTitle>Datos de pago</SectionTitle>
      <p className="text-xs text-muted-foreground/60 -mt-3">
        Necesarios para transferirte tus comisiones. Puedes completarlos después desde tu panel.
      </p>

      <Field icon={Phone} type="tel" placeholder="Nequi / Daviplata (opcional)" value={form.paymentPhone} onChange={set('paymentPhone')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field icon={Landmark} type="text" placeholder="Banco" value={form.bankName} onChange={set('bankName')} />
        <Field icon={Landmark} type="text" placeholder="Tipo de cuenta (Ahorros/Corriente)" value={form.accountType} onChange={set('accountType')} />
        <Field icon={Landmark} type="text" placeholder="Número de cuenta" value={form.accountNumber} onChange={set('accountNumber')} />
        <Field icon={User} type="text" placeholder="Titular de la cuenta" value={form.accountHolderName} onChange={set('accountHolderName')} />
        <Field icon={User} type="text" placeholder="Tipo de documento" value={form.accountHolderIdType} onChange={set('accountHolderIdType')} />
        <Field icon={User} type="text" placeholder="Número de documento" value={form.accountHolderIdNumber} onChange={set('accountHolderIdNumber')} />
      </div>

      <label className="flex items-start gap-3 pt-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.acceptedTerms}
          onChange={(e) => {
            setForm((f) => ({ ...f, acceptedTerms: e.target.checked }));
            setErrors((err) => ({ ...err, acceptedTerms: undefined }));
          }}
          className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
        />
        <span className="text-xs text-muted-foreground leading-relaxed">
          Acepto los términos del Programa de Afiliados Musila y confirmo que la información
          proporcionada es correcta.
        </span>
      </label>
      <FieldError msg={errors.acceptedTerms} />

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-primary/25 transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Creando cuenta...
          </>
        ) : (
          <>
            Unirme al programa <ArrowRight className="w-5 h-5" />
          </>
        )}
      </motion.button>
    </form>
  );
}
