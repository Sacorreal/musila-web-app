import { Metadata } from 'next';
import { PrivacyPolicyContent } from '@/src/shared/components/legal/PrivacyPolicyContent';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Musila',
  description: 'Política de Tratamiento de Datos Personales de Musila. Conoce cómo protegemos tu información.',
};

export default function PrivacyPage() {
  return <PrivacyPolicyContent />;
}
