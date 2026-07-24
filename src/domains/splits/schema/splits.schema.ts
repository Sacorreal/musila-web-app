import * as z from "zod";
import { CoauthorRole } from "../types/splits.types";

const PERCENTAGE_TOTAL = 100;

export const splitAuthorEntrySchema = z.object({
  userId: z.string().min(1, "Selecciona un coautor"),
  musilaCreatorId: z.string(),
  name: z.string(),
  percentage: z
    .number({ invalid_type_error: "El porcentaje es obligatorio" })
    .min(0.01, "El porcentaje debe ser mayor a 0")
    .max(100, "El porcentaje no puede superar 100"),
  role: z.nativeEnum(CoauthorRole, { errorMap: () => ({ message: "Selecciona un rol" }) }),
});

export const createSplitSchema = z
  .object({
    authors: z.array(splitAuthorEntrySchema).min(1, "Debes agregar al menos un coautor"),
  })
  .refine(
    (data) => {
      const sum = data.authors.reduce((acc, author) => acc + (author.percentage || 0), 0);
      return Math.round(sum * 100) / 100 === PERCENTAGE_TOTAL;
    },
    {
      message: "La suma de los porcentajes debe ser exactamente 100%",
      path: ["authors"],
    },
  );

export type SplitAuthorEntry = z.infer<typeof splitAuthorEntrySchema>;
export type CreateSplitFormValues = z.infer<typeof createSplitSchema>;

export const rejectSplitSchema = z.object({
  reason: z
    .string()
    .min(1, "El motivo del rechazo es obligatorio")
    .max(500, "El motivo no puede superar 500 caracteres"),
});

export type RejectSplitFormValues = z.infer<typeof rejectSplitSchema>;

/** Reparte 100% entre `count` coautores, ajustando el residuo en el último para que la suma sea exacta. */
export function distributeEqualPercentages(count: number): number[] {
  if (count <= 0) return [];
  const base = Math.floor((PERCENTAGE_TOTAL / count) * 100) / 100;
  const percentages = Array(count).fill(base);
  const remainder = Math.round((PERCENTAGE_TOTAL - base * count) * 100) / 100;
  percentages[count - 1] = Math.round((base + remainder) * 100) / 100;
  return percentages;
}
