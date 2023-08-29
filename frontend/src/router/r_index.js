import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '../components/Layout.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Layout
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
