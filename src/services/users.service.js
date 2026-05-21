/**
 * users.service.js
 *
 * Covers: collaborators (users) + clients + notifications + roles
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { httpClient, queryKeys, buildParams, paginationParams } from 'src/lib/api'

// ─── Collaborators ────────────────────────────────────────────────────────────

export const useGetUsers = ({ paginated = false, role = false, search = false, pageSize, page, notMe } = {}) => {
  const qs = buildParams({ ...paginationParams({ paginated, page, pageSize }), role, search, notMe })
  return useQuery({
    queryKey: queryKeys.users.list({ paginated, role, search, pageSize, page, notMe }),
    queryFn: () => httpClient.get(`users${qs}`).then(r => r.data),
  })
}

export const useGetUsersById = ({ userId = '', stats = false } = {}) => {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn:  () => httpClient.get(`users/${userId}${buildParams({ stats })}`).then(r => r.data),
    enabled:  Boolean(userId),
  })
}

export const useGetRoles = () => {
  return useQuery({
    queryKey: queryKeys.users.roles(),
    queryFn:  () => httpClient.get('roles').then(r => r.data),
  })
}

export function useCreateCollaborator() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: values => httpClient.post('users', values).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
    },
    onError: err => toast.error(err.message),
  })
}

export function useUpdateCollab() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ data, id }) => httpClient.put(`users/${id}`, data).then(r => r.data),
    onSuccess: (data, { id }) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
    onError: err => toast.error(err.message),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }) => httpClient.delete(`users/${id}`).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
    },
    onError: err => toast.error(err.message),
  })
}

export function useDisableUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }) => httpClient.put(`users/${id}/disable`).then(r => r.data),
    onSuccess: (data, { id }) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
    onError: err => toast.error(err.message),
  })
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }) => httpClient.put(`users/${id}/toggle-status`).then(r => r.data),
    onSuccess: (data, { id }) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
    onError: err => toast.error(err.message),
  })
}

// ─── Clients ──────────────────────────────────────────────────────────────────

export const useGetClients = ({
  paginated = false,
  role = false,
  search = false,
  pageSize,
  page,
  clientCategory = false,
  clientType = false,
  commercialId = false,
} = {}) => {
  const qs = buildParams({
    ...paginationParams({ paginated, page, pageSize }),
    role,
    search,
    clientType,
    clientCategory,
    commercial: commercialId,
  })
  return useQuery({
    queryKey: queryKeys.clients.list({ paginated, role, search, pageSize, page, clientCategory, clientType, commercialId }),
    queryFn:  () => httpClient.get(`clients${qs}`).then(r => r.data),
  })
}

export const useGetClientById = ({ userId = '' } = {}) => {
  return useQuery({
    queryKey: queryKeys.clients.detail(userId),
    queryFn:  () => httpClient.get(`clients/${userId}`).then(r => r.data),
    enabled:  Boolean(userId),
  })
}

export const useGetClientCategories = () => {
  return useQuery({
    queryKey: queryKeys.clients.categories(),
    queryFn:  () => httpClient.get('client/categories').then(r => r.data),
  })
}

export const useGetClientTypes = () => {
  return useQuery({
    queryKey: queryKeys.clients.types(),
    queryFn:  () => httpClient.get('client/types').then(r => r.data),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ values }) => httpClient.post('clients', values).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
    },
    onError: err => toast.error(err.message),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ data, id }) => httpClient.put(`clients/${id}`, data).then(r => r.data),
    onSuccess: (data, { id }) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.lists() })
    },
    onError: err => toast.error(err.message),
  })
}

export function useDeleteClient() {
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

// ─── Notifications ────────────────────────────────────────────────────────────

export const useGetNotifications = () => {
  return useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn:  () => httpClient.get('user-notifications').then(r => r.data),
    refetchInterval: 60_000, // poll every 60 s — remove if using WebSockets
  })
}

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }) => httpClient.post(`user-notifications/${id}/vue`).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  })
}

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => httpClient.post('user-notifications/vue').then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  })
}

// ─── Token generation ─────────────────────────────────────────────────────────

export function useGenerateToken() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }) => httpClient.put(`users/clients/generate-public-link/${id}`).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
    },
    onError: err => toast.error(err.message),
  })
}
