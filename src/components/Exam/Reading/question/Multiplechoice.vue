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
          <v-chip size="x-small" color="secondary" variant="flat" class="me-2">多選題</v-chip>
          <span class="text-caption text-grey">請選擇所有正確的選項</span>
        </div>

        <div class="text-body-1 font-weight-bold mb-6">
          {{ data.question }}
        </div>

        <div class="options-container">
          <div
            v-for="(text, key) in data.options"
            :key="key"
            class="custom-option"
            :class="{ 'is-selected': isSelected(key) }"
            @click="toggleOption(key)"
          >
            <div class="option-prefix">
              <v-icon v-if="isSelected(key)" size="14">mdi-check</v-icon>
              <span v-else>{{ key }}</span>
            </div>
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

const selected = ref([])

const isSelected = (key) => selected.value.includes(key)

const toggleOption = (key) => {
  const index = selected.value.indexOf(key)
  if (index > -1) {
    selected.value.splice(index, 1)
  } else {
    selected.value.push(key)
  }
}
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
  gap: 8px;

  .custom-option {
    display: flex;
    align-items: center;
    padding: 10px 14px;
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;

    &:hover {
      background-color: #fafafa;
      border-color: #d1d1d1;
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
      font-size: 0.9rem;
      font-weight: 600;
      color: #666;
    }

    .option-text {
      flex: 1;
      font-size: 0.95rem;
      color: #333;
    }

    &.is-selected {
      border-color: #333;
      background-color: rgba(0, 0, 0, 0.04);

      .option-prefix {
        background: #333;
        color: white;
      }

      .option-text {
        color: #000;
        font-weight: 500;
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
}
</style>
