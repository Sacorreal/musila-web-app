'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, Send, ArrowLeft, CheckCircle2, Copy, ExternalLink, QrCode, Clock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateInvite } from '../hooks/use-create-invite.hook';
import { InviteResponse } from '../types/invite.types';

// ─── Step 1: Formulario de invitación ────────────────────────────────────────
interface InviteFormProps {
  onSuccess: (data: InviteResponse) => void;
  inviterName: string;
}

function InviteForm({ onSuccess, inviterName }: InviteFormProps) {
  const [email, setEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');

  const { mutate, isPending } = useCreateInvite();

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!guestName.trim()) {
      setNameError('El nombre es obligatorio');
      valid = false;
    } else {
      setNameError('');
    }

    if (!email.trim() || !validateEmail(email)) {
      setEmailError('Ingresa un correo electrónico válido');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!valid) return;

    mutate(
      { email: email.trim(), guestName: guestName.trim() },
      {
        onSuccess: (data) => {
          toast.success('¡Invitación enviada con éxito! 🎉');
          onSuccess(data);
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || 'Error al crear la invitación';
          toast.error(msg);
        },
      }
    );
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* Saludo personalizado */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
          {inviterName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Hola, <span className="font-semibold text-foreground">{inviterName}</span></p>
          <p className="text-xs text-muted-foreground/70">Puedes invitar a un colaborador a unirse a Musila.</p>
        </div>
      </div>

      {/* Campo: Nombre del invitado */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
          Nombre del invitado
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
          <input
            id="guest-name-input"
            type="text"
            placeholder="Ej: Carlos Pérez"
            value={guestName}
            onChange={(e) => { setGuestName(e.target.value); setNameError(''); }}
            className={`w-full pl-11 pr-4 h-13 py-3.5 rounded-2xl bg-card border text-foreground placeholder:text-muted-foreground/50 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-primary/30 ${nameError ? 'border-red-400 focus:ring-red-300' : 'border-border focus:border-primary'}`}
          />
        </div>
        {nameError && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 font-medium pl-1">
            {nameError}
          </motion.p>
        )}
      </div>

      {/* Campo: Email del invitado */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
          Correo electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
          <input
            id="guest-email-input"
            type="email"
            placeholder="colaborador@ejemplo.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
            className={`w-full pl-11 pr-4 h-13 py-3.5 rounded-2xl bg-card border text-foreground placeholder:text-muted-foreground/50 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-primary/30 ${emailError ? 'border-red-400 focus:ring-red-300' : 'border-border focus:border-primary'}`}
          />
        </div>
        {emailError && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 font-medium pl-1">
            {emailError}
          </motion.p>
        )}
        <p className="text-xs text-muted-foreground/60 pl-1">
          El invitado recibirá un correo con el enlace de acceso.
        </p>
      </div>

      {/* Botón de envío */}
      <motion.button
        id="send-invite-btn"
        type="submit"
        disabled={isPending}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-primary/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            Enviando invitación...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Enviar Invitación
          </>
        )}
      </motion.button>
    </motion.form>
  );
}

// ─── Step 2: Resultado de la invitación ──────────────────────────────────────
interface InviteSuccessProps {
  invite: InviteResponse;
  onReset: () => void;
}

function InviteSuccess({ invite, onReset }: InviteSuccessProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const expiresAt = new Date(invite.expiresAt);
  const expiresFormatted = expiresAt.toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invite.inviteUrl);
      setCopied(true);
      toast.success('Enlace copiado al portapapeles');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('No se pudo copiar el enlace');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Badge de éxito */}
      <div className="flex flex-col items-center gap-3 text-center py-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
          className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center"
        >
          <CheckCircle2 className="w-9 h-9 text-emerald-400" />
        </motion.div>
        <div>
          <h3 className="text-xl font-black text-foreground">¡Invitación creada!</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Se envió un email a <span className="font-semibold text-foreground">{invite.email}</span>
          </p>
        </div>
      </div>

      {/* Enlace de invitación */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
          Enlace de invitación
        </label>
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-muted/40 border border-border">
          <p className="flex-1 text-xs text-muted-foreground truncate font-mono">{invite.inviteUrl}</p>
          <button
            id="copy-invite-link-btn"
            onClick={handleCopy}
            className="shrink-0 p-2 rounded-xl hover:bg-primary/10 text-primary transition-colors"
            title="Copiar enlace"
          >
            <Copy className={`w-4 h-4 transition-transform ${copied ? 'scale-110' : 'scale-100'}`} />
          </button>
          <a
            href={invite.inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 p-2 rounded-xl hover:bg-primary/10 text-primary transition-colors"
            title="Abrir enlace"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Expiración */}
      <div className="flex items-center gap-2 text-xs text-amber-400/80 font-medium bg-amber-400/5 border border-amber-400/10 rounded-2xl p-3">
        <Clock className="w-4 h-4 shrink-0" />
        <span>Expira el <strong>{expiresFormatted}</strong> (24 horas)</span>
      </div>

      {/* Toggle QR */}
      <button
        id="toggle-qr-btn"
        onClick={() => setShowQr((v) => !v)}
        className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl border border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary text-sm font-semibold transition-all"
      >
        <QrCode className="w-4 h-4" />
        {showQr ? 'Ocultar código QR' : 'Ver código QR para compartir'}
      </button>

      <AnimatePresence>
        {showQr && invite.qrCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col items-center gap-3 overflow-hidden"
          >
            <div className="p-4 rounded-2xl bg-white shadow-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={invite.qrCode} alt="QR de invitación" className="w-44 h-44 object-contain" />
            </div>
            <p className="text-xs text-muted-foreground/60 text-center">
              El invitado puede escanear este QR para acceder directamente
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón para nueva invitación */}
      <button
        id="new-invite-btn"
        onClick={onReset}
        className="w-full h-12 rounded-2xl border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 text-foreground/70 hover:text-primary text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Crear otra invitación
      </button>
    </motion.div>
  );
}

// ─── Componente principal exportable ─────────────────────────────────────────
interface InviteUserPanelProps {
  inviterName: string;
}

export function InviteUserPanel({ inviterName }: InviteUserPanelProps) {
  const [invite, setInvite] = useState<InviteResponse | null>(null);

  return (
    <AnimatePresence mode="wait">
      {invite ? (
        <InviteSuccess key="success" invite={invite} onReset={() => setInvite(null)} />
      ) : (
        <InviteForm key="form" onSuccess={setInvite} inviterName={inviterName} />
      )}
    </AnimatePresence>
  );
}
