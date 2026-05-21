/**
 * httpClient.js — Enterprise-grade Axios instance
 *
 * Responsibilities:
 *  • Single source of truth for all HTTP config (baseURL, credentials, headers)
 *  • Request interceptor  → attaches CSRF token on every mutating request
 *  • Response interceptor → normalises errors into a consistent ApiError shape
 *    so every service / UI layer handles ONE error format, not raw Axios errors
 *  • 401 auto-redirect → kicks the user to /login on session expiry
 *  • No business logic lives here; this is pure transport
 */

import axios from 'axios'

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const CSRF_METHODS = ['post', 'put', 'patch', 'delete']

// ─── Instance ─────────────────────────────────────────────────────────────────

const httpClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,           // required for Laravel Sanctum session cookies
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',  // tells Laravel this is an AJAX request
  },
})

// ─── Request interceptor ──────────────────────────────────────────────────────

httpClient.interceptors.request.use(
  config => {
    // Attach CSRF token stored by Laravel's cookie on mutating requests
    if (CSRF_METHODS.includes(config.method)) {
      const xsrfToken = getCookie('XSRF-TOKEN')
      if (xsrfToken) config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken)
    }

    // Multipart override: let browser set boundary automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    return config
  },
  error => Promise.reject(error)
)

// ─── Response interceptor ─────────────────────────────────────────────────────

httpClient.interceptors.response.use(
  response => response,

  error => {
    const status  = error?.response?.status
    const payload = error?.response?.data

    // Session expired or unauthenticated → redirect to login
    if (status === 401 && typeof window !== 'undefined') {
      const isLoginPage = window.location.pathname.includes('/login')
      if (!isLoginPage) window.location.href = '/login'
    }

    // Normalise into a consistent ApiError so consumers never have to dig into
    // error.response.data.errors[0].message themselves
    const apiError = new Error(extractMessage(payload, error.message))
    apiError.status     = status
    apiError.errors     = payload?.errors   ?? null   // Laravel validation bag
    apiError.payload    = payload           ?? null   // full raw payload
    apiError.isApiError = true

    return Promise.reject(apiError)
  }
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCookie(name) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`))
  return match ? match[2] : null
}

/**
 * Pull the most human-readable message from whatever Laravel sends back.
 * Priority: message → first validation error → generic fallback
 */
function extractMessage(payload, fallback) {
  if (!payload) return fallback
  if (typeof payload === 'string') return payload
  if (payload.message) return payload.message
  if (payload.errors) {
    const firstKey = Object.keys(payload.errors)[0]
    if (firstKey) return payload.errors[firstKey][0]
  }
  return fallback
}

export default httpClient
