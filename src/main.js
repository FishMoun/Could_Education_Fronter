import { createApp } from 'vue'
import App from './App.vue'
//引入elementui
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入Vuerouter
import router from './router'
//引入Vuex
import store from './store'
import './assets/ali-icon/iconfont.js'
const app = createApp(App)
//使用elementui
app.use(ElementPlus)
//使用vue-router
app.use(router)
//使用vuex
app.use(store)
app.mount('#app')