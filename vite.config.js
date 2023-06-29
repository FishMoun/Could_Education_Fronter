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
			//后端网关地址
			'/api': {
				target: 'http://10.195.12.78:9000/',
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
