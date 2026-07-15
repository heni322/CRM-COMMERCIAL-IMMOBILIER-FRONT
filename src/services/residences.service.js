/**
 * residences.service.js  (Projects)
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { httpClient, queryKeys, buildParams, paginationParams } from 'src/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const useGetResidences = ({ paginated = false, search = false, pageSize, page } = {}) => {
  const qs = buildParams({ ...paginationParams({ paginated, page, pageSize }), search })
  
return useQuery({
    queryKey: queryKeys.residences.list({ paginated, search, pageSize, page }),
    queryFn:  () => httpClient.get(`projects${qs}`).then(r => r.data),
  })
}

export const useGetResidencesById = ({ residenceId = '' } = {}) => {
  return useQuery({
    queryKey: queryKeys.residences.detail(residenceId),
    queryFn:  () => httpClient.get(`projects/${residenceId}`).then(r => r.data),
    enabled:  Boolean(residenceId),
  })
}

export const useGetResidenceBlocs = ({ residenceId = '' } = {}) => {
  return useQuery({
    queryKey: queryKeys.residences.blocs(residenceId),
    queryFn:  () => httpClient.get(`projects/${residenceId}/blocs`).then(r => r.data),
    enabled:  Boolean(residenceId),
  })
}

export const useGetResidenceProperties = ({ residenceId = '' } = {}) => {
  return useQuery({
    queryKey: queryKeys.residences.properties(residenceId),
    queryFn:  () => httpClient.get(`projects/${residenceId}/properties`).then(r => r.data),
    enabled:  Boolean(residenceId),
  })
}

export const useGetResidenceImages = ({ residenceId = '' } = {}) => {
  return useQuery({
    queryKey: queryKeys.residences.images(residenceId),
    queryFn:  () => httpClient.get(`projects/${residenceId}/images`).then(r => r.data),
    enabled:  Boolean(residenceId),
  })
}

export const useGetResidenceDocuments = ({ residenceId = '' } = {}) => {
  return useQuery({
    queryKey: queryKeys.residences.documents(residenceId),
    queryFn:  () => httpClient.get(`projects/${residenceId}/documents`).then(r => r.data),
    enabled:  Boolean(residenceId),
  })
}

export function useCreateResidence() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: values => httpClient.post('projects', values).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.residences.all })
    },
    onError: err => toast.error(err.message),
  })
}

export function useUpdateResidence() {
  const queryClient = useQueryClient()
  
return useMutation({
    // POST + _method=PUT because FormData (file uploads) cannot use PUT directly
    mutationFn: ({ values, id }) => httpClient.post(`projects/${id}?_method=PUT`, values).then(r => r.data),
    onSuccess: (data, { id }) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.residences.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.residences.lists() })
    },
    onError: err => toast.error(err.message),
  })
}

export function useDeleteResidence() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: ({ id }) => httpClient.delete(`projects/${id}`).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.residences.all })
    },
    onError: err => toast.error(err.message),
  })
}

export function useAvailableResidence() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: ({ values, id }) => httpClient.post(`projects/${id}/availibility?_method=PUT`, values).then(r => r.data),
    onSuccess: (data, { id }) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.residences.detail(id) })
    },
    onError: err => toast.error(err.message),
  })
}

export function useUpdateStateResidence() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: ({ values, id }) => httpClient.post(`projects/${id}/change/state?_method=PUT`, values).then(r => r.data),
    onSuccess: (data, { id }) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.residences.detail(id) })
    },
    onError: err => toast.error(err.message),
  })
}

export function useUploadDocuments() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: ({ values, residenceId }) => httpClient.post(`projects/${residenceId}/documents`, values).then(r => r.data),
    onSuccess: (data, { residenceId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.residences.documents(residenceId) })
    },
    onError: err => toast.error(err.message),
  })
}

export function useUploadImages() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: ({ values, residenceId }) => httpClient.post(`projects/${residenceId}/images`, values).then(r => r.data),
    onSuccess: (data, { residenceId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.residences.images(residenceId) })
    },
    onError: err => toast.error(err.message),
  })
}

export function useDeleteImage() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: id => httpClient.delete(`files/image/${id}`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.residences.all }),
    onError: err => toast.error(err.message),
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: id => httpClient.delete(`files/document/${id}`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.residences.all }),
    onError: err => toast.error(err.message),
  })
}

export function useDeleteBloc() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: id => httpClient.delete(`blocs/${id}`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.blocs.all }),
    onError: err => toast.error(err.message),
  })
}

/** Opens the download in a new tab — no auth token needed, cookie is sent */
export function useDownloadAllDocuments(id) {
  window.open(`${BASE_URL}/projects/${id}/download-all-documents`, '_blank')
}
