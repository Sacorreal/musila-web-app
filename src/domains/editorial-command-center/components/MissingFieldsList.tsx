import { CheckCircle2, XCircle } from "lucide-react";
import type { HealthScoreField } from "../types/editorial-command-center.types";

interface MissingFieldsListProps {
  fields: HealthScoreField[];
  warning?: string;
}

/** Detalle campo a campo de una categoría (Flow 2, paso 4: clic en categoría para ver qué falta). */
export function MissingFieldsList({ fields, warning }: MissingFieldsListProps) {
  if (warning) {
    return <p className="text-sm text-amber-600 dark:text-amber-400">{warning}</p>;
  }

  if (!fields.length) {
    return <p className="text-sm text-muted-foreground">Sin campos evaluados para esta categoría.</p>;
  }

  return (
    <ul className="space-y-1.5">
      {fields.map((field) => (
        <li key={field.key} className="flex items-center gap-2 text-sm">
          {field.completed ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0 text-rose-500" aria-hidden="true" />
          )}
          <span className={field.completed ? "text-foreground" : "text-muted-foreground"}>{field.label}</span>
        </li>
      ))}
    </ul>
  );
}
