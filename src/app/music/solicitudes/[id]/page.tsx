"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { apiClient } from "@/src/shared/libs/axios/axios-client";
import { apiURLs } from "@/src/shared/constants/urls";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { UserPlanType, isAdminPlanType } from "@/src/domains/users/types/user.types";
import { TrackRequest } from "@/src/domains/requests/types/request.types";
import { TrackRequestDetails } from "@/src/domains/requests/components/TrackRequestDetails";
import { Button } from "@/src/shared/components/UI/button";
import { LoadingState } from "@/src/shared/components/UI/LoadingState";
import { ErrorState } from "@/src/shared/components/UI/ErrorState";

export default function RequestedTrackDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const role = user?.planType as UserPlanType | undefined;

  const [request, setRequest] = useState<TrackRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    let cancelled = false;

    apiClient
      .get<TrackRequest>(apiURLs.requestedTracks.byId(params.id))
      .then(({ data }) => {
        if (!cancelled) setRequest(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (loading) {
    return <LoadingState className="min-h-[60vh]" message="Cargando solicitud..." />;
  }

  if (error || !request) {
    return (
      <ErrorState
        className="min-h-[60vh]"
        message="No se pudo cargar esta solicitud. Puede que no exista o no tengas acceso a ella."
      />
    );
  }

  const authors = (request.track as any)?.authors as any[] | undefined;
  const isOwner =
    isAdminPlanType(role) || (Array.isArray(authors) && authors.some((a) => a.id === user?.id));

  return (
    <main className="container mx-auto max-w-3xl p-6 md:p-10">
      <Button
        variant="ghost"
        onClick={() => router.push("/music/solicitudes")}
        className="mb-6 gap-2 rounded-xl font-bold text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a solicitudes
      </Button>

      <div className="rounded-[2.5rem] border border-border bg-card shadow-2xl p-6 md:p-10">
        <TrackRequestDetails request={request} isOwner={isOwner} />
      </div>
    </main>
  );
}
