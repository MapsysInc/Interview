import { createRouter, createWebHashHistory } from 'vue-router'
import vHome from '../views/vHome.vue'
import vNewDocument from '../views/vNewDocument.vue'
import vPdfList from '../views/vPdfList.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: vHome,
  },
  {
    path:'/newDocument',
    name: 'newDocument',
    component: vNewDocument
  },
  {
    path:'/pdfList',
    name: 'pdfList',
    component: vPdfList
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
