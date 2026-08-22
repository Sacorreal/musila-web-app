'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/src/shared/components/UI/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/src/shared/components/UI/dialog'
import { SocietyAffiliationFormFields } from './SocietyAffiliationFormFields'

export function SocietyAffiliationForm() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar otra afiliación
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva afiliación</DialogTitle>
          <DialogDescription>
            Selecciona la sociedad de gestión colectiva desde el catálogo controlado — no se admite texto libre.
          </DialogDescription>
        </DialogHeader>

        <SocietyAffiliationFormFields onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
