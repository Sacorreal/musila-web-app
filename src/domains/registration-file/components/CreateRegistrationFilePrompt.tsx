'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FolderPlus, Loader2 } from 'lucide-react'
import { Button } from '@/src/shared/components/UI/button'
import { Checkbox } from '@/src/shared/components/UI/checkbox'
import { Card, CardContent } from '@/src/shared/components/UI/card'
import { useCreateRegistrationFile } from '../hooks/use-registration-file.hooks'
import type { RegistrationProfileKey } from '../types/registration-file.types'

interface Props {
  trackId: string
  trackTitle: string
}

const PROFILE_OPTIONS: { key: RegistrationProfileKey; label: string; description: string }[] = [
  { key: 'SAYCO', label: 'SAYCO', description: 'Sociedad de Autores y Compositores de Colombia' },
  { key: 'DNDA', label: 'DNDA', description: 'Dirección Nacional de Derecho de Autor' },
]

export function CreateRegistrationFilePrompt({ trackId, trackTitle }: Props) {
  const router = useRouter()
  const { mutateAsync, isPending } = useCreateRegistrationFile()
  const [selected, setSelected] = useState<RegistrationProfileKey[]>(['SAYCO'])

  const toggle = (key: RegistrationProfileKey) => {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const handleCreate = async () => {
    await mutateAsync({ trackId, activeProfileKeys: selected })
    router.refresh()
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <FolderPlus className="h-10 w-10 text-primary" />
        <div>
          <h2 className="text-lg font-bold text-foreground">Preparar Expediente de Registro</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Centraliza toda la información de <strong>&quot;{trackTitle}&quot;</strong> para presentarla manualmente
            ante las entidades que elijas. Musila no registra la obra por ti — solo prepara el expediente.
          </p>
        </div>

        <div className="w-full space-y-2 text-left">
          {PROFILE_OPTIONS.map((option) => (
            <label
              key={option.key}
              className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-accent"
            >
              <Checkbox checked={selected.includes(option.key)} onCheckedChange={() => toggle(option.key)} />
              <div>
                <p className="text-sm font-semibold text-foreground">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </label>
          ))}
        </div>

        <Button className="w-full gap-2" disabled={!selected.length || isPending} onClick={handleCreate}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderPlus className="h-4 w-4" />}
          Preparar Expediente
        </Button>
      </CardContent>
    </Card>
  )
}
