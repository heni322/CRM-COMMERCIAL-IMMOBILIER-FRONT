/**
 * documents.service.js — file/document viewing & deletion
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { httpClient, queryKeys } from 'src/lib/api'

export const useGetDocumentsById = (documentId = '') => {
  return useQuery({
    queryKey: queryKeys.offers.detail(documentId),
    queryFn:  () => httpClient.get(`documents/${documentId}`).then(r => r.data),
    enabled:  Boolean(documentId),
  })
}

export const useDownloadDocument = (documentId = '') => {
  return useQuery({
    queryKey: ['documents-download', documentId],
    queryFn:  () => httpClient.get(`files/document/${documentId}/download`).then(r => r.data),
    enabled:  Boolean(documentId),
  })
}

export function useDeleteImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: id => httpClient.delete(`files/image/${id}`).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.residences.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
    },
    onError: err => toast.error(err.message),
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: id => httpClient.delete(`files/document/${id}`).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.residences.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
    },
    onError: err => toast.error(err.message),
  })
}
