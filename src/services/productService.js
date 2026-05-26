import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    isGlobalLoading.value = false
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    let errorMsg = '發生未知錯誤，請稍後再試'
    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMsg = '身份驗證失敗'
          break
        case 404:
          errorMsg = '找不到該項資源'
          break
        case 500:
          errorMsg = '伺服器錯誤異常'
          break
        default:
          errorMsg = `連線錯誤 (${error.response.status})`
      }
    } else if (error.request) {
      errorMsg = '請檢查網路連線或伺服器是否啟動'
    }
    return Promise.reject(error)
  }
)

export default api