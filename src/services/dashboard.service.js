// FIX #16: removed non-existent useQueryDocument import from @tanstack/react-query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import axiosClient from 'src/axiosClient'

export const useGetDocumentsById = (documentId = '') => {
  return useQuery(['documents', documentId], () => axiosClient.get(`documents/${documentId}`).then(res => res.data), {})
}

export const useGetPropertiesStats = () => {
  return useQuery(['properties-stats'], () => axiosClient.get(`stats/properties`).then(res => res.data), {})
}

export const useGetOfferStats = () => {
  return useQuery(['offer-stats'], () => axiosClient.get(`stats/document/validation`).then(res => res.data), {})
}

export const useGetOfferStatsAmounts = () => {
  return useQuery(['offer-amounts'], () => axiosClient.get(`stats/document/amounts`).then(res => res.data), {})
}

export const useGetOfferStatsByType = () => {
  return useQuery(['offer-by-type'], () => axiosClient.get(`stats/properties/type`).then(res => res.data), {})
}

export const useGetOfferStatsDiverge = () => {
  return useQuery(['offer-diverge'], () => axiosClient.get(`stats/document/offre`).then(res => res.data), {})
}

export function useDeleteImage() {
  const queryClient = useQueryClient()
  
return useMutation(
    async id => {
      const res = await axiosClient.delete(`files/image/${id}`)
      
return res.data
    },
    {
      onSuccess: () => {
        // FIX #11: string form is v3 API — silently no-ops in v4+, use object form
        queryClient.invalidateQueries({ queryKey: ['residence-images'] })
        queryClient.invalidateQueries({ queryKey: ['property-images'] })
      }
    }
  )
}

export const useGetSoldProperties = () => {
  return useQuery(['sold-properties'], () => axiosClient.get(`stats/properties/sold`).then(res => res.data), {})
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  
return useMutation(
    async id => {
      const res = await axiosClient.delete(`files/document/${id}`)
      
return res.data
    },
    {
      onSuccess: () => {
        // FIX #11: object form
        queryClient.invalidateQueries({ queryKey: ['residence-documents'] })
        queryClient.invalidateQueries({ queryKey: ['property-documents'] })
      }
    }
  )
}
