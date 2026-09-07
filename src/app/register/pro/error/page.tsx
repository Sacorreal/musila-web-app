import { CenteredAuthShell } from "@/src/domains/auth/components/CenteredAuthShell";
import { RegistrationErrorCard } from "@/src/domains/auth/components/RegistrationErrorCard";

interface ErrorPageProps {
  searchParams: Promise<{ ref?: string }>;
}

export default async function ProErrorPage({ searchParams }: ErrorPageProps) {
  const params = await searchParams;

  return (
    <CenteredAuthShell logoClassName="mb-12" maxWidth="sm">
      <RegistrationErrorCard reference={params.ref} />
    </CenteredAuthShell>
  );
}
