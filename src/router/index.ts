import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../components/basicView/Home.vue'),
  },
  // {
  //   path: '/tools',
  //   name: 'tools',
  //   component: () => import('../components/tools/Tools.vue'),
  // },
  {
    path: '/:id/edit',
    name: 'edit',
    component: () => import('../components/edit/EditView.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../components/main/Setting.vue'),
  },
  {
    path: '/:id/showNote',
    name: 'showNote',
    props: true,
    component: () => import('../components/main/NoteContent.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
