import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import axiosClient from 'src/axiosClient'

export const useGetLocalTypes = ({ paginated = false, role = false, search = false, pageSize, page }) => {
  return useQuery(
    ['local-types', paginated, role, search, pageSize, page],
    () =>
      axiosClient
        .get(
          `local-types?${paginated ? `paginated=true&page_size=${pageSize}&page=${page}&` : ``}${
            search ? `search=${search}` : ''
          }`
        )
        .then(res => res.data),
    {}
  )
}

export const useGetLocalTypesById = (typeId = '') => {
  return useQuery(
    ['local-types', typeId],
    () => axiosClient.get(`local-types/${local - typeId}`).then(res => res.data),
    {}
  )
}

export function useCreateLocalType() {
  const queryClient = useQueryClient()

  return useMutation(
    async values => {
      const res = await axiosClient.post(`local-types`, values)

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

export function useDeleteLocalType() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id }) => {
      const res = await axiosClient.delete(`local-types/${id}`)

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
