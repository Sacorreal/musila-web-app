import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateShareAccessAction } from "@/src/domains/sharing/services/sharing.actions";
import { ShareAccessDeniedPage } from "@/src/domains/sharing/components/ShareAccessDeniedPage";
import { ShareAccessReason, ShareResourceType } from "@/src/domains/sharing/types/sharing.types";

const RESOURCE_ROUTES: Record<ShareResourceType, (id: string) => string> = {
  [ShareResourceType.PROFILE]: (id) => `/music/artista/${id}`,
  [ShareResourceType.PLAYLIST]: (id) => `/music/playlists/${id}`,
  [ShareResourceType.TRACK]: (id) => `/music/tracks/${id}`,
};

export default async function ShareAccessPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const cookieStore = await cookies();
  const hasSession = !!cookieStore.get("access_token")?.value;

  if (!hasSession) {
    redirect(`/login?returnUrl=${encodeURIComponent(`/compartir/${token}`)}`);
  }

  const result = await validateShareAccessAction(token);

  if (!result) {
    redirect(`/login?returnUrl=${encodeURIComponent(`/compartir/${token}`)}`);
  }

  if (result.granted && result.resourceType && result.resourceId) {
    redirect(RESOURCE_ROUTES[result.resourceType](result.resourceId));
  }

  return <ShareAccessDeniedPage reason={result.reason ?? ShareAccessReason.TOKEN_NOT_FOUND} />;
}
