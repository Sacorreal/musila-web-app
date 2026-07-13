import { AuthSplitLayout } from "@/src/domains/auth/components/AuthSplitLayout";
import { RegisterTestimonialPanel } from "@/src/domains/auth/components/RegisterTestimonialPanel";
import { RegisterPanel } from "@/src/domains/auth/components/RegisterPanel";

interface RegisterPageProps {
  searchParams: Promise<{ role?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { role } = await searchParams;
  return (
    <AuthSplitLayout leftPanel={<RegisterTestimonialPanel />}>
      <RegisterPanel defaultRole={role} />
    </AuthSplitLayout>
  );
}
