import { MusilaLogo } from '@/src/shared/components/Icons/icons';
import { UserRegisterForm } from '@/src/domains/auth/components/UserRegisterForm';
import Link from 'next/link';

interface CompletePageProps {
  searchParams: Promise<{ ref?: string; role?: string }>;
}

export default async function CompletePage({ searchParams }: CompletePageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <Link href="/" className="mb-8">
        <MusilaLogo className="h-10 w-auto text-primary" />
      </Link>

      <div className="w-full max-w-md">
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          ✅ Pago confirmado — completa tu registro para activar tu plan Pro
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">Completa tu registro</h1>
        <p className="text-muted-foreground mb-6">
          Tu pago fue procesado exitosamente. Crea tu cuenta para acceder a Musila Pro.
        </p>

        <UserRegisterForm
          defaultRole={params.role as string | undefined}
          externalReference={params.ref}
        />
      </div>
    </div>
  );
}
