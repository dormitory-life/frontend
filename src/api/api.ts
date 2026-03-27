import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
} from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080",
})

type RetryableRequestConfig = AxiosRequestConfig & {
  _retry?: boolean
}

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else if (token) {
      promise.resolve(token)
    }
  })

  failedQueue = []
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token")
  const userId = localStorage.getItem("userId")
  const dormitoryId = localStorage.getItem("dormitoryId")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (userId) {
    config.headers["X-User-ID"] = userId
  }

  if (dormitoryId) {
    config.headers["X-Dormitory-ID"] = dormitoryId
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined

    if (!originalRequest) {
      return Promise.reject(error)
    }

    const isRefreshRequest = originalRequest.url?.includes("/auth/refresh")
    const isLoginRequest = originalRequest.url?.includes("/auth/login")

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      !isLoginRequest
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken: string) => {
              if (!originalRequest.headers) {
                originalRequest.headers = {}
              }
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              resolve(api(originalRequest))
            },
            reject,
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const accessToken = localStorage.getItem("token")
      const refreshToken = localStorage.getItem("refreshToken")

      if (!accessToken || !refreshToken) {
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("userId")
        localStorage.removeItem("dormitoryId")
        window.location.href = "/"
        return Promise.reject(error)
      }

      try {
        const refreshResponse = await axios.post(
          "http://localhost:8080/auth/refresh",
          {
            access_token: accessToken,
            refresh_token: refreshToken,
          }
        )

        const newAccessToken = refreshResponse.data.access_token
        const newRefreshToken = refreshResponse.data.refresh_token

        localStorage.setItem("token", newAccessToken)
        localStorage.setItem("refreshToken", newRefreshToken)

        processQueue(null, newAccessToken)

        if (!originalRequest.headers) {
          originalRequest.headers = {}
        }
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)

        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("userId")
        localStorage.removeItem("dormitoryId")

        window.location.href = "/"

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api