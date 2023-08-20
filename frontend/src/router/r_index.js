import { createRouter, createWebHashHistory } from 'vue-router'
import Landing from '../components/Landing.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: Landing
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
