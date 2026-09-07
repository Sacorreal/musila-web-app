'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/shared/components/UI/card'
import { Button } from '@/src/shared/components/UI/button'
import { Label } from '@/src/shared/components/UI/label'
import { Input } from '@/src/shared/components/UI/input'
import { useUpdateAffiliateProfile } from '../../hooks/use-affiliate-dashboard.hooks'
import type { AffiliateProfile } from '../../types/affiliate.types'

interface AffiliateProfileFormProps {
  profile: AffiliateProfile
}

export function AffiliateProfileForm({ profile }: AffiliateProfileFormProps) {
  const updateProfile = useUpdateAffiliateProfile()

  const [form, setForm] = useState({
    name: profile.name,
    lastName: profile.lastName,
    phone: profile.phone ?? '',
    companyOrBrand: profile.companyOrBrand ?? '',
    website: profile.website ?? '',
    audienceDescription: profile.audienceDescription ?? '',
    instagram: profile.socialNetworks?.instagram ?? '',
    tiktok: profile.socialNetworks?.tiktok ?? '',
    youtube: profile.socialNetworks?.youtube ?? '',
    paymentPhone: profile.paymentPhone ?? '',
    bankName: profile.bankAccount?.bankName ?? '',
    accountType: profile.bankAccount?.accountType ?? '',
    accountNumber: profile.bankAccount?.accountNumber ?? '',
    accountHolderName: profile.bankAccount?.accountHolderName ?? '',
    accountHolderIdType: profile.bankAccount?.accountHolderIdType ?? '',
    accountHolderIdNumber: profile.bankAccount?.accountHolderIdNumber ?? '',
  })

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const socialNetworks: Record<string, string> = {}
    if (form.instagram) socialNetworks.instagram = form.instagram
    if (form.tiktok) socialNetworks.tiktok = form.tiktok
    if (form.youtube) socialNetworks.youtube = form.youtube

    const hasBankInfo = Boolean(
      form.bankName && form.accountType && form.accountNumber && form.accountHolderName &&
        form.accountHolderIdType && form.accountHolderIdNumber,
    )

    updateProfile.mutate({
      name: form.name,
      lastName: form.lastName,
      phone: form.phone || undefined,
      companyOrBrand: form.companyOrBrand || undefined,
      website: form.website || undefined,
      audienceDescription: form.audienceDescription || undefined,
      socialNetworks: Object.keys(socialNetworks).length > 0 ? socialNetworks : undefined,
      paymentPhone: form.paymentPhone || undefined,
      bankAccount: hasBankInfo
        ? {
            bankName: form.bankName,
            accountType: form.accountType,
            accountNumber: form.accountNumber,
            accountHolderName: form.accountHolderName,
            accountHolderIdType: form.accountHolderIdType,
            accountHolderIdNumber: form.accountHolderIdNumber,
          }
        : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos personales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={form.name} onChange={set('name')} />
            </div>
            <div className="space-y-2">
              <Label>Apellido</Label>
              <Input value={form.lastName} onChange={set('lastName')} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Teléfono</Label>
            <Input value={form.phone} onChange={set('phone')} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Perfil como afiliado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Marca, estudio o academia</Label>
            <Input value={form.companyOrBrand} onChange={set('companyOrBrand')} />
          </div>
          <div className="space-y-2">
            <Label>Sitio web</Label>
            <Input value={form.website} onChange={set('website')} />
          </div>
          <div className="space-y-2">
            <Label>Cómo promocionas Musila</Label>
            <textarea
              value={form.audienceDescription}
              onChange={set('audienceDescription')}
              rows={3}
              className="w-full px-3 py-2 rounded-md bg-background border border-input text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50 resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input value={form.instagram} onChange={set('instagram')} />
            </div>
            <div className="space-y-2">
              <Label>TikTok</Label>
              <Input value={form.tiktok} onChange={set('tiktok')} />
            </div>
            <div className="space-y-2">
              <Label>YouTube</Label>
              <Input value={form.youtube} onChange={set('youtube')} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos de pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nequi / Daviplata</Label>
            <Input value={form.paymentPhone} onChange={set('paymentPhone')} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Banco</Label>
              <Input value={form.bankName} onChange={set('bankName')} />
            </div>
            <div className="space-y-2">
              <Label>Tipo de cuenta</Label>
              <Input value={form.accountType} onChange={set('accountType')} />
            </div>
            <div className="space-y-2">
              <Label>Número de cuenta</Label>
              <Input value={form.accountNumber} onChange={set('accountNumber')} />
            </div>
            <div className="space-y-2">
              <Label>Titular</Label>
              <Input value={form.accountHolderName} onChange={set('accountHolderName')} />
            </div>
            <div className="space-y-2">
              <Label>Tipo de documento</Label>
              <Input value={form.accountHolderIdType} onChange={set('accountHolderIdType')} />
            </div>
            <div className="space-y-2">
              <Label>Número de documento</Label>
              <Input value={form.accountHolderIdNumber} onChange={set('accountHolderIdNumber')} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={updateProfile.isPending} className="w-full sm:w-auto">
        {updateProfile.isPending ? 'Guardando...' : 'Guardar cambios'}
      </Button>
    </form>
  )
}
