<template>
  <div class="pa-6">
    <Exam :class_type="class_type" />
  </div>
</template>

<script setup>
import Exam from '@/components/Exam/index.vue'
import { ref } from 'vue'

const class_type = ref('Listening')
</script>
