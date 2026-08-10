'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OrganizationState {
  /** Organización activa del workspace B2B; viaja como header `x-organization-id`. */
  activeOrganizationId: string | null
  setActiveOrganization: (organizationId: string | null) => void
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set) => ({
      activeOrganizationId: null,
      setActiveOrganization: (organizationId) => set({ activeOrganizationId: organizationId }),
    }),
    { name: 'organization-storage' },
  ),
)
