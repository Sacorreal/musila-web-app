import { CenteredAuthShell } from "@/src/domains/auth/components/CenteredAuthShell";
import { PaymentPendingCard } from "@/src/domains/payments/components/PaymentPendingCard";

export default function PendingPage() {
  return (
    <CenteredAuthShell logoClassName="mb-12" maxWidth="sm">
      <PaymentPendingCard />
    </CenteredAuthShell>
  );
}
