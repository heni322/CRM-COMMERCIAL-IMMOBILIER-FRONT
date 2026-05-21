import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import axiosClient from 'src/axiosClient'

export const useGetReglements = ({ paginated = true, searchFilter = '', page = 1 }) => {
  return useQuery(
    ['reglements', searchFilter, page],
    () =>
      axiosClient
        .get(
          `bba/reglements?${searchFilter ? `search=${searchFilter}&` : ''}${page ? `page=${page}&` : ''}${
            paginated ? `paginated=${paginated}&` : ''
          }`
        )
        .then(res => res.data),
    {}
  )
}

export const useGetReglementsMode = () => {
  return useQuery(['mode-reglements'], () => {
    // Return the axios.get promise, which will be handled by useQuery
    return axiosClient.get('bba/mode-reglements').then(res => res.data)
  })
}

export const useGetFactures = ({ idClient, paginated = true, searchFilter = '', page = 1 }) => {
  return useQuery(['factures-reglement', idClient, searchFilter, page], () => {
    return axiosClient
      .get(
        `bba/reglements/${idClient}/invoices?${searchFilter ? `search=${searchFilter}&` : ''}${
          page ? `page=${page}&` : ''
        }${paginated ? `paginated=${paginated}&` : ''}`
      )
      .then(res => res.data)
  })
}

export function useCreateReglement() {
  const queryClient = useQueryClient()

  return useMutation(
    async values => {
      const res = await axiosClient.post(`bba/reglements`, values)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
        queryClient.invalidateQueries()
      }
    }
  )
}

export const useGetReglement = (reglementId = '') => {
  return useQuery(['reglements', reglementId], () =>
    axiosClient.get(`bba/reglements/${reglementId}`).then(res => res.data)
  )
}

export function useDeleteReglementMutation() {
  const queryClient = useQueryClient()

  return useMutation(
    async id => {
      const res = await axiosClient.delete(`bba/reglements/${id}`)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
        queryClient.invalidateQueries(['reglements'])
      }
    }
  )
}

export function useUpdateReglement(id = '') {
  return useMutation(
    async values => {
      const res = await axiosClient.put(`bba/reglements/${id}`, values)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
      }
    }
  )
}
