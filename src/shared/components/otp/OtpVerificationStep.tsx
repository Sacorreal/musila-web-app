"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail, RotateCw, ShieldCheck, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/shared/components/UI/button";
import { cn } from "@/src/shared/libs/cn";
import { useRequestOtp, useVerifyOtp } from "@/src/domains/otp/hooks/otp.hooks";
import { otpCodeSchema, OTP_CODE_LENGTH, type OtpCodeInput } from "@/src/domains/otp/schema/otp.schema";
import { OtpChannel, OtpPurpose } from "@/src/domains/otp/types/otp.types";

const RESEND_COOLDOWN_SECONDS = 30;

const CHANNEL_COPY: Record<OtpChannel, { icon: React.ReactNode; label: string }> = {
  email: { icon: <Mail size={14} />, label: "Te enviamos un código a tu correo electrónico" },
  push: { icon: <Smartphone size={14} />, label: "Revisa tus notificaciones, te enviamos un código" },
  sms: { icon: <Smartphone size={14} />, label: "Te enviamos un código por SMS" },
};

interface Props {
  purpose: OtpPurpose;
  entityId: string;
  active: boolean;
  onVerified: () => void;
  onBack: () => void;
  title?: string;
  description?: string;
  /** Cuando es `true`, reemplaza el formulario por un spinner (acción posterior en curso). */
  isProcessing?: boolean;
}

export function OtpVerificationStep({
  purpose,
  entityId,
  active,
  onVerified,
  onBack,
  title = "Verificación requerida",
  description = "Confirma el código para continuar con esta acción.",
  isProcessing = false,
}: Props) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_CODE_LENGTH).fill(""));
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const hasRequestedRef = useRef(false);

  const { mutate: requestOtpMutate, data: requestData, isPending: isRequesting, error: requestError } = useRequestOtp();
  const { mutate: verifyOtpMutate, isPending: isVerifying } = useVerifyOtp();

  const {
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OtpCodeInput>({
    resolver: zodResolver(otpCodeSchema),
    mode: "onChange",
    defaultValues: { code: "" },
  });

  const fireRequest = () => {
    requestOtpMutate(
      { purpose, entityId },
      {
        onError: (err: any) => {
          toast.error(err?.response?.data?.message ?? "No se pudo enviar el código");
        },
      },
    );
    setCooldown(RESEND_COOLDOWN_SECONDS);
  };

  useEffect(() => {
    if (active && !hasRequestedRef.current) {
      hasRequestedRef.current = true;
      fireRequest();
    }
    if (!active) {
      hasRequestedRef.current = false;
      setDigits(Array(OTP_CODE_LENGTH).fill(""));
      reset({ code: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const updateDigits = (next: string[]) => {
    setDigits(next);
    setValue("code", next.join(""), { shouldValidate: true });
  };

  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    updateDigits(next);
    if (clean && index < OTP_CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_CODE_LENGTH).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    updateDigits(next);
    inputsRef.current[Math.min(pasted.length, OTP_CODE_LENGTH - 1)]?.focus();
  };

  const onSubmit = (values: OtpCodeInput) => {
    verifyOtpMutate(
      { purpose, entityId, code: values.code },
      {
        onSuccess: () => onVerified(),
        onError: (err: any) => {
          const message = err?.response?.data?.message ?? "Código incorrecto";
          toast.error(message);
          updateDigits(Array(OTP_CODE_LENGTH).fill(""));
          inputsRef.current[0]?.focus();
        },
      },
    );
  };

  const channel = requestData?.channel;

  return (
    <motion.div
      key="otp"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex flex-col gap-5"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-base font-black text-foreground tracking-tight">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      {isProcessing ? (
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-sm text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          Procesando, un momento...
        </div>
      ) : isRequesting && !requestData ? (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Enviando código...
        </div>
      ) : requestError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          No se pudo enviar el código. Intenta de nuevo.
        </div>
      ) : (
        <>
          {channel && (
            <div className="flex items-center gap-2 rounded-xl bg-muted/40 border border-border/50 px-3 py-2 text-xs font-medium text-muted-foreground">
              {CHANNEL_COPY[channel].icon}
              {CHANNEL_COPY[channel].label}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <div className="flex justify-center gap-3" role="group" aria-label="Código de verificación">
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  aria-label={`Dígito ${i + 1} de ${OTP_CODE_LENGTH}`}
                  aria-invalid={Boolean(errors.code)}
                  className={cn(
                    "w-12 h-14 rounded-xl border text-center text-xl font-black bg-background",
                    "outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring",
                    errors.code ? "border-destructive" : "border-input",
                  )}
                  disabled={isVerifying}
                />
              ))}
            </div>

            {errors.code && (
              <p className="text-center text-xs font-medium text-destructive" role="alert">
                {errors.code.message}
              </p>
            )}

            <div className="flex flex-col items-center gap-3">
              <Button type="submit" disabled={isVerifying} className="w-full h-12 rounded-xl font-black">
                {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck size={16} />}
                {isVerifying ? "Verificando..." : "Verificar código"}
              </Button>

              <div className="flex items-center justify-between w-full text-xs">
                <button
                  type="button"
                  onClick={onBack}
                  disabled={isVerifying}
                  className="flex items-center gap-1 font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                >
                  <ArrowLeft size={14} />
                  Volver
                </button>
                <button
                  type="button"
                  onClick={fireRequest}
                  disabled={cooldown > 0 || isRequesting}
                  className="flex items-center gap-1 font-bold text-primary hover:text-primary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RotateCw size={14} />
                  {cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar código"}
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </motion.div>
  );
}
