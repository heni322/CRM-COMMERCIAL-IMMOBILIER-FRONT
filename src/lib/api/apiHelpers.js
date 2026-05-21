/**
 * apiHelpers.js — Safe data extraction utilities for React Query responses
 *
 * The backend wraps most responses in { data: [...] }.
 * React Query stores the full axios response.data as queryResult.data.
 * So the array lives at queryResult.data.data — two levels deep.
 *
 * These helpers centralise that extraction so components never crash
 * when data is undefined, null, or an unexpected shape.
 */

/**
 * Extract a flat array from any API response shape:
 *   - { data: [...] }     → Laravel paginated/collection responses
 *   - [...]               → flat array responses
 *   - null / undefined    → []
 *
 * @param {any} queryData - the .data property from a useQuery result
 * @returns {Array}
 */
export function extractList(queryData) {
  if (!queryData) return []
  if (Array.isArray(queryData)) return queryData
  if (Array.isArray(queryData?.data)) return queryData.data
  return []
}

/**
 * Extract pagination meta from a Laravel paginated response.
 * Returns safe defaults when data is not yet loaded.
 *
 * @param {any} queryData - the .data property from a useQuery result
 * @returns {{ total: number, lastPage: number, perPage: number, currentPage: number }}
 */
export function extractPagination(queryData) {
  return {
    total:       queryData?.total       ?? 0,
    lastPage:    queryData?.last_page   ?? 1,
    perPage:     queryData?.per_page    ?? 25,
    currentPage: queryData?.current_page ?? 1,
  }
}

/**
 * Extract a single object from a { data: {...} } response shape.
 *
 * @param {any} queryData - the .data property from a useQuery result
 * @returns {object|null}
 */
export function extractItem(queryData) {
  if (!queryData) return null
  if (queryData?.data && typeof queryData.data === 'object' && !Array.isArray(queryData.data)) {
    return queryData.data
  }
  return queryData
}

/**
 * Safe error message extractor from React Query / Axios errors.
 * Works with our normalised ApiError from httpClient.js and raw axios errors.
 */
export function extractErrorMessage(error) {
  if (!error) return null
  if (error?.isApiError) return error.message
  return error?.response?.data?.message ?? error?.message ?? 'Une erreur est survenue.'
}
