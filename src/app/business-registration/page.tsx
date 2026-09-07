import { CenteredAuthShell } from '@/src/domains/auth/components/CenteredAuthShell';
import { BusinessRegistrationForm } from '@/src/domains/organizations/components/BusinessRegistrationForm';

export const metadata = {
  title: 'Musila Business — Registro de empresa',
};

export default function BusinessRegistrationPage() {
  return (
    <CenteredAuthShell maxWidth="md">
      <BusinessRegistrationForm />
    </CenteredAuthShell>
  );
}
