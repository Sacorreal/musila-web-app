"use client";

import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { VerifiedBadge } from "@/src/shared/components/UI/verified-badge";
import { Button } from "@/src/shared/components/UI/button";
import { useLegalIdentity } from "../hooks/legal-identity.hooks";
import { LEGAL_IDENTIFICATION_TYPE_LABELS } from "../types/legal-identity.types";
import { LegalIdentityForm } from "./LegalIdentityForm";

export function LegalIdentityStatusCard() {
  const { data: legalIdentity, isLoading, isError, refetch } = useLegalIdentity();
  const [isEditing, setIsEditing] = useState(false);

  const isVerified = !!legalIdentity?.identidadLegalVerificada;

  return (
    <div className="bg-card/50 backdrop-blur-xl rounded-[2.5rem] border border-border p-8 md:p-10 shadow-xl space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Identidad Legal</h3>
            <p className="text-sm text-muted-foreground">Requerida para firmar splits y reproducir música ajena</p>
          </div>
        </div>

        {isVerified && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-emerald-600">
            <VerifiedBadge size={16} />
            Verificado
          </span>
        )}
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando estado de identidad legal...</p>}

      {isError && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">No se pudo cargar tu identidad legal.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      )}

      {!isLoading && !isError && !isVerified && !isEditing && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Aún no has completado tu identidad legal. Es obligatoria para firmar splits y reproducir canciones de otros autores.
          </p>
          <Button size="sm" onClick={() => setIsEditing(true)}>
            Completar identidad legal
          </Button>
        </div>
      )}

      {!isLoading && !isError && isVerified && !isEditing && legalIdentity && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <InfoRow label="Nombre completo" value={`${legalIdentity.primerNombre} ${legalIdentity.segundoNombre} ${legalIdentity.primerApellido} ${legalIdentity.segundoApellido}`} />
          <InfoRow label="Documento" value={`${LEGAL_IDENTIFICATION_TYPE_LABELS[legalIdentity.tipoIdentificacion]} · ${legalIdentity.numeroIdentificacion}`} />
          <InfoRow label="Fecha de expedición" value={legalIdentity.fechaExpedicion} />
          <InfoRow label="Celular" value={`${legalIdentity.indicativoPais} ${legalIdentity.numeroCelular}`} />
          <div className="sm:col-span-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Editar identidad legal
            </Button>
          </div>
        </div>
      )}

      {!isLoading && !isError && isEditing && <LegalIdentityForm />}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-widest opacity-60">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  );
}
