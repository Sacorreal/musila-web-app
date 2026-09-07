"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Coins } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/shared/components/UI/dialog";
import { Button } from "@/src/shared/components/UI/button";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/src/shared/components/UI/input-group";
import { cn } from "@/src/shared/libs/cn";
import { LicenseAdvanceDistributionEntry, SplitCoauthorForDistribution } from "../types/license-contract.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  coauthors: SplitCoauthorForDistribution[];
  advanceAmount: number;
  value: LicenseAdvanceDistributionEntry[];
  onSave: (entries: LicenseAdvanceDistributionEntry[]) => void;
}

const fmtCOP = (amount: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(amount);

export function AdvanceDistributionModal({ isOpen, onClose, coauthors, advanceAmount, value, onSave }: Props) {
  const [entries, setEntries] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isOpen) return;
    const initial: Record<string, number> = {};
    coauthors.forEach((c) => {
      const existing = value.find((v) => v.userId === c.userId);
      initial[c.userId] = existing ? existing.percentage : c.royaltyPercentage;
    });
    setEntries(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const sum = Object.values(entries).reduce((acc, v) => acc + (Number(v) || 0), 0);
  const sumRounded = Math.round(sum * 100) / 100;
  const sumIsValid = sumRounded === 100;

  const handleSave = () => {
    onSave(coauthors.map((c) => ({ userId: c.userId, percentage: Number(entries[c.userId]) || 0 })));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Distribuir el anticipo entre coautores
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Indica qué porcentaje del anticipo de {fmtCOP(advanceAmount)} recibirá cada coautor. Es información
          contractual; el reparto físico del pago sigue siendo un proceso manual entre ustedes.
        </p>

        <div className="space-y-3">
          {coauthors.map((coauthor) => (
            <div key={coauthor.userId} className="flex items-center justify-between gap-3 rounded-xl border bg-muted/10 p-3">
              <span className="min-w-0 truncate font-semibold text-foreground">{coauthor.name}</span>
              <InputGroup className="w-28 shrink-0">
                <InputGroupInput
                  type="number"
                  step="0.01"
                  min={0}
                  max={100}
                  value={entries[coauthor.userId] ?? ""}
                  onChange={(e) =>
                    setEntries((prev) => ({ ...prev, [coauthor.userId]: Number(e.target.value) }))
                  }
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>%</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
          ))}
        </div>

        <div
          className={cn(
            "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold",
            sumIsValid
              ? "border-emerald-200 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30"
              : "border-red-200 bg-red-500/10 text-red-700 dark:border-red-500/30",
          )}
        >
          {sumIsValid ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          Suma: {sumRounded}%
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold">
            Cancelar
          </Button>
          <Button type="button" disabled={!sumIsValid} onClick={handleSave} className="flex-1 rounded-xl font-bold">
            Guardar reparto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
