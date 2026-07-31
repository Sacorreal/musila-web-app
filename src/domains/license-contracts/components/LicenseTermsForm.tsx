"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Calendar, Coins, FileSignature, Loader2, Percent, Plus, Trash2 } from "lucide-react";
import { Button } from "@/src/shared/components/UI/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/src/shared/components/UI/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/src/shared/components/UI/input-group";
import { cn } from "@/src/shared/libs/cn";
import { useSplitByTrack } from "@/src/domains/splits/hooks/splits.hooks";
import { TerritorySelector } from "./TerritorySelector";
import { AdvanceDistributionModal } from "./AdvanceDistributionModal";
import {
  distributeInstallmentsEqually,
  licenseTermsSchema,
  LicenseTermsFormValues,
} from "../schema/license-contract.schema";
import {
  useGenerateLicenseContractPreview,
  useUpsertLicenseContractTerms,
} from "../hooks/license-contracts.hooks";
import {
  DISTRIBUTION_FORMAT_LABELS,
  LicenseContractDto,
  LicenseDistributionFormat,
  LicenseTerritoryMode,
} from "../types/license-contract.types";

interface Props {
  requestedTrackId: string;
  trackId: string;
  existingContract?: LicenseContractDto | null;
  onGenerated: (contract: LicenseContractDto) => void;
}

const fmtCOP = (amount: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(amount);

const tomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

export function LicenseTermsForm({ requestedTrackId, trackId, existingContract, onGenerated }: Props) {
  const [distributionModalOpen, setDistributionModalOpen] = useState(false);

  const { data: split } = useSplitByTrack(trackId);
  const coauthors = useMemo(
    () =>
      (split?.authors ?? []).map((a) => ({
        userId: a.user.id,
        name: `${a.user.name} ${a.user.lastName}`,
        royaltyPercentage: Number(a.percentage),
      })),
    [split],
  );
  const hasCoauthors = coauthors.length > 1;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<LicenseTermsFormValues>({
    resolver: zodResolver(licenseTermsSchema),
    mode: "onChange",
    defaultValues: existingContract
      ? {
          validityDate: existingContract.validityDate.slice(0, 10),
          territoryMode: existingContract.territoryMode,
          territoryCountries: existingContract.territoryCountries ?? [],
          advanceAmount: Number(existingContract.advanceAmount),
          advanceInstallmentsCount: existingContract.advanceInstallmentsCount,
          installments: (existingContract.advanceInstallments ?? []).map((i) => ({
            amount: i.amount,
            dueDate: i.dueDate.slice(0, 10),
          })),
          royaltyPercentage: Number(existingContract.royaltyPercentage),
          distributionFormats: existingContract.distributionFormats,
          advanceDistribution: existingContract.advanceDistribution ?? [],
        }
      : {
          validityDate: "",
          territoryMode: LicenseTerritoryMode.GLOBAL,
          territoryCountries: [],
          advanceAmount: 0,
          advanceInstallmentsCount: 1,
          installments: [],
          royaltyPercentage: 0,
          distributionFormats: [],
          advanceDistribution: [],
        },
  });

  const { fields: installmentFields, replace: replaceInstallments } = useFieldArray({
    control,
    name: "installments",
  });

  const advanceAmount = watch("advanceAmount") || 0;
  const advanceInstallmentsCount = watch("advanceInstallmentsCount") || 1;
  const territoryMode = watch("territoryMode");
  const territoryCountries = watch("territoryCountries") ?? [];
  const distributionFormats = watch("distributionFormats") ?? [];
  const advanceDistribution = watch("advanceDistribution") ?? [];
  const validityDate = watch("validityDate");

  const commissionAmount = Math.round(advanceAmount * 0.1);
  const totalPayableByLicensee = advanceAmount + commissionAmount;

  const recalculateInstallments = () => {
    if (advanceAmount <= 0) {
      replaceInstallments([]);
      return;
    }
    const amounts = distributeInstallmentsEqually(advanceAmount, advanceInstallmentsCount);
    const base = validityDate ? new Date(validityDate) : new Date();
    replaceInstallments(
      amounts.map((amount, index) => {
        const dueDate = new Date(base);
        dueDate.setDate(dueDate.getDate() - (amounts.length - index) * 15);
        const safeDate = dueDate.getTime() > Date.now() ? dueDate : new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000);
        return { amount, dueDate: safeDate.toISOString().slice(0, 10) };
      }),
    );
  };

  useEffect(() => {
    if (advanceAmount > 0 && installmentFields.length === 0) {
      recalculateInstallments();
    }
    if (advanceAmount <= 0 && installmentFields.length > 0) {
      replaceInstallments([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advanceAmount]);

  const { mutateAsync: upsertTerms, isPending: isSavingTerms } = useUpsertLicenseContractTerms(requestedTrackId);
  const { mutateAsync: generatePreview, isPending: isGenerating } = useGenerateLicenseContractPreview(
    requestedTrackId,
  );
  const isSubmitting = isSavingTerms || isGenerating;

  const toggleFormat = (format: LicenseDistributionFormat) => {
    const next = distributionFormats.includes(format)
      ? distributionFormats.filter((f) => f !== format)
      : [...distributionFormats, format];
    setValue("distributionFormats", next, { shouldValidate: true });
  };

  const onSubmit = async (values: LicenseTermsFormValues) => {
    if (values.advanceAmount > 0 && hasCoauthors && (!values.advanceDistribution || values.advanceDistribution.length === 0)) {
      toast.error("Debes distribuir el anticipo entre los coautores antes de continuar");
      setDistributionModalOpen(true);
      return;
    }

    try {
      const contract = await upsertTerms({
        validityDate: new Date(values.validityDate).toISOString(),
        territoryMode: values.territoryMode,
        territoryCountries:
          values.territoryMode === LicenseTerritoryMode.SPECIFIC_COUNTRIES ? values.territoryCountries : undefined,
        advanceAmount: values.advanceAmount,
        advanceInstallmentsCount: values.advanceAmount > 0 ? values.advanceInstallmentsCount : 1,
        installments:
          values.advanceAmount > 0
            ? values.installments?.map((i) => ({ amount: i.amount, dueDate: new Date(i.dueDate).toISOString() }))
            : undefined,
        royaltyPercentage: values.royaltyPercentage,
        distributionFormats: values.distributionFormats,
        advanceDistribution:
          values.advanceAmount > 0 && hasCoauthors
            ? values.advanceDistribution?.map((d) => ({ userId: d.userId, percentage: d.percentage }))
            : undefined,
      });

      const finalContract = await generatePreview(contract.id);
      onGenerated(finalContract);
    } catch {
      // El toast de error ya lo maneja cada hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Controller
        name="validityDate"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Vigencia (plazo para asignar el ISRC)
            </FieldLabel>
            <FieldDescription>
              Fecha límite para que el intérprete grabe y asigne el ISRC de la canción. Si se vence sin ISRC
              registrado, pierdes la licencia y puedes ofrecerla a otro intérprete.
            </FieldDescription>
            <input
              {...field}
              type="date"
              min={tomorrow()}
              disabled={isSubmitting}
              className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            />
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="territoryMode"
        control={control}
        render={() => (
          <Field>
            <FieldLabel>Territorio</FieldLabel>
            <TerritorySelector
              mode={territoryMode}
              countries={territoryCountries}
              onModeChange={(mode) => setValue("territoryMode", mode, { shouldValidate: true })}
              onCountriesChange={(countries) => setValue("territoryCountries", countries, { shouldValidate: true })}
              disabled={isSubmitting}
            />
            {errors.territoryCountries && <FieldError errors={[errors.territoryCountries]} />}
          </Field>
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Controller
          name="advanceAmount"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-primary" />
                Anticipo (COP)
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>$</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  type="number"
                  min={0}
                  step="1000"
                  disabled={isSubmitting}
                  value={field.value ?? 0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>COP</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>Déjalo en $0 si no vas a cobrar anticipo por el uso de la canción.</FieldDescription>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="royaltyPercentage"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-primary" />
                Regalía sobre el master
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  disabled={isSubmitting}
                  value={field.value ?? 0}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>%</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      {advanceAmount > 0 && (
        <div className="space-y-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Anticipo pactado (recibe el compositor)</span>
            <span className="font-bold text-foreground">{fmtCOP(advanceAmount)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              Comisión Músila <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-bold text-primary">10%</span>
            </span>
            <span className="font-bold text-foreground">{fmtCOP(commissionAmount)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-primary/20 pt-3">
            <span className="text-xs font-black uppercase tracking-widest text-primary">
              Total que paga el intérprete
            </span>
            <span className="text-xl font-black text-primary">{fmtCOP(totalPayableByLicensee)}</span>
          </div>

          {hasCoauthors && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setDistributionModalOpen(true)}
              disabled={isSubmitting}
              className="w-full gap-2 rounded-xl text-xs font-bold"
            >
              <Coins className="h-4 w-4" />
              {advanceDistribution.length > 0 ? "Editar reparto entre coautores" : "Distribuir anticipo entre coautores"}
            </Button>
          )}
          {errors.advanceDistribution && <FieldError errors={[errors.advanceDistribution as any]} />}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Controller
                name="advanceInstallmentsCount"
                control={control}
                render={({ field }) => (
                  <Field className="w-40">
                    <FieldLabel className="text-xs">Número de cuotas</FieldLabel>
                    <input
                      type="number"
                      min={1}
                      disabled={isSubmitting}
                      value={field.value}
                      onChange={(e) => field.onChange(Math.max(1, Number(e.target.value)))}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </Field>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={recalculateInstallments}
                disabled={isSubmitting}
                className="mt-5 gap-1.5 text-xs font-bold"
              >
                <Plus className="h-3.5 w-3.5" />
                Recalcular cuotas
              </Button>
            </div>

            {installmentFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-2 gap-3">
                <Controller
                  name={`installments.${index}.amount`}
                  control={control}
                  render={({ field: f }) => (
                    <Field>
                      <FieldLabel className="text-xs">Cuota {index + 1}</FieldLabel>
                      <InputGroup>
                        <InputGroupAddon>
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          type="number"
                          min={0}
                          disabled={isSubmitting}
                          value={f.value ?? 0}
                          onChange={(e) => f.onChange(Number(e.target.value))}
                        />
                      </InputGroup>
                    </Field>
                  )}
                />
                <Controller
                  name={`installments.${index}.dueDate`}
                  control={control}
                  render={({ field: f }) => (
                    <Field>
                      <FieldLabel className="text-xs">Fecha de pago</FieldLabel>
                      <input
                        {...f}
                        type="date"
                        min={tomorrow()}
                        disabled={isSubmitting}
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </Field>
                  )}
                />
              </div>
            ))}
            {errors.installments && (
              <FieldError errors={[errors.installments as any]} />
            )}
          </div>
        </div>
      )}

      <Field>
        <FieldLabel>Formato de distribución autorizado</FieldLabel>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {Object.values(LicenseDistributionFormat).map((format) => {
            const checked = distributionFormats.includes(format);
            return (
              <button
                key={format}
                type="button"
                role="checkbox"
                aria-checked={checked}
                disabled={isSubmitting}
                onClick={() => toggleFormat(format)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border-2 px-3 h-11 text-sm font-bold transition-all disabled:opacity-50",
                  checked ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40",
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                    checked ? "border-primary bg-primary text-primary-foreground" : "border-input",
                  )}
                >
                  {checked && <FileSignature className="h-2.5 w-2.5" />}
                </span>
                {DISTRIBUTION_FORMAT_LABELS[format]}
              </button>
            );
          })}
        </div>
        {errors.distributionFormats && <FieldError errors={[errors.distributionFormats]} />}
      </Field>

      <Button type="submit" disabled={!isValid || isSubmitting} className="w-full gap-2 rounded-xl h-12 font-black">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSignature className="h-4 w-4" />}
        {isSubmitting ? "Generando documento..." : "Generar contrato y enviar a firma"}
      </Button>

      <AdvanceDistributionModal
        isOpen={distributionModalOpen}
        onClose={() => setDistributionModalOpen(false)}
        coauthors={coauthors}
        advanceAmount={advanceAmount}
        value={advanceDistribution}
        onSave={(entries) => setValue("advanceDistribution", entries, { shouldValidate: true })}
      />
    </form>
  );
}
