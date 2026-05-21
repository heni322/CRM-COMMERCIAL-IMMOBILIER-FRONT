/**
 * client.service.js
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { httpClient, queryKeys } from 'src/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const useGetClientNatures = () => {
  return useQuery({
    queryKey: queryKeys.clients.natures(),
    queryFn:  () => httpClient.get('client/natures').then(r => r.data),
  })
}

export const useToggleActiveClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }) => httpClient.put(`clients/${id}/disable`).then(r => r.data),
    onSuccess: (data, { id }) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.lists() })
    },
    onError: err => toast.error(err.message),
  })
}

export const useDeleteClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }) => httpClient.delete(`clients/${id}`).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
    },
    onError: err => toast.error(err.message),
  })
}

export function useUploadDocuments() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ values, clientID }) => httpClient.post(`clients/${clientID}/documents`, values).then(r => r.data),
    onSuccess: (data, { clientID }) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.documents(clientID) })
    },
    onError: err => toast.error(err.message),
  })
}

export function useGetClientDocuments(clientID) {
  return useQuery({
    queryKey: queryKeys.clients.documents(clientID),
    queryFn:  () => httpClient.get(`clients/${clientID}/documents`).then(r => r.data),
    enabled:  Boolean(clientID),
  })
}

export function useDeleteClientDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }) => httpClient.delete(`clients/documents/${id}`).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
    },
    onError: err => toast.error(err.message),
  })
}

export function useDownloadAllDocuments(id) {
  window.open(`${BASE_URL}/clients/${id}/download-all-documents`, '_blank')
}
