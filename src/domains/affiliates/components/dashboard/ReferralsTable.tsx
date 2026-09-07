import type { AffiliateReferralSummary } from '../../types/affiliate-dashboard.types'

interface ReferralsTableProps {
  referrals: AffiliateReferralSummary[]
}

export function ReferralsTable({ referrals }: ReferralsTableProps) {
  if (referrals.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-muted-foreground">
        Aún no tienes referidos. Comparte tu enlace para empezar a generar ventas.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th className="py-3 px-4 sm:px-2 font-semibold">Nombre</th>
            <th className="py-3 px-4 sm:px-2 font-semibold">Correo</th>
            <th className="py-3 px-4 sm:px-2 font-semibold">Registrado</th>
            <th className="py-3 px-4 sm:px-2 font-semibold text-right">Estado</th>
          </tr>
        </thead>
        <tbody>
          {referrals.map((referral) => (
            <tr key={referral.userId} className="border-b border-border/50 last:border-0">
              <td className="py-3 px-4 sm:px-2 font-medium text-foreground">{referral.firstName}</td>
              <td className="py-3 px-4 sm:px-2 text-muted-foreground">{referral.emailMasked}</td>
              <td className="py-3 px-4 sm:px-2 text-muted-foreground">
                {new Date(referral.registeredAt).toLocaleDateString('es-CO')}
              </td>
              <td className="py-3 px-4 sm:px-2 text-right">
                <span
                  className={
                    referral.converted
                      ? 'inline-flex px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-semibold'
                      : 'inline-flex px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border text-xs font-semibold'
                  }
                >
                  {referral.converted ? 'Convertido' : 'Sin compra'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
