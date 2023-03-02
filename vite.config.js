import {
	defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	}
	,
	server: {
		// 自动打开浏览器
		// open: true,
		// host: 'localhost',
		// // 端口
		// port: 3000,
		// // https
		// https: false,
		proxy: {
			'/api': {
				// target: 'http://120.79.189.150:8001',
				target: 'http://10.195.12.78:9090',
				changeOrigin: true,
				ws: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			},
			'/downloadfile': {
				target: 'https://cloud-file-230201-1.oss-cn-hangzhou.aliyuncs.com',
				changeOrigin: true,
				ws: true,
				rewrite: (path) => path.replace(/^\/downloadfile/, '')
			},
			'/downloadvideo': {
				target: 'https://outin-4e3ea45da3a611ed940200163e1a3b4a.oss-cn-shanghai.aliyuncs.com',
				changeOrigin: true,
				ws: true,
				rewrite: (path) => path.replace(/^\/downloadvideo/, '')
			},

		}
	},

})
