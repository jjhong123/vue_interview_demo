<template>
  <v-row class="ma-0">
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
          <v-chip size="x-small" color="primary" variant="flat" class="me-2">標記題</v-chip>
          <span class="text-caption text-grey">請根據文中畫線/標記處回答</span>
        </div>

        <div class="text-body-1 font-weight-bold mb-6">
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
}

.html-content {
  line-height: 1.8;
  font-size: 1rem;
  color: #333;

  :deep(mark) {
    background-color: #333;
    color: #fff;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: bold;
    font-style: normal;
  }

  :deep(b) {
    color: #000;
  }
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .custom-option {
    display: flex;
    align-items: center;
    padding: 10px 14px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: #fafafa;
    }

    .option-prefix {
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      border-radius: 4px;
      margin-right: 12px;
      font-size: 0.85rem;
      font-weight: bold;
    }

    &.is-selected {
      border-color: #333;
      background-color: #f0f0f0;
      .option-prefix {
        background: #333;
        color: #fff;
      }
    }
  }
}
</style>
