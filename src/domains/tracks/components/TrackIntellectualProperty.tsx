"use client";

import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { TrackResponse } from "@/src/domains/tracks/types/track.types";
import { ShieldCheck, FileText, Download, Building2, Globe } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TrackIntellectualPropertyProps {
  track: TrackResponse;
}

export function TrackIntellectualProperty({ track }: TrackIntellectualPropertyProps) {
  const user = useAuthStore((s) => s.user);

  // Solo los autores de la canción pueden ver los documentos de PI
  const isAuthor = user && track.authors?.some((author) => author.id === user.id);

  if (!isAuthor || !track.intellectualProperties || track.intellectualProperties.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-2xl border bg-card p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
          <ShieldCheck className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Propiedad Intelectual</h2>
          <p className="text-sm text-muted-foreground">
            Documentos legales asociados a esta canción (visible solo para autores).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {track.intellectualProperties.map((ip) => {
          const isCopyrightOffice = ip.type === "copyrightOffice";
          const badgeColor = isCopyrightOffice
            ? "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/30"
            : "bg-violet-500/10 text-violet-600 border-violet-200 dark:border-violet-500/30";

          const Icon = isCopyrightOffice ? Globe : Building2;

          return (
            <div
              key={ip.id}
              className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-5 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${badgeColor}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {isCopyrightOffice ? "Copyright Office" : "CMO"}
                  </span>
                  <h3 className="font-semibold text-foreground text-lg leading-none mt-2">
                    {ip.key}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Registrado el {format(new Date(ip.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>

                <a
                  href={ip.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                  title="Ver documento"
                >
                  <FileText className="h-5 w-5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
