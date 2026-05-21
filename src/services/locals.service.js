import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import axiosClient from 'src/axiosClient'

export const useGetLocals = ({ paginated = false, role = false, search = false, pageSize, page }) => {
  return useQuery(
    ['locals', paginated, role, search, pageSize, page],
    () =>
      axiosClient
        .get(
          `locals?${paginated ? `paginated=true&page_size=${pageSize}&page=${page}&` : ``}${
            search ? `search=${search}` : ''
          }`
        )
        .then(res => res.data),
    {}
  )
}

export const useGetLocalsById = (localId = '') => {
  return useQuery(['locals', localId], () => axiosClient.get(`locals/${localId}`).then(res => res.data), {})
}

export function useCreateLocal() {
  const queryClient = useQueryClient()

  return useMutation(
    async values => {
      const res = await axiosClient.post(`locals`, values)

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

export function useDeleteLocal() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id }) => {
      const res = await axiosClient.delete(`locals/${id}`)

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

export function useUpdateLocal() {
  return useMutation(
    async ({ data, id }) => {
      const res = await axiosClient.post(`locals/${id}?_method=PUT`, data)

      return res.data
    },
    {
      onSuccess: data => {
        toast.success(data?.message)
      }
    }
  )
}
