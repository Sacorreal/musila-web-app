import { AuthSplitLayout } from "@/src/domains/auth/components/AuthSplitLayout";
import { RegisterTestimonialPanel } from "@/src/domains/auth/components/RegisterTestimonialPanel";
import { RegisterPanel } from "@/src/domains/auth/components/RegisterPanel";

/** Compatibilidad con enlaces de marketing antiguos que usan `?role=` con los nombres previos. */
const LEGACY_ROLE_TO_PLAN_TYPE: Record<string, string> = {
  autor: "plan_autor",
  cantautor: "plan_360",
  interprete: "plan_descubridor",
};

interface RegisterPageProps {
  searchParams: Promise<{ planType?: string; role?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { planType, role } = await searchParams;
  const defaultPlanType = planType ?? (role ? LEGACY_ROLE_TO_PLAN_TYPE[role] : undefined);
  return (
    <AuthSplitLayout leftPanel={<RegisterTestimonialPanel />}>
      <RegisterPanel defaultPlanType={defaultPlanType} />
    </AuthSplitLayout>
  );
}
