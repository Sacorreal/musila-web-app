"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import type { UserJWTResponse } from "@/src/domains/auth/types/auth.types";
import { usersService } from "@/src/domains/users/services/users.service";
import { useUploadStorage } from "@/src/domains/storage/hooks/use-upload-storage";
import { StorageFolder, UploadField } from "@/src/domains/storage/types/storage.types";
import { profileSchema, type ProfileFormValues } from "@/src/domains/users/validations/profile.schema";
import { MUSIC_ROLE_LABELS } from "@/src/domains/users/types/user.types";
import { ProfileHeader } from "@/src/domains/users/components/ProfileHeader";
import { ProfileAvatarCard } from "@/src/domains/users/components/ProfileAvatarCard";
import { ProfilePersonalInfoSection } from "@/src/domains/users/components/ProfilePersonalInfoSection";
import { ProfileContactSection } from "@/src/domains/users/components/ProfileContactSection";
import { ProfileSecuritySection } from "@/src/domains/users/components/ProfileSecuritySection";

export function ProfileForm() {
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
        role: user.role,
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
        const result = await uploadStorage.mutateAsync([
          {
            field: "avatar" as UploadField,
            file: avatarFile,
            folder: StorageFolder.USER_AVATAR,
          },
        ]);

        const avatarUpload = result.find((r) => r.field === "avatar");
        if (avatarUpload) {
          avatarData = {
            avatarUrl: avatarUpload.publicUrl,
            avatarKey: avatarUpload.key,
          };
        }
      }

      // 2. Preparar el resto de los datos
      const { confirmPassword, ...updateData } = values;
      if (!updateData.password) delete updateData.password;

      // 3. Enviar todo al backend en una sola petición
      const { data, error } = await usersService.updateMe({
        ...updateData,
        ...avatarData,
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
        <ProfileHeader
          onSave={handleSubmit(onSubmit)}
          isSaving={isSaving}
          canSave={!isSaving && (isDirty || !!avatarPreview)}
        />

        <form className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-8">
            <ProfileAvatarCard
              name={user?.name}
              lastName={user?.lastName}
              role={user?.role ? MUSIC_ROLE_LABELS[user.role] : undefined}
              avatarPreview={avatarPreview}
              uploadProgress={uploadStorage.progresses["avatar"] ?? 0}
              onAvatarChange={onAvatarChange}
              register={register}
              errors={errors}
            />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <ProfilePersonalInfoSection register={register} control={control} errors={errors} email={user?.email} />
            <ProfileContactSection register={register} control={control} />
            <ProfileSecuritySection register={register} errors={errors} />
          </div>
        </form>
      </motion.div>
    </div>
  );
}
