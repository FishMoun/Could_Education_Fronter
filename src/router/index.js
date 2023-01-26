
import { createRouter, createWebHashHistory } from 'vue-router'
// 导入需要进行路由的组件
import Index from "../components/Index.vue"
import Login from "../components/Login.vue"
// 创建路由对象
const router = createRouter({
	// 指定路由的工作模式
	history: createWebHashHistory(),
	// 声明路由的匹配规则
	routes: [
		{
			name: 'login',
			path: '/', //默认路径
			component: Login,
		},
		{
			//配置路由规则
			name: 'index',
			path: '/index', //默认路径
			component: Index,
		},
	]
})

//这个位置可以添加路由守卫....

// 导出路由对象
export default router