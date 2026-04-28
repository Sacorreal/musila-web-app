"use client";

import React, { useState } from "react";
import { useMyTracks } from "../hooks/use-tracks.hooks";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import { UserRole } from "@/src/domains/users/types/user.types";
import { Search, Music2 } from "lucide-react";
import { Input } from "@/src/shared/components/UI/input";
import { Badge } from "@/src/shared/components/UI/badge";
import { Switch } from "@/src/shared/components/UI/switch";
import Link from "next/link";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/src/shared/components/UI/alert-dialog";
import { useUpdateTrack } from "../hooks/use-tracks.hooks";

export function MyTracksList() {
  const { user } = useAuthStore();
  const { data: tracks, isLoading } = useMyTracks();
  const [searchQuery, setSearchQuery] = useState("");
  const { mutate: updateTrack, isPending: isUpdating } = useUpdateTrack();
  const [trackToToggle, setTrackToToggle] = useState<{ id: string; title: string; currentStatus: boolean } | null>(null);

  const handleToggleVisibility = () => {
    if (trackToToggle) {
      updateTrack({ 
        id: trackToToggle.id, 
        data: { isAvailable: !trackToToggle.currentStatus } 
      });
      setTrackToToggle(null);
    }
  };

  // Solo visible para autor o cantautor
  if (user?.role !== UserRole.AUTOR && user?.role !== UserRole.CANTAUTOR) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-[400px] w-full bg-slate-100 dark:bg-slate-900/50 rounded-2xl" />
      </div>
    );
  }

  // El filter se ejecuta solo cuando ya tenemos datos (post-loading)
  const filteredTracks = (tracks ?? []).filter((track) =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 py-6">
      {/* Search and Header */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar canciones"
            className="pl-10 h-11 bg-background border-border rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Total de canciones: <span className="text-foreground">{tracks?.length || 0}</span>
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/[0.02] text-[11px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="px-6 py-4">Canción #</th>
                <th className="px-6 py-4">Portada</th>
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-center">Visible</th>
                <th className="px-6 py-4">Género</th>
                <th className="px-6 py-4">Subgénero</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTracks.map((track, index) => (
                <tr 
                  key={track.id} 
                  className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/music/tracks/${track.id}`}>
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 relative group-hover:scale-105 transition-transform shadow-md">
                        {track.coverUrl ? (
                          <img 
                            src={track.coverUrl} 
                            alt={track.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Music2 className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/music/tracks/${track.id}`}>
                      <span className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors">
                        {track.title}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    {track.isAvailable ? (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-bold uppercase text-[10px]">
                        publicado
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-500/10 text-slate-600 dark:text-slate-400 border-none font-bold uppercase text-[10px]">
                        privado
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                      <Switch 
                        checked={track.isAvailable} 
                        disabled={isUpdating}
                        onCheckedChange={() => setTrackToToggle({ 
                          id: track.id, 
                          title: track.title, 
                          currentStatus: track.isAvailable 
                        })}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                    {typeof track.genre === 'string' ? track.genre : (track.genre as any)?.genre || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                    {track.subGenre || "-"}
                  </td>
                </tr>
              ))}
              
              {filteredTracks.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                        <Music2 className="w-8 h-8 text-muted-foreground opacity-50" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-bold text-foreground">No se encontraron canciones</p>
                        <p className="text-sm text-muted-foreground">
                          ¿Deseas publicar una?{" "}
                          <Link href="/music/publicar" className="text-primary hover:underline font-bold">
                            Haz clic aquí
                          </Link>
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!trackToToggle} onOpenChange={(open) => !open && setTrackToToggle(null)}>
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">¿Cambiar visibilidad?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Estás a punto de {trackToToggle?.currentStatus ? 'ocultar' : 'hacer pública'} la canción <strong>"{trackToToggle?.title}"</strong>. 
              {trackToToggle?.currentStatus 
                ? ' Otros usuarios ya no podrán verla ni solicitarla.' 
                : ' Ahora será visible para todos los usuarios en la plataforma.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl border-border">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleVisibility}
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            >
              Confirmar cambio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
