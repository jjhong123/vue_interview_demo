<template>
  <div class="question-container">
    <h2 class="question-text">{{ data.question }}</h2>

    <div class="options-list">
      <div
        v-for="(text, key) in data.options"
        :key="key"
        class="option-item"
        :class="{ 'selected-style': picked === key }"
        @click="picked = key"
      >
        <div class="option-label">{{ key }}</div>
        <div class="option-content">{{ text }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ data: Object })
const picked = ref(null)
</script>

<style lang="scss" scoped>
.question-container {
  margin-top: 1.5rem;
  width: 100%;

  .question-text {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #1a1a1a;
    line-height: 1.4;
  }

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    .option-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      background-color: #fff;

      &:hover {
        background-color: #f9f9f9;
        border-color: #bbb;
      }

      .option-label {
        width: 32px;
        height: 32px;
        min-width: 32px;
        background: #eee;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        font-weight: bold;
        color: #555;
        transition: all 0.2s;
      }

      .option-content {
        font-size: 1.1rem;
        color: #333;
      }

      &.selected-style {
        background-color: #f0f0f0;
        border-color: #000 !important;

        .option-label {
          background: #000;
          color: #fff;
        }

        .option-content {
          font-weight: 500;
        }
      }
    }
  }
}
</style>
