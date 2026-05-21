/**
 * pieces.service.js
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { httpClient, queryKeys } from 'src/lib/api'

export const useGetPieces = () => {
  return useQuery({
    queryKey: queryKeys.pieces.list(),
    queryFn:  () => httpClient.get('pieces').then(r => r.data),
  })
}

export function useCreatePiece() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: values => httpClient.post('pieces', values).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.pieces.all })
    },
    onError: err => toast.error(err.message),
  })
}

export function useDeletePiece() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ entitled }) => httpClient.delete(`pieces/${entitled}`).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.pieces.all })
    },
    onError: err => toast.error(err.message),
  })
}
