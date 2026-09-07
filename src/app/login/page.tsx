import { AuthSplitLayout } from "@/src/domains/auth/components/AuthSplitLayout";
import { LoginTestimonialPanel } from "@/src/domains/auth/components/LoginTestimonialPanel";
import { LoginPanel } from "@/src/domains/auth/components/LoginPanel";

export default function LoginPage() {
  return (
    <AuthSplitLayout leftPanel={<LoginTestimonialPanel />}>
      <LoginPanel />
    </AuthSplitLayout>
  );
}
