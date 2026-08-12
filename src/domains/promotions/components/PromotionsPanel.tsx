'use client'

import { Megaphone, ListChecks } from 'lucide-react'
import { PageHeader } from '@/src/shared/components/UI/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/shared/components/UI/tabs'
import { PautarFlow } from './PautarFlow'
import { MisPautasPanel } from './MisPautasPanel'

/** Panel de pautas del publisher: crear nuevas (Pautar) y gestionar las propias. */
export function PromotionsPanel() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pautas"
        description="Destaca los tracks y compositores de tu roster en la plataforma."
      />

      <Tabs defaultValue="pautar">
        <TabsList>
          <TabsTrigger value="pautar" className="gap-2">
            <Megaphone className="h-4 w-4" aria-hidden /> Pautar
          </TabsTrigger>
          <TabsTrigger value="mine" className="gap-2">
            <ListChecks className="h-4 w-4" aria-hidden /> Mis pautas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pautar" className="mt-6">
          <PautarFlow />
        </TabsContent>
        <TabsContent value="mine" className="mt-6">
          <MisPautasPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
