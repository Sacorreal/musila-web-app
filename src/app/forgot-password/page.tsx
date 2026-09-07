import { AuthSplitLayout } from "@/src/domains/auth/components/AuthSplitLayout";
import { ForgotPasswordInfoPanel } from "@/src/domains/auth/components/ForgotPasswordInfoPanel";
import { ForgotPasswordForm } from "@/src/domains/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout leftPanel={<ForgotPasswordInfoPanel />} logoClassName="flex items-center gap-2 mb-10">
      <ForgotPasswordForm />
    </AuthSplitLayout>
  );
}
