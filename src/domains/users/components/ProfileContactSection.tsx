import React from "react";
import { Globe, Phone, IdCard } from "lucide-react";
import { Controller, type Control, type UseFormRegister } from "react-hook-form";
import { Input } from "@/src/shared/components/UI/input";
import { Label } from "@/src/shared/components/UI/label";
import { CountryCodeSelect } from "@/src/domains/auth/components/CountryCodeSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/UI/select";
import type { ProfileFormValues } from "@/src/domains/users/validations/profile.schema";

interface ProfileContactSectionProps {
  register: UseFormRegister<ProfileFormValues>;
  control: Control<ProfileFormValues>;
}

export function ProfileContactSection({ register, control }: ProfileContactSectionProps) {
  return (
    <div className="bg-card/50 backdrop-blur-xl rounded-[2.5rem] border border-border p-8 md:p-10 shadow-xl space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <Globe size={24} />
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tighter italic">Contacto y Documentación</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-60">Código de País</Label>
          <Controller
            name="countryCode"
            control={control}
            render={({ field }) => (
              <CountryCodeSelect value={field.value} onValueChange={field.onChange} />
            )}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-60">Teléfono</Label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 opacity-60" />
            <Input {...register("phone")} className="h-14 pl-10 rounded-2xl border-2 bg-background/50 font-bold" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-60">Tipo de Documento</Label>
          <Controller
            name="typeCitizenID"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-14 rounded-2xl border-2 bg-background/50 font-bold">
                  <SelectValue placeholder="Seleccione un documento" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border shadow-2xl">
                  <SelectItem value="DNI" className="py-3">Documento Nacional de Identidad (DNI)</SelectItem>
                  <SelectItem value="RG" className="py-3">Registro General (RG)</SelectItem>
                  <SelectItem value="Cédula de Ciudadanía" className="py-3">Cédula de Ciudadanía</SelectItem>
                  <SelectItem value="Cédula de Identidad" className="py-3">Cédula de Identidad</SelectItem>
                  <SelectItem value="NUIP" className="py-3">NUIP</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[11px] font-black uppercase tracking-widest ml-1 opacity-60">Número de Documento</Label>
          <div className="relative">
            <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 opacity-60" />
            <Input {...register("citizenID")} className="h-14 pl-10 rounded-2xl border-2 bg-background/50 font-bold" />
          </div>
        </div>
      </div>
    </div>
  );
}
