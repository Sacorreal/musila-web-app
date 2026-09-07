import React from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";

interface ProfileHeaderProps {
  onSave: () => void;
  isSaving: boolean;
  canSave: boolean;
}

export function ProfileHeader({ onSave, isSaving, canSave }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
      <div className="space-y-2">
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Mi Perfil</h1>
        <p className="text-muted-foreground font-medium">Gestiona tu información personal y preferencias de cuenta.</p>
      </div>

      <Button
        onClick={onSave}
        disabled={!canSave}
        className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95"
      >
        {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
        {isSaving ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </div>
  );
}
