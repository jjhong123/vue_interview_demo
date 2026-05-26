<template>
  <div class="vision-container">
    <h2>Google Vision AI 辨識工具</h2>

    <div class="upload-section">
      <input type="file" @change="onFileChange" accept="image/*" :disabled="loading" class="file-input" />
    </div>

    <div v-if="previewUrl" class="preview-box">
      <img :src="previewUrl" alt="Preview" class="preview-img" />
    </div>

    <div class="action-section">
      <button @click="analyzeImage" :disabled="!base64Data || loading" class="analyze-btn">
        {{ loading ? 'AI 正在思考中...' : '開始辨識圖片' }}
      </button>
    </div>

    <div v-if="result || loading" class="result-section">
      <h3>分析結果：</h3>
      <div v-if="loading" class="loading-spinner">辨識中，請稍候...</div>
      <div v-else class="result-text">{{ result }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { GoogleGenAI } from "@google/genai";

// 響應式變數
const previewUrl = ref(null);
const base64Data = ref("");
const mimeType = ref("");
const result = ref("");
const loading = ref(false);


const API_KEY = 'AIzaSyAQNUQcjhg3180cUkul6yGshFmDGeIw14Y';

// 初始化 Client
const client = new GoogleGenAI({ apiKey: API_KEY });

function onFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  mimeType.value = file.type;
  console.log("Selected file MIME type:", mimeType.value);

  previewUrl.value = URL.createObjectURL(file);

  const reader = new FileReader();
  reader.onloadend = () => {
    base64Data.value = reader.result.split(",")[1];
  };
  reader.readAsDataURL(file);
};

// 執行 AI 辨識
const analyzeImage = async () => {
  if (!base64Data.value) return;

  loading.value = true;
  result.value = "";

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: "這張照片裡有什麼？請用繁體中文詳細描述所有看到的物體與細節。" },
            {
              inlineData: {
                data: base64Data.value,
                mimeType: mimeType.value
              }
            }
          ]
        }
      ]
    });

    result.value = response.text;

  } catch (error) {
    console.error("AI Analysis Error:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.vision-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-family: sans-serif;
}

.preview-box {
  margin: 1.5rem 0;
  text-align: center;
}

.preview-img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.analyze-btn {
  width: 100%;
  padding: 12px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.analyze-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.result-section {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.result-text {
  white-space: pre-wrap;
  /* 保持 AI 回傳的換行格式 */
  line-height: 1.6;
  color: #333;
}

.loading-spinner {
  color: #666;
  font-style: italic;
}
</style>