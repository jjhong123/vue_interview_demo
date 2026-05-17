<template>
  <div class="exam-container">
    <!-- PART 1 -->
    <div v-if="status === 'ready'" class="fullscreen-center">
      <v-btn color="primary" size="x-large" @click="startExam">開始聽力測驗</v-btn>
    </div>

    <!-- PART 2 -->
    <div v-if="status === 'playing'" class="fullscreen-center">
      <video
        ref="videoRef"
        :src="currentGroup.groupData.videoUrl"
        @ended="onVideoEnded"
        controls
        class="main-video"
      ></video>
    </div>

    <!-- PART 3 -->
    <div v-if="status === 'answering'" class="answering-stage">
      <div class="progress-text">
        Question {{ subIndex + 1 }} / {{ currentGroup.groupData.questionData.length }}
      </div>

      <SingleChoice
        :key="`${nowQuestionIndex}-${subIndex}`"
        :data="currentGroup.groupData.questionData[subIndex]"
      />
    </div>

    <!-- Footer -->
    <div v-if="status === 'answering'" class="bottom-nav">
      <div class="nav-divider"></div>
      <div class="btn-wrapper">
        <button class="pure-next-btn" @click="handleNext">
          {{ isLastStep ? '完成考試' : 'Next' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useExamStore } from '@/stores/exam'
import SingleChoice from './question/SingleChoice.vue'

const examStore = useExamStore()
const { nowQuestionIndex, listening } = storeToRefs(examStore)

const status = ref('ready')
const subIndex = ref(0)
const videoRef = ref(null)

onUnmounted(() => {
  nowQuestionIndex.value = 0
})

const currentGroup = computed(() => listening.value[nowQuestionIndex.value])

const isLastStep = computed(() => {
  const isLastBigQ = nowQuestionIndex.value === listening.value.length - 1
  const isLastSubQ = subIndex.value === currentGroup.value.groupData.questionData.length - 1
  return isLastBigQ && isLastSubQ
})

const startExam = async () => {
  status.value = 'playing'
  nextTick(() => {
    videoRef.value?.play()
  })
}

const onVideoEnded = () => {
  status.value = 'answering'
}

function handleNext() {
  const questions = currentGroup.value.groupData.questionData

  if (subIndex.value < questions.length - 1) {
    subIndex.value++
  } else {
    if (nowQuestionIndex.value < listening.value.length - 1) {
      nowQuestionIndex.value++
      status.value = 'ready'
      subIndex.value = 0
    } else {
      alert('測驗結束')
    }
  }
}

watch(nowQuestionIndex, () => {
  status.value = 'ready'
  subIndex.value = 0
})
</script>

<style scoped>
.exam-container {
  height: calc(100vh - 96px);
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #fff;
}

.fullscreen-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.main-video {
  width: 90%;
  max-width: 800px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.answering-stage {
  flex: 1;
  padding: 40px 20px;
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
}

.progress-text {
  text-align: center;
  padding: 1rem 0;
  color: #666;
  font-size: 0.9rem;
}

.bottom-nav {
  width: 100%;
  background: white;
  z-index: 10;
}

.nav-divider {
  height: 1px;
  background-color: #e0e0e0;
  width: 100%;
}

.btn-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
}

.pure-next-btn {
  background-color: #424242;
  color: white;
  border: none;
  padding: 12px 40px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.pure-next-btn:hover {
  background-color: #212121;
}

.pure-next-btn:active {
  transform: translateY(1px);
}
</style>
