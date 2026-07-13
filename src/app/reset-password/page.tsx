import { AuthSplitLayout } from "@/src/domains/auth/components/AuthSplitLayout";
import { ResetPasswordInfoPanel } from "@/src/domains/auth/components/ResetPasswordInfoPanel";
import { ResetPasswordForm } from "@/src/domains/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout
      leftPanel={<ResetPasswordInfoPanel />}
      logoClassName="flex items-center gap-2 mb-10"
    >
      <ResetPasswordForm />
    </AuthSplitLayout>
  );
}
