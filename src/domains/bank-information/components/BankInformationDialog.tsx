"use client";

import { useState } from "react";
import { Landmark } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/UI/dialog";
import { RadioGroup, RadioGroupItem } from "@/src/shared/components/UI/radio-group";
import { FieldLabel } from "@/src/shared/components/UI/field";
import { BankInformationMethodOption } from "../bank-information.schema";
import { PendingBankInformationRequestDto } from "../types/bank-information.types";
import { ColombiaBankInformationForm } from "./ColombiaBankInformationForm";
import { ForeignBankInformationForm } from "./ForeignBankInformationForm";

interface Props {
  open: boolean;
  request?: PendingBankInformationRequestDto | null;
  onCompleted: () => void;
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
});

/**
 * Modal no descartable mientras el registro esté pendiente en BD (sin
 * ESC/click-afuera): no bloquea la venta (el contrato ya quedó firmado), solo
 * insiste hasta que el usuario configure su cobro. Reaparece en cada carga de
 * página mientras `useBankInformationPendingStatus` siga reportando `pending`.
 */
export function BankInformationDialog({ open, request, onCompleted }: Props) {
  const [method, setMethod] = useState<BankInformationMethodOption>("colombia");

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-lg"
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        aria-describedby="bank-information-description"
      >
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Landmark className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <DialogTitle className="text-center">Configura tu información bancaria</DialogTitle>
          <DialogDescription id="bank-information-description" className="text-center">
            {request
              ? `Tienes un anticipo de ${CURRENCY_FORMATTER.format(request.advanceAmount)} por "${request.trackTitle}". Configura tu información bancaria para poder cobrarlo.`
              : "Configura tu información bancaria para poder cobrar los anticipos de tus licencias."}
          </DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={method}
          onValueChange={(value) => setMethod(value as BankInformationMethodOption)}
          className="grid grid-cols-2 gap-3"
        >
          <FieldLabel htmlFor="method-colombia">
            <RadioGroupItem id="method-colombia" value="colombia" />
            Colombia (Wompi)
          </FieldLabel>
          <FieldLabel htmlFor="method-foreign">
            <RadioGroupItem id="method-foreign" value="foreign" />
            Extranjero (Global66)
          </FieldLabel>
        </RadioGroup>

        {method === "colombia" ? (
          <ColombiaBankInformationForm requestId={request?.requestId} onSuccess={onCompleted} />
        ) : (
          <ForeignBankInformationForm requestId={request?.requestId} onSuccess={onCompleted} />
        )}
      </DialogContent>
    </Dialog>
  );
}
