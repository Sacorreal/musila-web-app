"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Wallet2 } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/UI/dialog";
import { Field, FieldError, FieldLabel } from "@/src/shared/components/UI/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/src/shared/components/UI/input-group";
import { createWithdrawalSchema, CreateWithdrawalFormValues } from "../wallet.schema";
import { useBankAccount, useCreateWithdrawal, useWalletBalance } from "../hooks/wallet.hooks";
import { formatCOP } from "../utils/format-currency";

export function CreateWithdrawalDialog() {
  const [open, setOpen] = useState(false);
  const { data: balance } = useWalletBalance();
  const { data: bankAccount } = useBankAccount();
  const { mutate: createWithdrawal, isPending } = useCreateWithdrawal();

  const availableBalance = balance?.availableBalance ?? 0;
  const hasBankAccount = !!bankAccount?.accountNumber;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWithdrawalFormValues>({
    resolver: zodResolver(createWithdrawalSchema),
    mode: "onChange",
  });

  const onSubmit = (values: CreateWithdrawalFormValues) => {
    if (values.amount > availableBalance) return;
    createWithdrawal(values, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" disabled={!hasBankAccount || availableBalance <= 0}>
          <Wallet2 className="h-4 w-4" />
          Retirar fondos
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solicitar retiro de fondos</DialogTitle>
          <DialogDescription>
            Saldo disponible: <strong className="text-foreground">{formatCOP(availableBalance)}</strong>
          </DialogDescription>
        </DialogHeader>

        {!hasBankAccount ? (
          <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-muted-foreground">
            Debes completar tus datos bancarios en Mi Cuenta antes de solicitar un retiro.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Field>
              <FieldLabel htmlFor="amount">Monto a retirar</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>$</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="amount"
                  type="number"
                  step="1"
                  min={1}
                  max={availableBalance}
                  {...register("amount", { valueAsNumber: true })}
                />
              </InputGroup>
              <FieldError errors={[errors.amount]} />
            </Field>

            <DialogFooter>
              <Button type="submit" disabled={isPending} className="gap-2">
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirmar solicitud
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
