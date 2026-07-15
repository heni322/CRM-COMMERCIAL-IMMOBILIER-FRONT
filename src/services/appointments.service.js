/**
 * appointments.service.js
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { httpClient, queryKeys, buildParams, paginationParams } from 'src/lib/api'

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

export const useGetAppointment = ({ appId = '' } = {}) => {
  return useQuery({
    queryKey: queryKeys.appointments.detail(appId),
    queryFn:  () => httpClient.get(`appointments/${appId}`).then(r => r.data),
    enabled:  Boolean(appId),
  })
}

export const useGetAppointmentsTypes = () => {
  return useQuery({
    queryKey: queryKeys.appointments.types(),
    queryFn:  () => httpClient.get('appointment/types').then(r => r.data),
  })
}

export function useCreateAppointment() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: values => httpClient.post('appointments', values).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all })
    },
    onError: err => toast.error(err.message),
  })
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: ({ data, id }) => httpClient.put(`appointments/${id}`, data).then(r => r.data),
    onSuccess: (data, { id }) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() })
    },
    onError: err => toast.error(err.message),
  })
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: ({ id }) => httpClient.delete(`appointments/${id}`).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all })
    },
    onError: err => toast.error(err.message),
  })
}

export function useChangeAppointmentState() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: ({ id, values }) => httpClient.put(`appointments/${id}/change/state`, values).then(r => r.data),
    onSuccess: (data, { id }) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() })
    },
    onError: err => toast.error(err.message),
  })
}
