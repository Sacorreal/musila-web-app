import { LoginForm } from "@/src/domains/auth/components/login-form/login-form";
import { MusilaLogo } from "@/src/shared/components/Icons/icons";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-card items-center justify-center p-12">
        <div className="max-w-md">
          <div className="aspect-square rounded-3xl overflow-hidden mb-8">
            <img
              src="/musician-composing-music-in-studio-with-guitar.jpg"
              alt="Músico en estudio"
              className="w-full h-full object-cover"
            />
          </div>
          <blockquote className="text-lg text-muted-foreground italic">
            {`"Músila me ayudó a encontrar el intérprete perfecto para mi canción. Ahora suena en todas las radios."`}
          </blockquote>
          <p className="mt-4 font-semibold text-foreground">
            Carlos Mendoza, Compositor
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <MusilaLogo className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">Músila</span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bienvenido de vuelta
          </h1>
          <p className="text-muted-foreground mb-8">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>

          <LoginForm />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
