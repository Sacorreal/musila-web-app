'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateUserProfile } from './admin-user-profile.client'
import type { UpdateUserProfileInput } from './admin-user-profile.types'

export function useUpdateUserProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserProfileInput }) => updateUserProfile(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('Perfil actualizado correctamente')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Error al actualizar el perfil')
    },
  })
}

export const adminUserProfileHooks = {
  useUpdateUserProfile,
}
