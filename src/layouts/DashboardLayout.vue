<template>
  <v-layout full-height>
    <v-navigation-drawer v-model="drawer" color="primary" width="240" flat border="e" :mobile="isMobile">
      <v-list-item title="DEMO System" class="pa-4 font-weight-bold"></v-list-item>
      <v-divider class="opacity-20"></v-divider>
      <v-list nav density="compact">
        <v-list-item prepend-icon="mdi-view-dashboard-outline" title="Dashboard" to="/dashboard" exact></v-list-item>
        <v-list-item prepend-icon="mdi-book-open-outline" title="閱讀" to="/dashboard/reading"></v-list-item>
        <v-list-item prepend-icon="mdi-account-group-outline" title="聽力" to="/dashboard/listening"></v-list-item>
        <v-list-item prepend-icon="mdi-microphone-outline" title="口說" to="/dashboard/speaking"></v-list-item>
        <v-list-item prepend-icon="mdi-database-outline" title="CRUD" to="/dashboard/CRUD"></v-list-item>
        <v-list-item prepend-icon="mdi-google" title="Google Vision" to="/dashboard/google-vision"></v-list-item>
      </v-list>
      <template #append>
        <div class="pa-4">
          <v-btn block variant="tonal" size="large" class="text-none" @click="handleLogout">
            登出
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar color="white" elevation="0" border="b" density="compact">
      <v-app-bar-nav-icon color="primary" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title class="text-body-2 font-weight-bold text-primary">For Demo</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-chip variant="text" color="grey-darken-1" class="me-4">
        {{ userStore.userInfo.username }}
      </v-chip>
    </v-app-bar>

    <v-main class="bg-grey-lighten-5">
      <RouterView />
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const drawer = ref(true)
const router = useRouter()
const userStore = useUserStore()

const { width } = useDisplay()

const isMobile = computed(() => width.value < 1024)

watch(isMobile, (newVal) => {
  if (newVal) {
    drawer.value = false
  } else {
    drawer.value = true
  }
}, { immediate: true })

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>
