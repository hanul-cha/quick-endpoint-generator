import { createRouter, createWebHistory } from 'vue-router'

import DataView from '../views/DataView.vue'
import EndpointView from '../views/EndpointView.vue'
import LoginView from '../views/LoginView.vue'
import LogoutView from '../views/LogoutView.vue'
import RegisterView from '../views/RegisterView.vue'
import SchemaView from '../views/SchemaView.vue'
import TableView from '@/views/TableView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/data/endpoint'
    },
    // {
    //   path: '/chat',
    //   name: 'chat',
    //   component: ChatView,
    //   meta: { requiresAuth: true }
    // },
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
      path: '/table/:tableId',
      name: 'table',
      component: TableView,
      meta: { requiresAuth: true }
    },
    {
      path: '/data',
      name: 'data',
      component: DataView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/data/endpoint'
        },
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

// 토큰의 만료 시간을 확인하는 함수
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000 // 초를 밀리초로 변환
    return Date.now() >= exp
  } catch (error) {
    return true // 토큰 파싱에 실패하면 만료된 것으로 간주
  }
}

// 네비게이션 가드
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // 로그인이 필요한 라우트이고 토큰이 없거나 만료된 경우
  if (to.meta.requiresAuth && (!token || isTokenExpired(token))) {
    localStorage.removeItem('token') // 만료된 토큰 제거
    next('/login')
  } else {
    next()
  }
})

export default router