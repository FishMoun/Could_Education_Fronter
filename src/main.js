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
//引入图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
//使用elementui
app.use(ElementPlus)
//使用vue-router
app.use(router)
//使用vuex
app.use(store)
app.mount('#app')