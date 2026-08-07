'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createPublishingContract,
  deletePublishingContract,
  fetchMyPublishingContracts,
  updatePublishingContract,
} from '../services/publishing-contracts.client'
import type { CreatePublishingContractInput, UpdatePublishingContractInput } from '../types/publishing-contract.types'

const QUERY_KEY = ['publishing-contracts', 'mine']

export function useMyPublishingContracts() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchMyPublishingContracts,
  })
}

export function useCreatePublishingContract() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreatePublishingContractInput) => createPublishingContract(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Contrato editorial creado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al crear el contrato editorial'),
  })
}

export function useUpdatePublishingContract() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePublishingContractInput }) =>
      updatePublishingContract(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Contrato editorial actualizado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al actualizar el contrato editorial'),
  })
}

export function useDeletePublishingContract() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePublishingContract(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Contrato editorial eliminado')
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Error al eliminar el contrato editorial'),
  })
}
