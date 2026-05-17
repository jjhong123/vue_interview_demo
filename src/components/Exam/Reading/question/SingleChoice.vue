<template>
  <v-row no-gutters class="ma-0">
    <v-col cols="12" md="7" class="reading-pane pa-4">
      <div class="text-subtitle-1 font-weight-bold mb-3 text-grey-darken-3">
        {{ data.question_title }}
      </div>

      <div class="article-container">
        <div class="html-content" v-html="data.article"></div>
      </div>
    </v-col>

    <v-col cols="12" md="5" class="question-pane pa-4 bg-grey-lighten-5">
      <v-card flat border class="rounded-lg pa-4">
        <div class="d-flex align-center mb-4">
          <v-chip size="x-small" color="secondary" variant="flat" class="me-2">單選題</v-chip>
          <span class="text-caption text-grey">請選擇正確的選項</span>
        </div>

        <div class="text-body-1 font-weight-bold mb-4">
          {{ data.question }}
        </div>

        <div class="options-container">
          <div
            v-for="(text, key) in data.options"
            :key="key"
            class="custom-option"
            :class="{ 'is-selected': selected === key }"
            @click="selected = key"
          >
            <div class="option-prefix">{{ key }}</div>
            <div class="option-text">{{ text }}</div>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const selected = ref(null)
</script>

<style lang="scss" scoped>
.reading-pane {
  @media (min-width: 840) {
    border-right: 1px solid #dcdcdc;
  }
}

.reading-pane,
.question-pane {
  height: 100%;
  overflow-y: auto;
}

.article-container {
  height: 600px;
  padding: 16px;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 10px;
  }
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 6px;

  .custom-option {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background-color: #f9f9f9;
      border-color: #ccc;
    }

    .option-prefix {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f0f0;
      border-radius: 3px;
      margin-right: 10px;
      font-size: 0.85rem;
      font-weight: bold;
      color: #777;
    }

    .option-text {
      flex: 1;
      font-size: 0.9rem;
      line-height: 1.4;
      color: #444;
    }

    &.is-selected {
      border-color: #333;
      background-color: #f4f4f4;

      .option-prefix {
        background: #333;
        color: white;
      }

      .option-text {
        color: #000;
        font-weight: 600;
      }
    }
  }
}

.html-content {
  line-height: 1.7;
  font-size: 0.95rem;
  color: #333;

  :deep(b) {
    color: #000;
    font-weight: 700;
  }
  :deep(br) {
    content: '';
    display: block;
    margin-bottom: 0.5em;
  }
}
</style>
