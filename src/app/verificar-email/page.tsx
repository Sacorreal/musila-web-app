'use client'

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, MailCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MusilaLogo } from '@/src/shared/components/Icons/icons';
import { verifyEmailRequest } from '@/src/domains/auth/services/auth.actions';

type VerificationStatus = 'loading' | 'success' | 'error';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('El enlace de verificación no es válido o está incompleto.');
      return;
    }

    verifyEmailRequest(token)
      .then((res) => {
        setStatus('success');
        setMessage(res.message);
      })
      .catch((err: Error) => {
        setStatus('error');
        setMessage(err.message || 'El enlace es inválido o ha expirado.');
      });
  }, [token]);

  return (
    <AnimatePresence mode="wait">
      {status === 'loading' && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <h1 className="text-3xl font-black text-foreground mb-3">Verificando tu correo...</h1>
          <p className="text-muted-foreground leading-relaxed">
            Esto solo tomará un momento.
          </p>
        </motion.div>
      )}

      {status === 'success' && (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </motion.div>
          <h1 className="text-3xl font-black text-foreground mb-3">¡Correo Verificado!</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">{message}</p>
          <Link
            href="/music"
            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Ir a Músila
          </Link>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-black text-foreground mb-3">Enlace Inválido</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">{message}</p>
          <Link
            href="/music"
            className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Ir a Músila
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side – Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-card items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-md space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
            <MailCheck className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-foreground leading-tight">
            Ya casi estás dentro
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Verificar tu correo nos ayuda a mantener Músila libre de cuentas falsas y proteger a la comunidad de artistas.
          </p>
        </div>
      </div>

      {/* Right Side – Status */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <MusilaLogo className="h-auto w-auto text-primary" />
          </Link>

          <Suspense
            fallback={
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            }
          >
            <VerifyEmailContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
