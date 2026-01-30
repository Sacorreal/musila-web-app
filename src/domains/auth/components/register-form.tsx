"use client";

import { Button } from "@/src/shared/components/UI/button";
import { Input } from "@/src/shared/components/UI/input";
import { Label } from "@/src/shared/components/UI/label";
import { UserRoleRegister } from "@domains/users/types/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/UI/select";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateUserDTO } from "../../users/types/user.type";
import { useRegisterUser } from "../hooks/useRegisterUser";
import {
  registerSchema,
  RegisterUsersFormValues,
} from "../validations/registerUserSchema";
import { CountryCodeSelect } from "./CountryCodeSelect";

export function RegisterForm() {
  const roleOptions = Object.entries(UserRoleRegister).map(([key, value]) => (
    <SelectItem value={key} key={key}>
      {value}
    </SelectItem>
  ));
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<RegisterUsersFormValues>({
    resolver: zodResolver(registerSchema),
  });
  const { registerUser } = useRegisterUser();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: CreateUserDTO) => {
    try {
      await registerUser(data);
      toast.success("Cuenta creada con éxito");
      reset();
      router.push("/music");
    } catch (error) {
      toast.error("Error al iniciar sesión", {
        description:
          error instanceof Error ? error.message : "Erro al crear la cuenta",
      });
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="max-w-full col-span-2">
        <Select {...register("rol")}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>{roleOptions}</SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Primer nombre</Label>
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre"
            required
            disabled={isSubmitting}
            className="bg-card"
            {...register("name")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="artisticName">Segundo Nombre (opcional)</Label>
          <Input id="secondName" disabled={isSubmitting} className="bg-card" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Primer Apellido</Label>
          <Input
            id="lastName"
            placeholder="Tu apellido"
            disabled={isSubmitting}
            className="bg-card"
            {...register("lastName")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondLastName">Segundo Apellido (opcional)</Label>
          <Input
            id="secondLastName"
            type="text"
            disabled={isSubmitting}
            className="bg-card"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Selecciona país:</Label>
          <CountryCodeSelect {...register("countryCode")} />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="celphone">Número celular</Label>
          <Input
            id="celphone"
            required
            type="text"
            disabled={isSubmitting}
            className="bg-card"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          disabled={isSubmitting}
          className="bg-card"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            required
            disabled={isSubmitting}
            className="bg-card pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Repetir Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            required
            disabled={isSubmitting}
            className="bg-card pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          "Crear cuenta"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Al registrarte, aceptas nuestros{" "}
        <a href="/terms" className="text-primary hover:underline">
          Términos de servicio
        </a>{" "}
        y{" "}
        <a href="/privacy" className="text-primary hover:underline">
          Política de privacidad
        </a>
      </p>
    </form>
  );
}
