import * as z from "zod";
import { MusicRole } from "@/src/domains/users/types/user.types";

export const profileSchema = z
  .object({
    name: z.string().min(2, "El nombre es demasiado corto"),
    secondName: z.string().optional(),
    lastName: z.string().min(2, "El apellido es demasiado corto"),
    username: z
      .string()
      .trim()
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
      .max(20, "El nombre de usuario no puede superar los 20 caracteres")
      .regex(/^[A-Za-z0-9_]+$/, "Solo letras, números y guion bajo, sin espacios"),
    secondLastName: z.string().optional(),
    biography: z.string().max(500, "La biografía no puede superar los 500 caracteres").optional(),
    phone: z.string().optional(),
    countryCode: z.string().optional(),
    typeCitizenID: z.string().optional(),
    citizenID: z.string().optional(),
    role: z.nativeEnum(MusicRole, {
      errorMap: () => ({ message: "El rol es obligatorio" }),
    }),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.password && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    },
  );

export type ProfileFormValues = z.infer<typeof profileSchema>;

/** Usado por el modal bloqueante que fuerza a los usuarios migrados a elegir su username definitivo. */
export const chooseUsernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(20, "El nombre de usuario no puede superar los 20 caracteres")
    .regex(/^[A-Za-z0-9_]+$/, "Solo letras, números y guion bajo, sin espacios"),
});

export type ChooseUsernameFormValues = z.infer<typeof chooseUsernameSchema>;
