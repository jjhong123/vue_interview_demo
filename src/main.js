import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@mdi/font/css/materialdesignicons.css'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
  },
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
})

const app = createApp(App)

console.log('testing gitaction deploy')

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
