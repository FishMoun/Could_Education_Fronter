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
//引入二次封装的axios
import { request } from './network/request';
//引入视频播放组件
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'

const app = createApp(App)

app.config.globalProperties.$request = request;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
//使用pdf预览插件
// app.use(pdf);
//使用elementui
app.use(ElementPlus)
//使用vue-router
app.use(router)
//使用vuex
app.use(store)
//使用video
app.use(VueVideoPlayer)
app.mount('#app')