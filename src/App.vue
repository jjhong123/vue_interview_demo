<template>
  <v-app>
    <component :is="currentLayout" />
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import EmptyLayout from '@/layouts/EmptyLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const route = useRoute()

const layouts = {
  EmptyLayout,
  DashboardLayout,
}

const currentLayout = computed(() => {
  const layoutName = route.meta.layout
  return layouts[layoutName] || EmptyLayout
})

console.log(`Environment: %c${import.meta.env.VITE_APP_ENV}`, 'color: #42b883')

console.log(`BASE API: %c${import.meta.env.VITE_API_URL}`, 'color: #1976d2;')
</script>
