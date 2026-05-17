<template>
  <component
    :is="questionComponents[reading[nowQuestionIndex].type]"
    :data="reading[nowQuestionIndex]"
  />

  <div class="action-bar d-flex justify-end pa-4">
    <v-btn
      color="grey-darken-3"
      variant="flat"
      size="large"
      class="next-btn px-8"
      @click="nextQuestion"
      :disabled="nowQuestionIndex === reading.length - 1"
    >
      <span>{{ nowQuestionIndex === reading.length - 1 ? '最後一題' : 'Next' }}</span>
    </v-btn>
  </div>
</template>

<script setup>
import { onUnmounted } from 'vue'
import SingleChoice from './question/SingleChoice.vue'
import MultipleChoice from './question/Multiplechoice.vue'
import Mark from './question/Mark.vue'
import FillinTheBlank from './question/FillinTheBlank.vue'
import { storeToRefs } from 'pinia'
import { useExamStore } from '@/stores/exam'
const examStore = useExamStore()

const { nowQuestionIndex, reading } = storeToRefs(examStore)

const questionComponents = {
  'single-choice': SingleChoice,
  'multiple-choice': MultipleChoice,
  'fill-in-the-blank': FillinTheBlank,
  mark: Mark,
}

function nextQuestion() {
  if (nowQuestionIndex.value < reading.value.length - 1) {
    nowQuestionIndex.value++
  }
}

onUnmounted(() => {
  nowQuestionIndex.value = 0
})
</script>

<style lang="scss" scoped>
.next-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 1px;
  border-radius: 8px;
  transition: transform 0.2s ease;
}
</style>
