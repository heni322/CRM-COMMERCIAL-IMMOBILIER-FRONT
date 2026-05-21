import axiosClient from 'src/axiosClient'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetSubRoles = parentRole => {
  return useQuery(
    [['roles', 'sub'], parentRole],
    () => axiosClient.get(`bba/roles/${parentRole}`).then(res => res.data),
    {}
  )
}
