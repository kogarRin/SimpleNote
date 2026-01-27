import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../components/basicView/Home.vue'),
  },
  // {
  //   path: '/tools',
  //   name: 'tools',
  //   component: () => import('../components/tools/Tools.vue'),
  // },
  // {
  //   path: '/edit/:id',
  //   name: 'edit',
  //   component: () => import('../components/editAndShow/Edit.vue'),
  // },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../components/main/Setting.vue'),
  },
  // {
  //   path: '/showNote/:id',
  //   name: 'showNote',
  //   props: true,
  //   component: () => import('../components/editAndShow/showForm.vue'),
  // },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
