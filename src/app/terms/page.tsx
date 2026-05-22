import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Musila',
  description: 'Términos y Condiciones de Uso de la plataforma Musila. Conoce las reglas y lineamientos para autores e intérpretes.',
};

export default function TermsPage() {
  return (
    <main className="container mx-auto p-6 md:p-12 max-w-4xl bg-background text-foreground">
      <div className="space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <header className="border-b pb-8">
          <h1 className="text-4xl font-black tracking-tight uppercase mb-2">
            Términos y Condiciones de Uso
          </h1>
          <div className="text-muted-foreground font-medium">
            <p className="text-xl">Musila</p>
            <p><strong>Última actualización:</strong> 13 de mayo de 2026</p>
          </div>
        </header>

        <section>
          <p className="text-lg leading-relaxed">
            Bienvenido a <strong>Musila</strong>, una plataforma digital diseñada para conectar autores, compositores e intérpretes, facilitando la publicación, administración, descubrimiento y solicitud legal de uso de canciones inéditas.
          </p>
          <p className="mt-4 font-semibold text-primary/80">
            Al acceder, registrarse o utilizar Musila, el usuario acepta íntegramente los presentes Términos y Condiciones de Uso. Si no está de acuerdo con estos Términos, deberá abstenerse de utilizar la plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. Identificación de la Plataforma</h2>
          <ul className="list-none pl-0 space-y-1">
            <li><strong>Nombre:</strong> Musila</li>
            <li><strong>Sitio web:</strong> <a href="https://musila.co" className="hover:text-primary underline">https://musila.co</a></li>
            <li><strong>Correo:</strong> <a href="mailto:info@musila.co" className="hover:text-primary underline">info@musila.co</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Objeto de la Plataforma</h2>
          <p>Musila es una plataforma tecnológica que permite:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Publicar canciones inéditas y contenido musical.</li>
            <li>Administrar catálogos musicales.</li>
            <li>Conectar autores y compositores con intérpretes.</li>
            <li>Facilitar solicitudes de uso legal de canciones.</li>
            <li>Compartir enlaces públicos de canciones.</li>
            <li>Gestionar negociaciones privadas entre usuarios.</li>
          </ul>
          <p className="mt-4 italic bg-muted p-4 rounded-xl border border-border">
            Musila actúa únicamente como intermediario tecnológico y no participa como representante legal, editorial, productor musical ni agente comercial de los usuarios.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Registro y Cuenta de Usuario</h2>
          <p>Para acceder a ciertas funcionalidades, el usuario deberá crear una cuenta proporcionando información veraz. El usuario es responsable de:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Mantener la confidencialidad de sus credenciales.</li>
            <li>Todas las actividades realizadas desde su cuenta.</li>
            <li>Notificar inmediatamente cualquier uso no autorizado.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Propiedad Intelectual de las Canciones</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">4.1 Titularidad de las Obras</h3>
              <p>Las canciones, letras y grabaciones publicadas son propiedad exclusiva del usuario que las publica. Musila no adquiere propiedad sobre las obras cargadas.</p>
            </div>
            <div>
              <h3 className="font-bold">4.2 Responsabilidad sobre el Contenido</h3>
              <p>El usuario garantiza tener los derechos necesarios y que la publicación no infringe derechos de terceros. El usuario será el único responsable frente a reclamaciones.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Contenido Musical y Letras</h2>
          <p>Musila no se hace responsable por el contenido de las letras, mensajes u opiniones contenidas en las obras. Cada usuario es responsable exclusivo de lo que publica.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Licencias y Negociaciones</h2>
          <p>Los precios y condiciones de las licencias son definidos exclusivamente por el autor. Musila no interviene en negociaciones económicas ni establece precios.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Autorización para Compartir</h2>
          <p>Al publicar, el usuario autoriza a Musila a generar enlaces públicos y vistas previas. Esta autorización no implica cesión de derechos de autor.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. Uso Permitido</h2>
          <p>Está prohibido publicar contenido ilegal, suplantar identidad, distribuir malware o intentar vulnerar la seguridad del sistema.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">9. Servicios de Terceros</h2>
          <p>Podemos integrar pasarelas de pago y servicios cloud de terceros, los cuales están sujetos a sus propios términos y políticas.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">10. Disponibilidad</h2>
          <p>No garantizamos disponibilidad ininterrumpida ni ausencia de errores técnicos, pudiendo realizar mantenimientos sin previo aviso.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">11. Limitación de Responsabilidad</h2>
          <p>Musila no responde por pérdida de ingresos, conflictos entre usuarios o infracciones cometidas por terceros en la plataforma.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">12. Protección de Datos</h2>
          <p>El tratamiento de datos se rige por nuestra Política de Privacidad, la cual el usuario acepta al usar la plataforma.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">13. Suspensión de Cuentas</h2>
          <p>Nos reservamos el derecho de suspender cuentas por incumplimiento de términos o actividades sospechosas.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">14. Modificaciones</h2>
          <p>Podemos modificar estos términos en cualquier momento. El uso continuo implica la aceptación de los mismos.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">15. Legislación y Jurisdicción</h2>
          <p>Estos términos se rigen por las leyes de la República de Colombia.</p>
        </section>

        <section className="bg-muted p-6 rounded-2xl border border-border">
          <h2 className="text-xl font-bold mb-2">16. Contacto</h2>
          <p><strong>Correo:</strong> info@musila.co</p>
          <p><strong>Web:</strong> https://musila.co</p>
        </section>

        <footer className="border-t pt-8 text-sm text-muted-foreground text-center">
          <p>© 2026 Musila. Todos los derechos reservados.</p>
        </footer>
      </div>
    </main>
  );
}
