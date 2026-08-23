import React from "react";
import { User, Mail, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Controller, type Control, type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Input } from "@/src/shared/components/UI/input";
import { Label } from "@/src/shared/components/UI/label";
import type { ProfileFormValues } from "@/src/domains/users/validations/profile.schema";
import { SelectMusicRole } from "@/src/domains/auth/components/SelectMusicRole";
import { useUsernameAvailability } from "@/src/domains/users/hooks/users.hooks";

interface ProfilePersonalInfoSectionProps {
  register: UseFormRegister<ProfileFormValues>;
  control: Control<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  email?: string;
  currentUsername?: string;
}

interface UsernameInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  currentUsername?: string;
}

function UsernameInput({ value, onChange, onBlur, currentUsername }: UsernameInputProps) {
  const { isChecking, isAvailable, isFormatValid } = useUsernameAvailability(value || "", currentUsername);
  const showStatus = isFormatValid && (value || "").trim().length > 0;

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">@</span>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/^@/, ""))}
        onBlur={onBlur}
        autoCapitalize="off"
        autoCorrect="off"
        placeholder="Nombre123"
        className="h-14 pl-9 pr-12 rounded-2xl border-2 focus:ring-primary/20 bg-background/50 font-bold"
      />
      {showStatus && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2">
          {isChecking ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : isAvailable === true ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-label="Disponible" />
          ) : isAvailable === false ? (
            <XCircle className="h-5 w-5 text-destructive" aria-label="No disponible" />
          ) : null}
        </span>
      )}
    </div>
  );
}

export function ProfilePersonalInfoSection({ register, control, errors, email, currentUsername }: ProfilePersonalInfoSectionProps) {
  return (
    <div className="bg-card/50 backdrop-blur-xl rounded-[2.5rem] border border-border p-8 md:p-10 shadow-xl space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <User size={24} />
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tighter italic">Información Personal</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-60">Primer Nombre</Label>
          <Input {...register("name")} className="h-14 rounded-2xl border-2 focus:ring-primary/20 bg-background/50 font-bold" />
          {errors.name && <p className="text-xs text-red-500 font-bold ml-1">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-60">Segundo Nombre (Opcional)</Label>
          <Input {...register("secondName")} className="h-14 rounded-2xl border-2 focus:ring-primary/20 bg-background/50 font-bold" />
        </div>
        <div className="space-y-2">
          <Label className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-60">Primer Apellido</Label>
          <Input {...register("lastName")} className="h-14 rounded-2xl border-2 focus:ring-primary/20 bg-background/50 font-bold" />
          {errors.lastName && <p className="text-xs text-red-500 font-bold ml-1">{errors.lastName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-60">Segundo Apellido (Opcional)</Label>
          <Input {...register("secondLastName")} className="h-14 rounded-2xl border-2 focus:ring-primary/20 bg-background/50 font-bold" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-60">Correo Electrónico</Label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            value={email || ""}
            disabled
            className="h-14 pl-12 rounded-2xl border-2 bg-muted/30 font-bold opacity-60 cursor-not-allowed"
          />
        </div>
        <p className="text-[10px] text-muted-foreground italic ml-1">El correo electrónico no puede ser modificado por seguridad.</p>
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-60">Nombre de usuario</Label>
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <UsernameInput
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              currentUsername={currentUsername}
            />
          )}
        />
        {errors.username && <p className="text-xs text-red-500 font-bold ml-1">{errors.username.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-60">Rol</Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <SelectMusicRole value={field.value} onValueChange={field.onChange} />
          )}
        />
        {errors.role && <p className="text-xs text-red-500 font-bold ml-1">{errors.role.message}</p>}
      </div>
    </div>
  );
}
