import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useExamStore } from '@/stores/exam'

const routes = [
  {
    path: '/',
    name: 'PortfolioHome',
    component: () => import('@/views/PortfolioHome.vue'),
    meta: { layout: 'EmptyLayout' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { layout: 'EmptyLayout' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { layout: 'DashboardLayout', requiresAuth: true },
    async beforeEnter(to, from) {
      const examStore = useExamStore()
      examStore.isLoading = true
      await examStore.getExamData()
      examStore.isLoading = false
      return true
    },
    children: [
      {
        path: '',
        name: 'Overview',
        component: () => import('@/views/Overview.vue'),
      },
      {
        path: 'reading',
        name: 'Reading',
        component: () => import('@/views/Reading.vue'),
      },
      {
        path: 'listening',
        name: 'Listening',
        component: () => import('@/views/Listening.vue'),
      },
      {
        path: 'speaking',
        name: 'Speaking',
        component: () => import('@/views/Speaking.vue'),
      },
      {
        path: 'CRUD',
        name: 'CRUD',
        component: () => import('@/views/CRUD.vue'),
      },
      {
        path: 'google-vision',
        name: 'GoogleVision',
        component: () => import('@/views/GoogleVision.vue'),
      },
    ],
  },
  {
    path: '/taiwan',
    name: 'Taiwan',
    component: () => import('@/views/TaiwanView.vue'),
    meta: { layout: 'EmptyLayout' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.token) {
    return { name: 'Login' }
  }

  if (to.name === 'Login' && userStore.token) {
    return { name: 'Overview' }
  }

  return true
})

export default router