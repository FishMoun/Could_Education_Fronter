import {
	defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		// 自动打开浏览器
		open: true,
		host: 'localhost',
		// 端口
		port: 3000,
		// https
		https: false,
		// 使用代理
		proxy: { // 本地开发环境通过代理实现跨域
			// 正则表达式写法
			'/api': {
				target: 'http://localhost:9090/', // 后端服务实际地址
				changeOrigin: true, //开启代理
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		}
	},

})
