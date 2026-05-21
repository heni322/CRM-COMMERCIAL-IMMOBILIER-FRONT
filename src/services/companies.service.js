import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetCompanies = ({ paginated = false, pageSize, page }) => {
  return useQuery(
    ['societies', paginated, pageSize, page],
    () =>
      axiosClient
        .get(`bba/societies?${paginated ? `paginated=true&page_size=${pageSize}&page=${page}&` : ``}`)
        .then(res => res.data),
    {}
  )
}

export const useGetCompaniesById = (id = '') => {
  return useQuery(['societies', id], () => axiosClient.get(`bba/societies/${id}`).then(res => res.data), {})
}

export function useUpdateCompany() {
  return useMutation(
    async ({ data, id }) => {
      const res = await axiosClient.post(`bba/societies/${id}?_method=PUT`, data)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
      }
    }
  )
}

export function useCreateCompany() {
  const queryClient = useQueryClient()

  return useMutation(
    async values => {
      const res = await axiosClient.post(`bba/societies`, values)

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

export function useDeleteCompany() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id }) => {
      const res = await axiosClient.delete(`bba/societies/${id}`)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
        queryClient.invalidateQueries()
      },
      onError: data => {
        toast.error(data?.response?.data?.message)
      }
    }
  )
}
