import axios from 'axios'
const api = axios.create({
  baseURL: `${import.meta.env.BASE_URL}data/`,
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export const examService = {
  fetchReading() {
    return api.get(`reading.json?t=${new Date().getTime()}`)
  },
  fetchListening() {
    return api.get(`listening.json?t=${new Date().getTime()}`)
  },
  async postUploadRecord(blob) {
    const formData = new FormData()
    formData.append('audio', blob, `record_${Date.now()}.mp3`)
    const response = await axios.post('https://httpbin.org/post', formData)
    return response
  },
}

export default api
