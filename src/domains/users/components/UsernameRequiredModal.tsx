"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/shared/components/UI/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/UI/dialog";
import { useAuthStore } from "@/src/domains/auth/store/use-auth-store";
import type { UserJWTResponse } from "@/src/domains/auth/types/auth.types";
import { usersService } from "../services/users.service";
import { chooseUsernameSchema, type ChooseUsernameFormValues } from "../validations/profile.schema";
import { UsernameField } from "./UsernameField";

interface UsernameRequiredModalProps {
  open: boolean;
}

/**
 * Modal bloqueante (sin botón de cerrar ni cierre por click afuera/Escape):
 * se muestra a usuarios migrados con un username temporal
 * (`usernameIsTemporary: true`) hasta que eligen uno definitivo.
 */
export function UsernameRequiredModal({ open }: UsernameRequiredModalProps) {
  const setUser = useAuthStore((s) => s.setUser);
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit } = useForm<ChooseUsernameFormValues>({
    resolver: zodResolver(chooseUsernameSchema),
    defaultValues: { username: "" },
  });

  const onSubmit = async (values: ChooseUsernameFormValues) => {
    setIsSaving(true);
    try {
      const { data, error } = await usersService.updateMe({ username: values.username } as any);
      if (error) {
        toast.error(error);
        return;
      }
      if (data) {
        setUser(data as unknown as UserJWTResponse);
        toast.success("Nombre de usuario asignado");
      }
    } catch (error: any) {
      toast.error(error?.message || "Ocurrió un error inesperado");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md"
        showCloseButton={false}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        aria-describedby="username-required-description"
      >
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <AtSign className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <DialogTitle className="text-center">Elige tu nombre de usuario</DialogTitle>
          <DialogDescription id="username-required-description" className="text-center">
            Ahora todo usuario de Musila tiene un nombre de usuario propio (@Nombre123), que otros usarán para
            encontrarte y autorizar el acceso a tu contenido. Elige el tuyo para continuar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="username"
            control={control}
            render={({ field, fieldState }) => (
              <UsernameField
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                disabled={isSaving}
              />
            )}
          />
          <Button type="submit" disabled={isSaving} className="w-full">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Guardar y continuar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
