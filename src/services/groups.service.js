import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axiosClient from 'src/axiosClient'
import toast from 'react-hot-toast'

export const useGetGroups = () => {
  return useQuery(['groups'], () => axiosClient.get(`bba/groups`).then(res => res.data), {})
}

export const useGetGroupById = (grpId = '') => {
  return useQuery(['groups', grpId], () => axiosClient.get(`bba/groups/${grpId}`).then(res => res.data), {})
}

export const useGetGroupUsers = ({ grpId, paginated = false, search = false, pageSize, page }) => {
  return useQuery(
    ['group-users', grpId, paginated, search, pageSize, page],
    () =>
      axiosClient
        .get(
          `bba/groups/${grpId}/users?${paginated ? `paginated=true&page_size=${pageSize}&page=${page}&` : ``}${
            search ? `search=${search}` : ''
          }`
        )
        .then(res => res.data),
    {}
  )
}

export function useCreateGroup() {
  const queryClient = useQueryClient()

  return useMutation(
    async values => {
      const res = await axiosClient.post(`bba/group`, values)

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

export function useDeleteUserFromGroup() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ groupId: groupId, userId: userId }) => {
      const res = await axiosClient.put(`bba/groups/${groupId}/remove-user/${userId}`)

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
