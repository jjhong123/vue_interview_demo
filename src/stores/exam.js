import { defineStore } from 'pinia'
import { examService } from '@/services/examService'
import axios from 'axios'

export const useExamStore = defineStore('exam', {
  state: () => ({
    nowGroupIndex: 0,
    nowQuestionIndex: 0,
    reading: [],
    listening: [],
    isLoading: false,
  }),
  actions: {
    async getExamData() {
      this.isLoading = true
      try {
        // GET Reading
        const resReading = await examService.fetchReading()
        this.reading = resReading.data.data.readingData
        // GET Listening
        const resListening = await examService.fetchListening()
        this.listening = resListening.data.data.listeningData
        console.log('Loading complete:', {
          reading: this.reading,
          listening: this.listening,
        })
      } catch (error) {
        console.error('載入失敗:', error)
      } finally {
        setTimeout(() => {
          this.isLoading = false
        }, 500)
      }
    },
    async getStudentInfo(id, studentInfo) {
      try {
        const response = await axios.get('https://httpbin.org/get', {
          params: {
            id,
            ...studentInfo,
          },
        })
        return response
      } catch (error) {
        console.error('載入失敗:', error)
      }
    },
    async uploadRecord(blob) {
      try {
        const formData = new FormData()
        formData.append('audio', blob, `record_${Date.now()}.mp3`)
        const response = await axios.post('https://httpbin.org/post', formData)
        console.log(response.data.files)
        return response
      } catch (error) {
        console.error('Upload error:', error)
      }
    },
  },
})
