import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetShifts = () => {
  return useQuery(['shifts'], () => axiosClient.get(`bba/shifts`).then(res => res.data), {})
}

export const useGetCongesByUserId = userId => {
  return useQuery(
    ['vacations', userId],
    () => axiosClient.get(`bba/vacations/user/${userId}`).then(res => res.data),
    {}
  )
}

export const useGetConges = vaciationId => {
  return useQuery(
    ['vacations', vaciationId],
    () => axiosClient.get(`bba/vacations/${vaciationId}`).then(res => res.data),
    {}
  )
}

export function useAddConge(userId) {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ values }) => {
      return axiosClient.post(`bba/vacations`, values).then(res => res.data)
    },
    {
      onSuccess: data => {
        queryClient.invalidateQueries(['vacations', userId])
        toast.success(data?.message)

        // queryClient.invalidateQueries(['file', idComm])
      },
      onError: error => {
        // /* removed */
      }
    }
  )
}

export function useEditConge(userId) {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ values }) => {
      return axiosClient.post(`bba/vacations/${values?.id}?_method=put`, values).then(res => res.data)
    },
    {
      onSuccess: data => {
        queryClient.invalidateQueries(['vacations', userId])
        toast.success(data?.message)

        // queryClient.invalidateQueries(['file', idComm])
      },
      onError: error => {
        // /* removed */
      }
    }
  )
}

export function useDeleteConge(userId) {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id }) => {
      const res = await axiosClient.delete(`bba/vacations/${id}`)

      return res.data
    },
    {
      onSuccess: data => {
        queryClient.invalidateQueries(['vacations', userId])
        toast.success(data?.message)
      },
      onError: data => {
        toast.error(data?.response?.data?.message)
      }
    }
  )
}
