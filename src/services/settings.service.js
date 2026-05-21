/**
 * settings.service.js
 */
import { useQuery } from '@tanstack/react-query'
import { httpClient, queryKeys } from 'src/lib/api'

export const useGetUsages = () => {
  return useQuery({
    queryKey: queryKeys.usageTypes.list(),
    queryFn:  () => httpClient.get('usage/types').then(r => r.data),
  })
}

export const useGetPropertyTypes = () => {
  return useQuery({
    queryKey: queryKeys.propertyTypes.list(),
    queryFn:  () => httpClient.get('property/types').then(r => r.data),
  })
}
