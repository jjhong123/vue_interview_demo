<template>
  <v-container class="fill-blank-view py-8" max-width="800">
    <div class="text-h5 font-weight-bold mb-6 text-center text-grey-darken-3">
      {{ data.question_title }}
    </div>

    <v-alert density="compact" type="info" variant="tonal" class="mb-8" border="start">
      {{ data.question }}
    </v-alert>

    <div class="article-paper pa-5">
      <div class="article-content">
        <template v-for="(segment, index) in questionSegments" :key="index">
          <span v-if="segment.type === 'text'" v-html="segment.content"></span>

          <span v-else class="input-wrapper">
            <input
              v-if="data.blanks && data.blanks[segment.id]"
              v-model="data.blanks[segment.id].value"
              type="text"
              class="inline-blank"
              :style="{ width: '100px' }"
              :placeholder="`${segment.id}`"
            />
          </span>
        </template>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const questionSegments = computed(() => {
  if (!props.data?.article) return []

  const regex = /(<fill-in-the-blank-\d+>.*?<\/fill-in-the-blank-\d+\/>)/g
  const parts = props.data.article.split(regex)

  return parts.map((part) => {
    const match = part.match(/<fill-in-the-blank-(\d+)>/)
    if (match) {
      return {
        type: 'input',
        id: match[1],
      }
    }
    return {
      type: 'text',
      content: part,
    }
  })
})
</script>

<style lang="scss" scoped>
.fill-blank-view {
  margin: 0 auto;
}

.article-paper {
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.article-content {
  color: #2c3e50;
  line-height: 2;
  word-break: break-word;

  .input-wrapper {
    display: inline-flex;
    vertical-align: middle;
    margin: 0 6px;
  }

  .inline-blank {
    border: none;
    border-bottom: 2px solid #333;
    text-align: center;
    font-weight: 700;
    color: #1976d2;
    outline: none;
    background: transparent;
    transition: all 0.2s;

    &:focus {
      border-bottom-color: #1976d2;
      background-color: rgba(25, 118, 210, 0.05);
    }

    &::placeholder {
      font-size: 0.8rem;
      color: #ccc;
    }
  }
}

:deep(b) {
  color: #000;
}
:deep(br) {
  display: block;
  content: '';
  margin-bottom: 10px;
}
</style>
