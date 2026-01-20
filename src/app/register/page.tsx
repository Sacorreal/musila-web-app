import { RegisterForm } from "@/src/domains/auth/components/register-form"
import { MusilaLogo } from "@/src/shared/components/icons"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-card items-center justify-center p-12">
        <div className="max-w-md">
          <div className="aspect-square rounded-3xl overflow-hidden mb-8">
            <img
              src="/two-musicians-collaborating-shaking-hands.jpg"
              alt="Músicos colaborando"
              className="w-full h-full object-cover"
            />
          </div>
          <blockquote className="text-lg text-muted-foreground italic">
            {`"Gracias a Músila pude grabar canciones de compositores increíbles que nunca hubiera conocido."`}
          </blockquote>
          <p className="mt-4 font-semibold text-foreground">María González, Intérprete</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <MusilaLogo className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">Músila</span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">Crea tu cuenta</h1>
          <p className="text-muted-foreground mb-8">Únete a la comunidad de compositores e intérpretes</p>

          <RegisterForm />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
