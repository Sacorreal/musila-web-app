import { AuthSplitLayout } from "@/src/domains/auth/components/AuthSplitLayout";
import { VerifyEmailInfoPanel } from "@/src/domains/auth/components/VerifyEmailInfoPanel";
import { VerifyEmailStatus } from "@/src/domains/auth/components/VerifyEmailStatus";

export default function VerifyEmailPage() {
  return (
    <AuthSplitLayout
      leftPanel={<VerifyEmailInfoPanel />}
      logoClassName="flex items-center gap-2 mb-10"
    >
      <VerifyEmailStatus />
    </AuthSplitLayout>
  );
}
