
import { createRouter, createWebHashHistory } from 'vue-router'
// 导入需要进行路由的组件
import Home from "../components/Home.vue"
import Login from "../components/Login.vue"
import Index from "../components/pages/index/Index.vue"

import Courselearning from "../components/pages/courselearning/Courselearning.vue"
import Mycourse from "../components/pages/courselearning/Mycourse.vue"
import Courseview from "../components/pages/courselearning/Courseview.vue"
import Classlearning from "../components/pages/courselearning/Classlearning.vue"

import Experimentlearning from "../components/pages/experimentlearning/Experimentlearning.vue"
import Myexperiment from "../components/pages/experimentlearning/Myexperiment.vue"
import Onlineexperiment from "../components/pages/experimentlearning/Onlineexperiment.vue"

import Message from "../components/pages/message/Message.vue"
import Coursemessage from "../components/pages/message/Coursemessage.vue"
import Interactivemessage from "../components/pages/message/Interactivemessage.vue"

import Mine from "../components/pages/mine/Mine.vue"
import MyCloudSpace from "../components/pages/mine/MyCloudSpace.vue"
import Accountmanagement from "../components/pages/mine/Accountmanagement.vue"
import Homeworkmanagement from "../components/pages/mine/Homeworkmanagement.vue"
import Studysituation from "../components/pages/mine/Studysituation.vue"
import Homeworkdetail from "../components/pages/mine/Homeworkdetail.vue"
import Homeworkcorrect from "../components/pages/mine/Homeworkcorrect.vue"

import Coursemanagement from "../components/pages/admin/Coursemanagement.vue"
import Stumanagement from "../components/pages/admin/Stumanagement.vue"
import Teamanagement from "../components/pages/admin/Teamanagement.vue"
// 创建路由对象
const router = createRouter({
	// 指定路由的工作模式
	history: createWebHashHistory(),
	// 声明路由的匹配规则
	routes: [
		{
			name: '登录',
			path: '/',
			component: Login,
		},
		{
			path: "/home",
			name: "教学管理系统",
			component: Home,
			redirect: '/index',
			children: [
				// #region 学生路由 
				{
					path: "/index",
					name: "首页",
					component: Index,
				},
				{
					path: "/courselearning",
					name: "课程学习",
					component: Courselearning,
					redirect: "/mycourse",
					children: [
						{
							path: "/mycourse",
							name: "我的课程",
							component: Mycourse,
						}, {
							path: "/courseview",
							name: "课程概览",
							component: Courseview,
						}, {
							path: "/classlearning",
							name: "节次学习",
							component: Classlearning,
						},
					]
				},
				{
					path: "/experimentlearning",
					name: "实验学习",
					component: Experimentlearning,
					redirect: "/myexperiment",
					children: [
						{
							path: "/myexperiment",
							name: "我的实验",
							component: Myexperiment,
						}, {
							path: "/onlineexperiment",
							name: "在线实验",
							component: Onlineexperiment,
						}
					],
				},
				{
					path: "/message",
					name: "消息",
					component: Message,
					redirect: "/coursemessage",
					children: [
						{
							path: "/coursemessage",
							name: "课程消息",
							component: Coursemessage,
						}, {
							path: "/interactivemessage",
							name: "互动消息",
							component: Interactivemessage,
						}
					],
				},
				{
					path: "/mine",
					name: "我的",
					component: Mine,
					redirect: "/accountmanagement",
					children: [
						{
							path: "/accountmanagement",
							name: "账号管理",
							component: Accountmanagement,
						}, {
							path: "/homeworkmanagement",
							name: "作业管理",
							component: Homeworkmanagement,
						},
						//作业管理下路由
						{
							path: "/homeworkdetail",
							name: "作业详细",
							component: Homeworkdetail,
						},
						//作业批改
						{
							path: "/homeworkcorrect",
							name: "作业批改",
							component: Homeworkcorrect,
						},
						{
							path: "/studysituation",
							name: "学习情况",
							component: Studysituation,
						}, {
							path: "/mycloudspace",
							component: MyCloudSpace,
							name: '个人云盘',
							redirect: '/mycloudspace/%2Froot',
							children: [
								{ path: '/mycloudspace', redirect: '/mycloudspace/%2Froot' },
								{ path: '/mycloudspace/:path', name: 'mycloudspace', component: MyCloudSpace },
							]
						},
					]
				},
				// #endregion
				// #region 管理员路由
				{
					path: "/coursemanagement",
					name: "课程管理",
					component: Coursemanagement,

				},
				{
					path: "/stumanagement",
					name: "学生管理",
					component: Stumanagement,
				},
				{
					path: "/teamanagement",
					name: "教师管理",
					component: Teamanagement,
				},
				// #endregion 
			],
		},

	]
})

//这个位置可以添加路由守卫....

// 导出路由对象
export default router