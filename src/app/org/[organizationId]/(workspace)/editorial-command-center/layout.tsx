import { fetchMyOrgCapabilities } from "@/src/domains/organizations/organizations.actions";
import { EditorialAccessDenied } from "@/src/domains/editorial-command-center/components/EditorialAccessDenied";

const REQUIRED_CAPABILITY = "editorial.command_center.view";

/**
 * Gate server-side del Editorial Command Center para organizaciones (Feature 8 / Flow 5):
 * la capability solo se otorga a organizaciones tipo PUBLISHER (ver migración
 * `SeedEditorialCommandCenterCapability`). Solo UX — el backend re-valida en
 * cada request vía `AuthorizationGuard`.
 */
export default async function EditorialCommandCenterOrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;
  const capabilities = await fetchMyOrgCapabilities(organizationId).catch(() => [] as string[]);

  if (!capabilities.includes(REQUIRED_CAPABILITY)) {
    return (
      <EditorialAccessDenied message="El Editorial Command Center solo está disponible para organizaciones tipo publisher." />
    );
  }

  return <>{children}</>;
}
