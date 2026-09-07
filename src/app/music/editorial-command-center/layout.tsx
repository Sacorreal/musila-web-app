import { hasAnyCapability } from "@/src/domains/admin/authorization/capability-gate";
import { EditorialAccessDenied } from "@/src/domains/editorial-command-center/components/EditorialAccessDenied";

const REQUIRED_CAPABILITY = "editorial.command_center.view";

/**
 * Gate server-side del Editorial Command Center personal (Feature 8 / Flow 5):
 * la capability solo se otorga vía `plan_capabilities` a los planes Autor y
 * 360 (ver migración `SeedEditorialCommandCenterCapability`). Solo UX — el
 * backend re-valida en cada request vía `AuthorizationGuard`.
 */
export default async function EditorialCommandCenterLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasAnyCapability([REQUIRED_CAPABILITY]))) {
    return (
      <EditorialAccessDenied message="El Editorial Command Center solo está disponible para usuarios con plan Autor o 360." />
    );
  }

  return <>{children}</>;
}
