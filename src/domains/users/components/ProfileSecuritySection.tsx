import React from "react";
import { Lock } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/src/shared/components/UI/input";
import { Label } from "@/src/shared/components/UI/label";
import type { ProfileFormValues } from "@/src/domains/users/validations/profile.schema";

interface ProfileSecuritySectionProps {
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
}

export function ProfileSecuritySection({ register, errors }: ProfileSecuritySectionProps) {
  return (
    <div className="bg-card/50 backdrop-blur-xl rounded-[2.5rem] border border-border p-8 md:p-10 shadow-xl space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
          <Lock size={24} />
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tighter italic">Seguridad</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-60">Nueva Contraseña</Label>
          <Input
            type="password"
            {...register("password")}
            placeholder="Dejar vacío para no cambiar"
            className="h-14 rounded-2xl border-2 bg-background/50 font-bold"
          />
          {errors.password && <p className="text-xs text-red-500 font-bold ml-1">{errors.password.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-60">Confirmar Contraseña</Label>
          <Input
            type="password"
            {...register("confirmPassword")}
            className="h-14 rounded-2xl border-2 bg-background/50 font-bold"
          />
          {errors.confirmPassword && <p className="text-xs text-red-500 font-bold ml-1">{errors.confirmPassword.message}</p>}
        </div>
      </div>
    </div>
  );
}
