import { ref } from 'vue'
import { GoogleGenAI } from "@google/genai"

export function useProductAI() {
  const aiReport = ref('')
  const aiLoading = ref(false)
  const apiKey = ref('')

  const setKey = (key) => {
    apiKey.value = key
  }

  const checkKey = () => {
    return apiKey.value !== ''
  }

  const generateAIReport = async (productsData) => {
    aiLoading.value = true
    try {
      const client = new GoogleGenAI({ apiKey: apiKey.value })
      
      const response = await client.models.generateContent({
        model: "gemini-3.1-flash-lite", 
        contents: `
          你現在是專業烘焙坊的數據分析顧問。以下是目前店內商品的即時 JSON 數據：
          ${JSON.stringify(productsData)}
          請根據這些數據，提供一份精簡的經營報告（大約 150 字內，列3個重點即可）：
          1. 指出哪一項商品的庫存過低需要補貨。
          2. 分析哪種類型的商品定價最高，是否合理。
          3. 給出一句具體的促銷建議。
        `,
      })
      
      aiReport.value = response.text
    } catch (error) {
      console.error('Gemini API Error:', error)
      aiReport.value = 'AI 分析生成失敗'
    } finally {
      aiLoading.value = false
    }
  }

  const clearReport = () => {
    aiReport.value = ''
  }

  return {
    aiReport,
    aiLoading,
    generateAIReport,
    setKey,
    checkKey,
    clearReport
  }
}