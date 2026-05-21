/**
 * blocs.service.js
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { httpClient, queryKeys, buildParams, paginationParams } from 'src/lib/api'

export const useGetBlocs = ({ paginated = false, search = false, pageSize, page } = {}) => {
  const qs = buildParams({ ...paginationParams({ paginated, page, pageSize }), search })
  return useQuery({
    queryKey: queryKeys.blocs.list({ paginated, search, pageSize, page }),
    queryFn:  () => httpClient.get(`blocs${qs}`).then(r => r.data),
  })
}

export const useGetBlocsById = (blocId = '') => {
  return useQuery({
    queryKey: queryKeys.blocs.detail(blocId),
    queryFn:  () => httpClient.get(`blocs/${blocId}`).then(r => r.data),
    enabled:  Boolean(blocId),
  })
}

export const useGetBlocsByResidenceId = ({ residenceId } = {}) => {
  return useQuery({
    queryKey: queryKeys.blocs.byResidence(residenceId),
    queryFn:  () => httpClient.get(`projects/${residenceId}/blocs`).then(r => r.data),
    enabled:  Boolean(residenceId),
  })
}

export function useCreateBloc() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: values => httpClient.post('blocs', values).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.blocs.all })
    },
    onError: err => toast.error(err.message),
  })
}

export function useUpdateBloc() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ data, id }) => httpClient.post(`blocs/${id}?_method=PUT`, data).then(r => r.data),
    onSuccess: (data, { id }) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.blocs.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.blocs.lists() })
    },
    onError: err => toast.error(err.message),
  })
}

export function useDeleteBloc() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }) => httpClient.delete(`blocs/${id}`).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.blocs.all })
    },
    onError: err => toast.error(err.message),
  })
}
