"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  IdCard, 
  FileText, 
  Lock, 
  Camera, 
  Save, 
  Loader2,
  CheckCircle2,
  Globe
} from "lucide-react";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import type { UserJWTResponse } from "@/src/domains/auth/types/auth.types";
import { usersService } from "@/src/domains/users/services/users.service";
import { useUploadStorage } from "@/src/domains/storage/hooks/use-upload-storage";
import { StorageFolder, UploadField } from "@/src/domains/storage/types/storage.types";
import { Button } from "@/src/shared/components/UI/button";
import { Input } from "@/src/shared/components/UI/input";
import { Textarea } from "@/src/shared/components/UI/textarea";
import { Label } from "@/src/shared/components/UI/label";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/components/UI/avatar";
import { Controller } from "react-hook-form";
import { CountryCodeSelect } from "@/src/domains/auth/components/CountryCodeSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/UI/select";

const profileSchema = z.object({
  name: z.string().min(2, "El nombre es demasiado corto"),
  secondName: z.string().optional(),
  lastName: z.string().min(2, "El apellido es demasiado corto"),
  secondLastName: z.string().optional(),
  biography: z.string().max(500, "La biografía no puede superar los 500 caracteres").optional(),
  phone: z.string().optional(),
  countryCode: z.string().optional(),
  typeCitizenID: z.string().optional(),
  citizenID: z.string().optional(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional().or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
}).refine((data) => {
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function PerfilPage() {
  const { user, setUser } = useAuthStore();
  const uploadStorage = useUploadStorage();
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      secondName: "",
      lastName: "",
      secondLastName: "",
      biography: "",
      phone: "",
      countryCode: "",
      typeCitizenID: "",
      citizenID: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        secondName: user.secondName || "",
        lastName: user.lastName || "",
        secondLastName: user.secondLastName || "",
        biography: user.biography || "",
        phone: user.phone || "",
        countryCode: user.countryCode || "",
        typeCitizenID: user.typeCitizenID || "",
        citizenID: user.citizenID || "",
      });
      if (user.avatarUrl) setAvatarPreview(user.avatarUrl);
    }
  }, [user, reset]);

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);

    // Solo preview local para feedback inmediato
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSaving(true);
    try {
      let avatarData = {};

      // 1. Si hay una nueva imagen, subirla primero
      if (avatarFile) {
        const result = await uploadStorage.mutateAsync([{
          field: "avatar" as UploadField,
          file: avatarFile,
          folder: StorageFolder.USER_AVATAR,
        }]);

        const avatarUpload = result.find(r => r.field === "avatar");
        if (avatarUpload) {
          avatarData = {
            avatarUrl: avatarUpload.publicUrl,
            avatarKey: avatarUpload.key
          };
        }
      }

      // 2. Preparar el resto de los datos
      const { confirmPassword, ...updateData } = values;
      if (!updateData.password) delete updateData.password;

      // 3. Enviar todo al backend en una sola petición
      const { data, error } = await usersService.updateMe({
        ...updateData,
        ...avatarData
      } as any);

      if (error) {
        toast.error(error);
      } else if (data) {
        setUser(data as unknown as UserJWTResponse);
        setAvatarFile(null); // Limpiar archivo pendiente
        toast.success("Perfil actualizado correctamente");
        setValue("password", "");
        setValue("confirmPassword", "");
      }
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error inesperado");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 md:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
          <div className="space-y-2">
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">Mi Perfil</h1>
            <p className="text-muted-foreground font-medium">Gestiona tu información personal y preferencias de cuenta.</p>
          </div>
          
          <Button 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSaving || (!isDirty && !avatarPreview)}
            className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95"
          >
            {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Avatar & Bio */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-card/50 backdrop-blur-xl rounded-[2.5rem] border border-border p-8 flex flex-col items-center text-center gap-6 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
               
               <div className="relative group mt-4">
                 <Avatar className="w-40 h-40 border-4 border-background shadow-2xl transition-transform duration-500 group-hover:scale-105">
                   <AvatarImage src={avatarPreview || ""} className="object-cover" />
                   <AvatarFallback className="bg-muted text-4xl font-black uppercase tracking-widest">
                     {user?.name?.[0]}{user?.lastName?.[0]}
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

                 {uploadStorage.progresses["avatar"] > 0 && uploadStorage.progresses["avatar"] < 100 && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                      <Loader2 className="w-10 h-10 text-white animate-spin" />
                   </div>
                 )}
               </div>

               <div className="space-y-1">
                 <h2 className="text-xl font-bold">{user?.name} {user?.lastName}</h2>
                 <p className="text-xs font-black uppercase tracking-widest text-primary opacity-80">{user?.role}</p>
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
          </div>

          {/* Right Column: Personal Data */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sección: Información Personal */}
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
                    value={user?.email || ""} 
                    disabled 
                    className="h-14 pl-12 rounded-2xl border-2 bg-muted/30 font-bold opacity-60 cursor-not-allowed" 
                  />
                </div>
                <p className="text-[10px] text-muted-foreground italic ml-1">El correo electrónico no puede ser modificado por seguridad.</p>
              </div>
            </div>

            {/* Sección: Contacto y Documentación */}
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
                      <CountryCodeSelect
                        value={field.value}
                        onValueChange={field.onChange}
                      />
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

            {/* Sección: Seguridad */}
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
          </div>
        </form>
      </motion.div>
    </div>
  );
}
