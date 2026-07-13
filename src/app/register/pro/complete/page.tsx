import { CenteredAuthShell } from "@/src/domains/auth/components/CenteredAuthShell";
import { RegistrationCompletePanel } from "@/src/domains/auth/components/RegistrationCompletePanel";

interface CompletePageProps {
  searchParams: Promise<{ ref?: string; role?: string }>;
}

export default async function CompletePage({ searchParams }: CompletePageProps) {
  const params = await searchParams;

  return (
    <CenteredAuthShell>
      <RegistrationCompletePanel
        defaultRole={params.role}
        externalReference={params.ref}
      />
    </CenteredAuthShell>
  );
}
