import { createApp } from 'vue'
import App from './App.vue'
import router from './router/r_index'
import store from './store/s_index'

createApp(App).use(store).use(router).mount('#app')