<template>
  <v-container class="fill-height fill-width d-flex align-center justify-center bg-grey-lighten-4">
    <v-row justify="center" align="center" class="w-100" style="max-width: 1200px;">

      <v-col cols="12" class="text-center mb-8">
        <h1 class="text-h3 font-weight-bold text-grey-darken-3 mb-2">Frontend Developer Portfolio</h1>
        <p class="text-subtitle-1 text-grey-darken-1">點擊下方卡片檢視精選專案作品</p>
      </v-col>

      <v-col v-for="project in projects" :key="project.routeName" cols="12" sm="6" md="4">
        <v-card class="mx-auto project-card" max-width="360" elevation="2">
          <v-img :src="project.image" height="200px" cover class="bg-grey-lighten-2"></v-img>

          <v-card-item>
            <v-card-title class="font-weight-bold">{{ project.title }}</v-card-title>
          </v-card-item>

          <v-card-text class="text-body-2 text-grey-darken-1" style="overflow: hidden;">
            {{ project.description }}
          </v-card-text>

          <v-divider class="mx-4"></v-divider>

          <v-card-actions class="justify-end pa-4">
            <v-btn color="primary" variant="elevated" prepend-icon="mdi-arrow-right-drop-circle-outline"
              @click="enterProject(project.routeName)">
              進入專案
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const projects = [
  {
    title: 'Demo管理系統',
    description: '作品1',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500',
    routeName: 'Dashboard',
  },
  {
    title: '台灣地圖',
    description: '作品2',
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500',
    routeName: 'Taiwan',
  }
]

const enterProject = (routeName) => {
  router.push({ name: routeName })
}
</script>

<style scoped>
.project-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15) !important;
}
</style>