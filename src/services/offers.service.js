/**
 * offers.service.js  (Documents)
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { httpClient, queryKeys, buildParams, paginationParams } from 'src/lib/api'

// Surface the real backend error (validation detail / message) instead of a generic axios string
const apiError = err => {
  const data = err?.response?.data
  if (data?.errors) {
    const first = Object.values(data.errors)[0]
    if (Array.isArray(first) && first[0]) return first[0]
  }
  
return data?.message || err?.message || 'Une erreur est survenue'
}

export const useGetOffers = ({
  paginated = false,
  search = false,
  nature = 0,
  clientId = false,
  pageSize,
  page,
  collaboratorId = false,
  propertyId = false,
} = {}) => {
  const qs = buildParams({
    ...paginationParams({ paginated, page, pageSize }),
    search,
    nature: nature !== false && nature !== null ? nature : undefined,
    client: clientId,
    collaborator: collaboratorId,
    property: propertyId,
  })
  
return useQuery({
    queryKey: queryKeys.offers.list({ paginated, search, pageSize, page, nature, clientId, collaboratorId, propertyId }),
    queryFn:  () => httpClient.get(`documents${qs}`).then(r => r.data),
  })
}

export const useGetOfferById = ({ offerId = '', type = false } = {}) => {
  return useQuery({
    queryKey: queryKeys.offers.detail(offerId),
    queryFn:  () => httpClient.get(`documents/${offerId}${buildParams({ type })}`).then(r => r.data),
    enabled:  Boolean(offerId),
  })
}

export const useGetPropertyOffers = ({ propertyId = '', paginated = false, search = false, pageSize, page } = {}) => {
  const qs = buildParams({ ...paginationParams({ paginated, page, pageSize }), search })
  
return useQuery({
    queryKey: queryKeys.offers.byProperty(propertyId),
    queryFn:  () => httpClient.get(`documents/${propertyId}/property${qs}`).then(r => r.data),
    enabled:  Boolean(propertyId),
  })
}

export const useGetNatures = ({ currentNature = null } = {}) => {
  return useQuery({
    queryKey: queryKeys.natures.list({ currentNature }),
    queryFn:  () => httpClient.get(`nature${buildParams({ nature: currentNature })}`).then(r => r.data),
  })
}

export const useGetOffrePDF = (offerId = '') => {
  return useQuery({
    queryKey: queryKeys.offers.pdf(offerId),
    queryFn:  () => httpClient.get(`documents/${offerId}/pdf`).then(r => r.data),
    enabled:  Boolean(offerId),
  })
}

export const useGetDocumentPayments = (offerId = '') => {
  return useQuery({
    queryKey: queryKeys.offers.payments(offerId),
    queryFn:  () => httpClient.get(`documents/${offerId}/echeances`).then(r => r.data),
    enabled:  Boolean(offerId),
  })
}

export const useGetDocumentsPaymentTypes = () => {
  return useQuery({
    queryKey: queryKeys.payments.types(),
    queryFn:  () => httpClient.get('echeance/types').then(r => r.data),
  })
}

export const useGetBanks = () => {
  return useQuery({
    queryKey: queryKeys.payments.banks(),
    queryFn:  () => httpClient.get('echeances/list/banks').then(r => r.data),
  })
}

export function useCreateOffer() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: values => httpClient.post('documents', values).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.all })
    },
    onError: err => toast.error(apiError(err)),
  })
}

export function useUpdateOffer() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: ({ data, id }) => httpClient.put(`documents/${id}`, data).then(r => r.data),
    onSuccess: (data, { id }) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.lists() })
    },
    onError: err => toast.error(apiError(err)),
  })
}

export function useDeleteOffer() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: ({ id }) => httpClient.delete(`documents/${id}`).then(r => r.data),
    onSuccess: data => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.all })
    },
    onError: err => toast.error(apiError(err)),
  })
}

export function useChangeNature() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: values => httpClient.put(`documents/${values?.id}/change/nature`, values).then(r => r.data),
    onSuccess: (data, values) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.detail(values?.id) })
    },
    onError: err => toast.error(apiError(err)),
  })
}

export function useChangeState() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: values => httpClient.put(`documents/${values?.id}/change/state`, values).then(r => r.data),
    onSuccess: (data, values) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.detail(values?.id) })
    },
    onError: err => toast.error(apiError(err)),
  })
}

export function useCreateOfferPayment() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: values => httpClient.post(`documents/${values?.id}/echeances`, values).then(r => r.data),
    onSuccess: (data, values) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.payments(values?.id) })
    },
    onError: err => toast.error(apiError(err)),
  })
}

export function useUpdateOfferPayment() {
  const queryClient = useQueryClient()
  
return useMutation({
    mutationFn: values => httpClient.put(`documents/${values?.id}/echeances`, values).then(r => r.data),
    onSuccess: (data, values) => {
      toast.success(data?.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.offers.payments(values?.id) })
    },
    onError: err => toast.error(apiError(err)),
  })
}

export function useCalculateOffer() {
  return useMutation({
    mutationFn: values => httpClient.post('documents/list/calculated', values).then(r => r.data),

    // No cache invalidation needed — this is a pure computation endpoint
  })
}
