'use client'

import { useState } from 'react'
import { Copy, Check, Link2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/UI/card'
import { Button } from '@/src/shared/components/UI/button'

interface ReferralLinkCardProps {
  referralLink: string
  referralCode: string
}

export function ReferralLinkCard({ referralLink, referralCode }: ReferralLinkCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast.success('Enlace copiado al portapapeles')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('No se pudo copiar el enlace')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Link2 className="w-4 h-4 text-primary" />
          Tu enlace de referido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground font-mono truncate">
            {referralLink}
          </div>
          <Button onClick={handleCopy} className="shrink-0" variant={copied ? 'secondary' : 'default'}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" /> Copiado
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" /> Copiar
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Código: <span className="font-mono font-semibold text-foreground">{referralCode}</span> ·
          Comparte este enlace para que tus referidos queden atribuidos a tu cuenta por 60 días.
        </p>
      </CardContent>
    </Card>
  )
}
