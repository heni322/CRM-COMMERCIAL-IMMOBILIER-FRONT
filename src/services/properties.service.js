/**
 * properties.service.js
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { httpClient, queryKeys, buildParams, paginationParams } from 'src/lib/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const useGetProperties = ({
  paginated = false,
  search = '',
  propertyType = '',
  state = '',
  usageType = '',
  pageSize,
  project,
  page,
} = {}) => {
  const qs = buildParams({
    ...paginationParams({ paginated, page, pageSize }),
    search,
    project,
    propertyType,
    usageType,
    state,
  })
  
return useQuery({
    queryKey: queryKeys.properties.list({ paginated, search, pageSize, page, propertyType, state, usageType, project }),
    queryFn:  () => httpClient.get(`properties${qs}`).then(r => r.data),
  })
}

export const useGetPropertyById = propertyId => {
  return useQuery({
    queryKey: queryKeys.properties.detail(propertyId),
    queryFn:  () => httpClient.get(`properties/${propertyId}`).then(r => r.data),
    enabled:  Boolean(propertyId),
  })
}

export const useGetPropertyImages = ({ propertyId = '' } = {}) => {
  return useQuery({
    queryKey: queryKeys.properties.images(propertyId),
    queryFn:  () => httpClient.get(`properties/${propertyId}/images`).then(r => r.data),
    enabled:  Boolean(propertyId),
  })
}

export const useGetPropertyDocuments = ({ propertyId = '' } = {}) => {
  return useQuery({
    queryKey: queryKeys.properties.documents(propertyId),
    queryFn:  () => httpClient.get(`properties/${propertyId}/documents`).then(r => r.data),
    enabled:  Boolean(propertyId),
  })
}

export function useGetPropertiesByResidenceIds({ projects = '' } = {}) {
  const qs = projects?.length ? `?projects=[${projects}]` : ''
  
return useQuery({
    queryKey: queryKeys.properties.forOffer(projects),
    queryFn:  () => httpClient.get(`documents/list/properties${qs}`).then(r => r.data),
  })
}

export function useCreateProperty() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: values => httpClient.post('properties', values).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
    },
    onError: err => toast.error(err.message),
  })
}

export function useUpdateProperty() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: ({ values, id }) => httpClient.post(`properties/${id}?_method=PUT`, values).then(r => r.data),
    onSuccess: (data, { id }) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.lists() })
    },
    onError: err => toast.error(err.message),
  })
}

export function useDeleteProperty() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: ({ id }) => httpClient.delete(`properties/${id}`).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
    },
    onError: err => toast.error(err.message),
  })
}

export function useUpdateStateProperty() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: ({ values, id }) => httpClient.post(`properties/${id}/change/state?_method=PUT`, values).then(r => r.data),
    onSuccess: (data, { id }) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.detail(id) })
    },
    onError: err => toast.error(err.message),
  })
}

export function useAddPropertyPrice() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: ({ values }) => httpClient.post('property/prices', values).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
    },
    onError: err => toast.error(err.message),
  })
}

export function useUpdatePropertyPrice() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: ({ values, id }) => httpClient.put(`property/prices/${id}`, values).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all })
    },
    onError: err => toast.error(err.message),
  })
}

export function useUploadDocuments() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: ({ values, propertyId }) => httpClient.post(`properties/${propertyId}/documents`, values).then(r => r.data),
    onSuccess: (data, { propertyId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.documents(propertyId) })
    },
    onError: err => toast.error(err.message),
  })
}

export function useUploadImages() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: ({ values, propertyId }) => httpClient.post(`properties/${propertyId}/images`, values).then(r => r.data),
    onSuccess: (data, { propertyId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.images(propertyId) })
    },
    onError: err => toast.error(err.message),
  })
}

export function useDeleteImage() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: id => httpClient.delete(`files/image/${id}`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.properties.all }),
    onError: err => toast.error(err.message),
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: id => httpClient.delete(`files/document/${id}`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.properties.all }),
    onError: err => toast.error(err.message),
  })
}

export const useGetAppointments = ({ id = '', resource = '', states = '' } = {}) => {
  const qs = buildParams({
    ...(resource === 'client' ? { clientId: id } : { documentId: id }),
    ...(states?.length ? { states: `[${states}]` } : {}),
  })
  
return useQuery({
    queryKey: queryKeys.appointments.list({ id, resource, states }),
    queryFn:  () => httpClient.get(`appointments${qs}`).then(r => r.data),
    enabled:  Boolean(id),
  })
}

export function useDownloadAllDocuments(id) {
  window.open(`${BASE_URL}/properties/${id}/download-all-documents`, '_blank')
}
