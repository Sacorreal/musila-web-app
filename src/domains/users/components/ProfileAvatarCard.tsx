import React from "react";
import { Camera, Loader2 } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/components/UI/avatar";
import { Label } from "@/src/shared/components/UI/label";
import { Textarea } from "@/src/shared/components/UI/textarea";
import type { ProfileFormValues } from "@/src/domains/users/validations/profile.schema";

interface ProfileAvatarCardProps {
  name?: string;
  lastName?: string;
  role?: string;
  avatarPreview: string | null;
  uploadProgress: number;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
}

export function ProfileAvatarCard({
  name,
  lastName,
  role,
  avatarPreview,
  uploadProgress,
  onAvatarChange,
  register,
  errors,
}: ProfileAvatarCardProps) {
  return (
    <div className="bg-card/50 backdrop-blur-xl rounded-[2.5rem] border border-border p-8 flex flex-col items-center text-center gap-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />

      <div className="relative group mt-4">
        <Avatar className="w-40 h-40 border-4 border-background shadow-2xl transition-transform duration-500 group-hover:scale-105">
          <AvatarImage src={avatarPreview || ""} className="object-cover" />
          <AvatarFallback className="bg-muted text-4xl font-black uppercase tracking-widest">
            {name?.[0]}
            {lastName?.[0]}
          </AvatarFallback>
        </Avatar>

        <label
          htmlFor="avatar-upload"
          className="absolute bottom-1 right-1 w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-90 transition-all border-4 border-background"
        >
          <Camera size={20} />
          <input
            id="avatar-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onAvatarChange}
          />
        </label>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-bold">
          {name} {lastName}
        </h2>
        <p className="text-xs font-black uppercase tracking-widest text-primary opacity-80">{role}</p>
      </div>

      <div className="w-full space-y-3 pt-4 border-t border-border">
        <div className="space-y-2 text-left">
          <Label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">Biografía</Label>
          <Textarea
            {...register("biography")}
            placeholder="Cuéntanos un poco sobre ti..."
            className="min-h-[150px] rounded-2xl border-2 focus:ring-primary/20 bg-background/50 resize-none"
          />
          {errors.biography && <p className="text-xs text-red-500 font-bold ml-1">{errors.biography.message}</p>}
        </div>
      </div>
    </div>
  );
}
