'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const REFERRAL_COOKIE_NAME = 'musila_ref'
const REFERRAL_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 60 // 60 días

/**
 * Captura el código de referido (?ref=CODE) de cualquier página pública y lo
 * guarda en una cookie de 60 días para atribuir el registro a un afiliado
 * (programa de afiliados). Último clic gana: cada visita con ?ref= sobrescribe
 * la cookie anterior.
 */
export function ReferralCapture() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (!ref) return

    document.cookie = `${REFERRAL_COOKIE_NAME}=${encodeURIComponent(ref)}; max-age=${REFERRAL_COOKIE_MAX_AGE_SECONDS}; path=/`
  }, [searchParams])

  return null
}
