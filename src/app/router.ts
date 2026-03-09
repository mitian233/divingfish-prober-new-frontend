import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DashboardLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/overview',
      },
      {
        path: 'overview',
        name: 'Overview',
        component: () => import('@/views/OverviewView.vue'),
        meta: { title: '总览' },
      },
      {
        path: 'maimai',
        name: 'Maimai',
        component: () => import('@/views/MaimaiView.vue'),
        meta: { title: '舞萌DX' },
      },
      {
        path: 'chuni',
        name: 'Chuni',
        component: () => import('@/views/ChuniView.vue'),
        meta: { title: '中二节奏' },
      },
      {
        path: 'tools',
        name: 'Tools',
        component: () => import('@/views/ToolsView.vue'),
        meta: { title: '工具' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/SettingsView.vue'),
        meta: { title: '个人设置' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} | maimaidx-prober`
  } else {
    document.title = 'maimaidx-prober'
  }
  next()
})

export default router
