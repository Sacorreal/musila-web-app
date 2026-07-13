"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmailRequest } from "@/src/domains/auth/services/auth.actions";

export type EmailVerificationStatus = "loading" | "success" | "error";

export function useEmailVerification() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<EmailVerificationStatus>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("El enlace de verificación no es válido o está incompleto.");
      return;
    }

    verifyEmailRequest(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.message);
      })
      .catch((err: Error) => {
        setStatus("error");
        setMessage(err.message || "El enlace es inválido o ha expirado.");
      });
  }, [token]);

  return { status, message };
}
