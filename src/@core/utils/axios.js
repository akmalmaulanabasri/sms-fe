import axios from 'axios'
import authConfig from 'src/configs/auth'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090'

const api = axios.create({
  baseURL
})

// Request interceptor: attach token if present
api.interceptors.request.use(
  config => {
    try {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem(authConfig.storageTokenKeyName) : null
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      // ignore in non-browser env
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor: handle 401 globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(authConfig.storageTokenKeyName)
          window.localStorage.removeItem('userData')
          window.location.href = '/login'
        }
      } catch (e) {
        // noop
      }
    }
    return Promise.reject(error)
  }
)

export default api
