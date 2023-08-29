import { createRouter, createWebHashHistory } from 'vue-router'
import vHome from '../views/vHome.vue'
import vNewDocument from '../views/vNewDocument.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: vHome,
  },
  {
    path:'/newDocument',
    name: 'newDocument',
    comopnent: vNewDocument
  },
  // {
  //   path:'/:id',
  //   name: ':id',
  //   component: DocumentDisplay
  // },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
