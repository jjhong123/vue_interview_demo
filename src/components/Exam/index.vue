<template>
  <component :is="currentComponent" />
</template>

<script setup>
import { defineProps, computed } from 'vue'
import Reading from '@/components/Exam/Reading/index.vue'
import Listening from '@/components/Exam/Listening/index.vue'
const props = defineProps({
  class_type: String,
})

const currentComponent = computed(() => {
  switch (props.class_type) {
    case 'Reading':
      return Reading
    case 'Listening':
      return Listening
    default:
      return null
  }
})
</script>
