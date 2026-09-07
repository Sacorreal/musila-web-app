'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/src/shared/components/UI/button';
import { Input } from '@/src/shared/components/UI/input';
import { Label } from '@/src/shared/components/UI/label';
import { useAffiliateAuth } from '../hooks/use-affiliate-auth';
import { affiliateLoginSchema } from '../validations/affiliate-login.schema';

export function AffiliateLoginForm() {
  const router = useRouter();
  const { loginAffiliate } = useAffiliateAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = affiliateLoginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as 'email' | 'password';
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await loginAffiliate(result.data);
      toast.success('Bienvenido de vuelta');
      router.push('/programa-afiliados/dashboard');
    } catch (error) {
      toast.error('Error al iniciar sesión', {
        description: error instanceof Error ? error.message : 'Credenciales inválidas',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="affiliate-email">Correo electrónico</Label>
        <Input
          id="affiliate-email"
          type="email"
          disabled={isSubmitting}
          className="bg-card"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((err) => ({ ...err, email: undefined }));
          }}
        />
        {errors.email && <p className="text-xs text-red-400 font-medium">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="affiliate-password">Contraseña</Label>
        <div className="relative">
          <Input
            id="affiliate-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            disabled={isSubmitting}
            className="bg-card pr-10"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((err) => ({ ...err, password: undefined }));
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-400 font-medium">{errors.password}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          'Iniciar sesión'
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿Aún no eres afiliado?{' '}
        <Link href="/programa-afiliados/registro" className="text-primary hover:underline font-semibold">
          Regístrate aquí
        </Link>
      </p>
    </form>
  );
}
