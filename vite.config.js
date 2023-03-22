import {
	defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
	optimizeDeps: {
		include: [
			'pdfjs-dist/build/pdf',
			'pdfjs-dist/build/pdf.worker'
		]
	},
	plugins: [vue()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	}
	,
	server: {
		proxy: {
			//网盘
			'/cloudspace': {
				target: 'http://123.60.88.31:8001',
				changeOrigin: true,
				ws: true,
				rewrite: (path) => path.replace(/^\/cloudspace/, '')
			},
			// 用户登录鉴权服务
			'/ucenter': {
				target: 'http://123.60.88.31:8003',
				changeOrigin: true,
				ws: true,
				rewrite: (path) => path.replace(/^\/ucenter/, '')
			},
			//管理服务
			'/manager': {
				target: 'http://123.60.88.31:8002',
				changeOrigin: true,
				ws: true,
				rewrite: (path) => path.replace(/^\/manager/, '')
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
