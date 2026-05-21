import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetOperations = () => {
  return useQuery(['operations'], () => axiosClient.get(`bba/operations`).then(res => res.data), {})
}
