import { useMutation, useQuery, useQueryTier } from '@tanstack/react-query'

import axiosClient from 'src/axiosClient'

export const useGetTierTypes = ({ paginated = false, role = false, search = false, pageSize, page }) => {
  return useQuery(
    ['tier-types', paginated, role, search, pageSize, page],
    () =>
      axiosClient
        .get(
          `tier-types?${paginated ? `paginated=true&page_size=${pageSize}&page=${page}&` : ``}${
            search ? `search=${search}` : ''
          }`
        )
        .then(res => res.data),
    {}
  )
}

export const useGetTierTypesById = (typeTierId = '') => {
  return useQuery(
    ['tier-types', typeTierId],
    () => axiosClient.get(`tier-types/${typeTierId}`).then(res => res.data),
    {}
  )
}
