<template>
  <v-main class="bg-grey-lighten-4 d-flex align-center justify-center" style="min-height: 100vh">
    <v-card width="320" border flat rounded="lg" class="pa-2">
      <v-card-item class="text-center pb-0">
        <v-card-title class="font-weight-bold text-body-1 mb-2">Demo System</v-card-title>
      </v-card-item>

      <v-card-text>
        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="username"
            label="帳號"
            density="compact"
            variant="outlined"
            prepend-inner-icon="mdi-account-outline"
            color="primary"
            class="mb-1"
            hide-details="auto"
            autocomplete="username"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="密碼"
            type="password"
            density="compact"
            variant="outlined"
            prepend-inner-icon="mdi-lock-outline"
            color="primary"
            hide-details="auto"
            class="mt-3"
            autocomplete="current-password"
            @keyup.enter="handleLogin"
          ></v-text-field>
        </v-form>

        <v-fade-transition>
          <v-alert
            v-if="error"
            type="error"
            variant="text"
            density="compact"
            class="mt-2 text-caption pa-0"
          >
            帳號或密碼不正確
          </v-alert>
        </v-fade-transition>
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-btn
          block
          color="primary"
          variant="flat"
          height="40"
          class="text-none font-weight-bold"
          @click="handleLogin"
        >
          登入
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const error = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) return
  try {
    await userStore.login({
      username: username.value,
      password: password.value,
    })
    router.push({ name: 'Overview' })
  } catch (err) {
    console.log(err)
    error.value = true
    setTimeout(() => {
      error.value = false
    }, 3000)
  }
}
</script>
