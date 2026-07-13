import { Metadata } from 'next';
import { TermsContent } from '@/src/shared/components/legal/TermsContent';

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Musila',
  description: 'Términos y Condiciones de Uso de la plataforma Musila. Conoce las reglas y lineamientos para autores e intérpretes.',
};

export default function TermsPage() {
  return <TermsContent />;
}
