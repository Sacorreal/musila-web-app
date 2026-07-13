import React from 'react';

export function PrivacyPolicyContent() {
  return (
    <main className="container mx-auto p-6 md:p-12 max-w-4xl bg-background text-foreground">
      <div className="space-y-8 prose prose-slate dark:prose-invert max-w-none">
        <header className="border-b pb-8">
          <h1 className="text-4xl font-black tracking-tight uppercase mb-2">
            Política de Tratamiento de Datos Personales
          </h1>
          <div className="text-muted-foreground font-medium">
            <p className="text-xl">Musila</p>
            <p><strong>Sitio Web:</strong> <a href="https://musila.co" className="hover:text-primary underline">https://musila.co</a></p>
            <p><strong>Correo Electrónico:</strong> <a href="mailto:privacidad@musila.co" className="hover:text-primary underline">privacidad@musila.co</a></p>
          </div>
        </header>

        <section>
          <h2 className="text-2xl font-bold mb-4">1. Introducción y Finalidad</h2>
          <p>
            La presente Política de Tratamiento de Datos Personales (en adelante, la “Política”) establece los lineamientos, principios, procedimientos y mecanismos adoptados por <strong>Musila</strong> para la recolección, almacenamiento, uso, circulación, transmisión, transferencia, actualización, supresión y demás actividades relacionadas con el tratamiento de datos personales.
          </p>
          <p>
            Musila reconoce la importancia de la privacidad, confidencialidad y seguridad de la información personal de sus usuarios, clientes, aliados, proveedores y visitantes, y se compromete a realizar el tratamiento de datos personales conforme a las disposiciones legales aplicables en Colombia y a estándares internacionales de protección de datos.
          </p>
          <p>Esta Política se adopta en cumplimiento de:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Ley 1581 de 2012</li>
            <li>Decreto 1377 de 2013</li>
            <li>Lineamientos de la Superintendencia de Industria y Comercio (SIC)</li>
            <li>Principios internacionales de privacidad y protección de datos inspirados en el GDPR y buenas prácticas globales.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Definiciones</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">2.1 Dato Personal</h3>
              <p>Cualquier información vinculada o que pueda asociarse a una persona natural determinada o determinable.</p>
            </div>
            <div>
              <h3 className="font-bold">2.2 Titular</h3>
              <p>Persona natural cuyos datos personales son objeto de tratamiento.</p>
            </div>
            <div>
              <h3 className="font-bold">2.3 Responsable del Tratamiento</h3>
              <p>Persona natural o jurídica que decide sobre la base de datos y/o el tratamiento de los datos personales.</p>
            </div>
            <div>
              <h3 className="font-bold">2.4 Encargado del Tratamiento</h3>
              <p>Persona natural o jurídica que realiza el tratamiento de datos personales por cuenta del Responsable.</p>
            </div>
            <div>
              <h3 className="font-bold">2.5 Tratamiento</h3>
              <p>Cualquier operación o conjunto de operaciones sobre datos personales, tales como recolección, almacenamiento, uso, circulación, transmisión, transferencia o supresión.</p>
            </div>
            <div>
              <h3 className="font-bold">2.6 Datos Sensibles</h3>
              <p>Aquellos datos que afectan la intimidad del titular o cuyo uso indebido puede generar discriminación.</p>
            </div>
            <div>
              <h3 className="font-bold">2.7 Autorización</h3>
              <p>Consentimiento previo, expreso e informado otorgado por el titular para el tratamiento de sus datos personales.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Principios para el Tratamiento de Datos Personales</h2>
          <p>Musila aplicará los siguientes principios en el tratamiento de datos personales:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Legalidad:</strong> El tratamiento se realizará conforme a la ley y demás disposiciones aplicables.</li>
            <li><strong>Finalidad:</strong> Los datos personales serán tratados para fines legítimos, específicos e informados al titular.</li>
            <li><strong>Libertad:</strong> El tratamiento solo podrá ejercerse con autorización previa, expresa e informada del titular o por mandato legal.</li>
            <li><strong>Transparencia:</strong> El titular podrá obtener información sobre el tratamiento de sus datos en cualquier momento.</li>
            <li><strong>Seguridad:</strong> Musila implementará medidas técnicas, administrativas y organizacionales para proteger la información personal.</li>
            <li><strong>Confidencialidad:</strong> Todas las personas que intervengan en el tratamiento de datos personales deberán garantizar la reserva de la información.</li>
            <li><strong>Minimización de Datos:</strong> Solo se recolectarán los datos estrictamente necesarios para cumplir las finalidades autorizadas.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Datos Personales Recolectados</h2>
          <p>Musila podrá recolectar y tratar las siguientes categorías de datos personales:</p>
          <ul className="list-disc pl-6 columns-1 md:columns-2 gap-8 space-y-1">
            <li>Nombre y apellidos</li>
            <li>Documento de identificación</li>
            <li>Nombre artístico o perfil público</li>
            <li>Dirección de correo electrónico</li>
            <li>Número telefónico</li>
            <li>Dirección IP y datos de navegación</li>
            <li>Información de autenticación y acceso</li>
            <li>Información de facturación y pagos</li>
            <li>Contenido cargado (canciones, obras)</li>
            <li>Datos de interacción y analítica</li>
            <li>Información de dispositivos</li>
            <li>Cookies y tecnologías similares</li>
          </ul>
          <p className="mt-4 italic text-muted-foreground text-sm">
            Musila no recolectará datos sensibles salvo cuando sea estrictamente necesario y exista autorización expresa del titular.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Finalidades del Tratamiento</h2>
          <p>Los datos personales serán tratados para las siguientes finalidades:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Registrar y gestionar cuentas de usuario</li>
            <li>Permitir el acceso y uso de la plataforma</li>
            <li>Gestionar la autenticación y seguridad de acceso</li>
            <li>Administrar canciones, obras y contenido musical</li>
            <li>Facilitar la interacción entre compositores e intérpretes</li>
            <li>Procesar pagos, suscripciones o transacciones</li>
            <li>Enviar comunicaciones transaccionales y notificaciones</li>
            <li>Enviar información promocional y campañas de marketing</li>
            <li>Realizar análisis estadísticos y métricas de uso</li>
            <li>Mejorar la experiencia de usuario y funcionalidades</li>
            <li>Prevenir fraudes y actividades ilícitas</li>
            <li>Cumplir obligaciones legales y contractuales</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Derechos de los Titulares</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Conocer, actualizar y rectificar sus datos personales.</li>
            <li>Solicitar prueba de la autorización otorgada.</li>
            <li>Ser informados sobre el uso dado a sus datos personales.</li>
            <li>Revocar la autorización y/o solicitar la supresión de los datos.</li>
            <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</li>
            <li>Acceder gratuitamente a sus datos personales.</li>
            <li>Oponerse al tratamiento de datos para fines de mercadeo.</li>
            <li>Solicitar la actualización o corrección de información inexacta.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Autorización y Consentimiento</h2>
          <p>Musila solicitará autorización previa, expresa e informada a través de formularios web, interfaces de aplicaciones móviles, casillas de aceptación y consentimientos electrónicos.</p>
          <p className="mt-2 text-muted-foreground">El titular podrá revocar su consentimiento en cualquier momento, salvo cuando exista una obligación legal o contractual que impida su eliminación inmediata.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. Política de Retención de Datos</h2>
          <p>Los datos personales serán conservados únicamente durante el tiempo necesario para cumplir las finalidades descritas, obligaciones legales, contractuales, fiscales o de seguridad.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">9. Compartición de Datos con Terceros</h2>
          <p>Musila podrá compartir datos con proveedores de almacenamiento (nube), pasarelas de pago, herramientas de analítica y servicios de soporte técnico. Todos los terceros deben cumplir obligaciones de confidencialidad.</p>
          <p className="mt-2 font-bold text-primary">Musila no comercializa datos personales de sus usuarios.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">10. Transferencias Internacionales</h2>
          <p>Los datos pueden ser procesados en servidores fuera de Colombia. Musila garantiza que dichas transferencias cumplan con estándares adecuados de protección y seguridad.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">11. Cookies</h2>
          <p>Utilizamos cookies para garantizar el funcionamiento, recordar preferencias y analizar el comportamiento de uso. El usuario puede configurar su navegador para rechazarlas.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">12. Medidas de Seguridad</h2>
          <p>Implementamos cifrado, controles de acceso, autenticación segura y monitoreo constante. Sin embargo, ningún sistema es 100% invulnerable.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">13. Procedimiento de Reclamaciones</h2>
          <p>Los titulares pueden presentar consultas o quejas enviando su nombre, identificación y descripción de la solicitud a través de nuestros canales de contacto.</p>
        </section>

        <section className="bg-muted p-6 rounded-2xl border">
          <h2 className="text-xl font-bold mb-2">14. Contacto</h2>
          <p><strong>Correo:</strong> privacidad@musila.co</p>
          <p><strong>Web:</strong> https://musila.co</p>
        </section>

        <footer className="border-t pt-8 text-sm text-muted-foreground">
          <p>Vigencia: Mayo 2026</p>
          <p className="mt-4">
            Al utilizar los servicios de Musila, declaras haber leído y aceptado esta Política de Tratamiento de Datos Personales.
          </p>
        </footer>
      </div>
    </main>
  );
}
