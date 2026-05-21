/**
 * axiosClient.js - Legacy compatibility shim
 *
 * All new code should import from 'src/lib/api'.
 * This shim keeps existing imports working without changes.
 */
import httpClient from './lib/api/httpClient'

export default httpClient