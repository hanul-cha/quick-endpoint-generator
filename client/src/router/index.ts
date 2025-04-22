import { createRouter, createWebHistory } from 'vue-router'

import ChatView from '../views/ChatView.vue'
import DataView from '../views/DataView.vue'
import EndpointView from '../views/EndpointView.vue'
import LoginView from '../views/LoginView.vue'
import LogoutView from '../views/LogoutView.vue'
import RegisterView from '../views/RegisterView.vue'
import SchemaView from '../views/SchemaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/chat'
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutView
    },
    {
      path: '/data',
      name: 'data',
      component: DataView,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'schema',
          name: 'schema',
          component: SchemaView
        },
        {
          path: 'endpoint',
          name: 'endpoint',
          component: EndpointView
        }
      ]
    }
  ]
})

// 네비게이션 가드
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // 로그인이 필요한 라우트이고 토큰이 없는 경우
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router