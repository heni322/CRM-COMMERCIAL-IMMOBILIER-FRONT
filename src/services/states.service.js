/**
 * states.service.js
 */

import { useQuery } from '@tanstack/react-query'
import { httpClient, queryKeys } from 'src/lib/api'

export const useGetstatesByModel = model => {
  return useQuery({
    queryKey: queryKeys.states.list(model),
    queryFn:  () => httpClient.get(`states?model=${model}`).then(r => r.data),
    enabled:  Boolean(model),
  })
}

// Alias kept for backwards-compat — use preferences.service.js going forward
export const useGetPreferences = () => {
  return useQuery({
    queryKey: queryKeys.preferences.list(),
    queryFn:  () => httpClient.get('preferences').then(r => r.data),
  })
}
