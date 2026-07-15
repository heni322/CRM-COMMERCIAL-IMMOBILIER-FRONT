/**
 * buildParams.js — Query-string builder utility
 *
 * WHY THIS EXISTS
 * ───────────────
 * Multiple services were building URLs with raw template-string concatenation:
 *
 *   `projects?paginated=true&page_size=${pageSize}&page=${page}&${search ? `search=${search}` : ''}`
 *
 * This caused silent bugs: when two optional params were both truthy, the
 * missing `&` separator fused them into one broken token the backend
 * couldn't parse (e.g. "search=foototal=5").
 *
 * URLSearchParams.append() always produces a correctly encoded, correctly
 * separated query string, and automatically skips falsy values when you
 * use this helper.
 *
 * USAGE
 * ─────
 *   const qs = buildParams({ paginated: true, page_size: 10, page: 1, search })
 *   axiosClient.get(`projects${qs}`)
 *   // → "projects?paginated=true&page_size=10&page=1&search=foo"
 *
 *   // Only include a param when the value is meaningful:
 *   buildParams({ search })                // omits search if '', false, null, undefined
 *   buildParams({ billed: false })         // omits it (falsy)
 *   buildParams({ billed: false }, ['billed']) // forcibly includes it (use allowFalse)
 */

/**
 * @param {Record<string, any>} params        - key/value map to serialise
 * @param {string[]}            [allowFalse]  - param names whose `false` value
 *                                             should still be included
 * @returns {string} e.g. "?foo=1&bar=baz" or "" if no params
 */
export function buildParams(params = {}, allowFalse = []) {
  const sp = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    const include = allowFalse.includes(key) ? value !== null && value !== undefined : Boolean(value)
    if (include) sp.append(key, value)
  }

  const str = sp.toString()
  
return str ? `?${str}` : ''
}

/**
 * Convenience: build pagination block only when paginated=true.
 * Avoids duplicating the paginated/page_size/page triple everywhere.
 */
export function paginationParams({ paginated, page, pageSize }) {
  if (!paginated) return {}
  
return { paginated: 'true', page_size: pageSize, page }
}
