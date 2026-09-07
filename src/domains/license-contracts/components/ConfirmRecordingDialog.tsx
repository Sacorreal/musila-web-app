"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Disc3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/shared/components/UI/dialog";
import { Button } from "@/src/shared/components/UI/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/src/shared/components/UI/field";
import { confirmRecordingSchema, ConfirmRecordingFormValues } from "../schema/license-contract.schema";
import { useConfirmLicenseRecording } from "../hooks/license-contracts.hooks";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  requestedTrackId: string;
  contractId: string;
}

const EMPTY_VALUES: ConfirmRecordingFormValues = {
  isrc: "",
  upc: "",
  mainArtistName: "",
  albumOrEpName: "",
  releaseDate: "",
};

const INPUT_CLASSES =
  "flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

export function ConfirmRecordingDialog({ isOpen, onClose, requestedTrackId, contractId }: Props) {
  const { mutate, isPending } = useConfirmLicenseRecording(requestedTrackId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConfirmRecordingFormValues>({
    resolver: zodResolver(confirmRecordingSchema),
    mode: "onChange",
    defaultValues: EMPTY_VALUES,
  });

  const handleClose = () => {
    if (isPending) return;
    reset(EMPTY_VALUES);
    onClose();
  };

  const onSubmit = (values: ConfirmRecordingFormValues) => {
    mutate({ contractId, ...values }, { onSuccess: handleClose });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Disc3 className="h-5 w-5 text-primary" />
            Confirmar datos de la grabación
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          La vigencia de esta licencia venció. Si la canción ya fue lanzada, completa los datos del fonograma para
          dar la licencia por cumplida. Esta información se registra en el expediente del track.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Field data-invalid={!!errors.isrc}>
            <FieldLabel>ISRC</FieldLabel>
            <input
              {...register("isrc")}
              placeholder="US-ABC-27-00001"
              disabled={isPending}
              className={`${INPUT_CLASSES} font-semibold uppercase`}
            />
            <FieldDescription>Código único asignado a la grabación resultante.</FieldDescription>
            {errors.isrc && <FieldError errors={[errors.isrc]} />}
          </Field>

          <Field data-invalid={!!errors.upc}>
            <FieldLabel>UPC (opcional)</FieldLabel>
            <input
              {...register("upc")}
              placeholder="0885150000000"
              disabled={isPending}
              className={`${INPUT_CLASSES} font-semibold`}
            />
            <FieldDescription>Código universal del lanzamiento. Puede omitirse en sencillos sin álbum.</FieldDescription>
            {errors.upc && <FieldError errors={[errors.upc]} />}
          </Field>

          <Field data-invalid={!!errors.mainArtistName}>
            <FieldLabel>Nombre del artista principal</FieldLabel>
            <input
              {...register("mainArtistName")}
              placeholder="Ej. Karol G"
              disabled={isPending}
              className={INPUT_CLASSES}
            />
            {errors.mainArtistName && <FieldError errors={[errors.mainArtistName]} />}
          </Field>

          <Field data-invalid={!!errors.albumOrEpName}>
            <FieldLabel>Nombre del álbum o EP</FieldLabel>
            <input
              {...register("albumOrEpName")}
              placeholder="Ej. Mañana Será Bonito"
              disabled={isPending}
              className={INPUT_CLASSES}
            />
            {errors.albumOrEpName && <FieldError errors={[errors.albumOrEpName]} />}
          </Field>

          <Field data-invalid={!!errors.releaseDate}>
            <FieldLabel>Fecha de lanzamiento</FieldLabel>
            <input
              {...register("releaseDate")}
              type="date"
              disabled={isPending}
              className={INPUT_CLASSES}
            />
            {errors.releaseDate && <FieldError errors={[errors.releaseDate]} />}
          </Field>

          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isPending} className="rounded-xl font-bold">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1 gap-2 rounded-xl font-bold">
              <CheckCircle2 className="h-4 w-4" />
              Confirmar grabación
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
