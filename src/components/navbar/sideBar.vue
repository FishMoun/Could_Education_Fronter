<template>
  <div class="logo-container">
    <img src="/src/assets/logo.png" />
    <span v-if="!isCollapse">教学管理系统</span>
  </div>
  <el-menu :default-active="$route.path" class="el-menu-vertical-demo" :unique-opened="true" :collapse="isCollapse"
    :collapse-transition="false" background-color="#ffffff" active-text-color="#46a6ff" router>
    <template v-for="item in asideMenu">
      <template v-if="item.submenu">
        <el-sub-menu :index="item.path">
          <template #title>
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="'#icon-' + item.icon"></use>
            </svg>
            <span>{{ item.label }}</span>
          </template>
          <template v-for="subItem in item.submenu">
            <el-menu-item :index="subItem.path" class="subitem">
              {{ subItem.label }}
            </el-menu-item>
          </template>
        </el-sub-menu>
      </template>
      <template v-else>
        <el-menu-item :index="item.path">
          <template #title>
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="'#icon-' + item.icon"></use>
            </svg>
            <span>{{ item.label }}</span>
          </template>
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</template>

<script>
import { reactive } from 'vue';
export default {
  name: "sideBar",
  setup() {
    const asideMenu = reactive([
      {
        path: "/index",
        name: "index",
        label: "首页",
        icon: "shouye-shouye",
      },
      {
        path: "/courselearning",
        name: "courselearning",
        label: "课程学习",
        icon: "kecheng",
        submenu: [
          {
            path: "/mycourse",
            name: "mycourse",
            label: "我的课程",
          }
        ],
      },
      {
        path: "/experimentlearning",
        name: "experimentlearning",
        label: "实验学习",
        icon: "shiyani",
        submenu: [
          {
            path: "/myexperiment",
            label: "我的实验",
            name: "myexperiment",
          },
          {
            path: "/onlineexperiment",
            label: "在线实验",
            name: "onlineexperiment",
          },
        ],
      },
      {
        path: "/message",
        name: "message",
        label: "消息",
        icon: "xiaoxi",
        submenu: [
          {
            path: "/websitemessage",
            label: "站内消息",
            name: "websitemessage",
          },
          {
            path: "/interactivemessage",
            label: "互动消息",
            name: "interactivemessage",
          },
        ],
      },
      {
        path: "/mine",
        name: "mine",
        label: "我的",
        icon: "wode",
        submenu: [
          {
            path: "/accountmanagement",
            label: "账号管理",
            name: "accountmanagement",
          },
          {
            path: "/homeworkmanagement",
            label: "作业管理",
            name: "homeworkmanagement",
          },
          {
            path: "/studysituation",
            label: "学习情况",
            name: "studysituation",
          },
        ],
      }
    ])
    return {
      asideMenu
    }
  }

};
</script>

<style lang="scss" scoped>
.logo-container {
  width: 100%;
  height: 80px;
  line-height: 90px;
  padding-left: 1em;
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid #f5f4f4;
}

.el-menu {
  border-right: none;
}



.subitem {
  margin-left: 20px;
  width: 100%
}



.icon {
  width: 1.2em;
  height: 1.2em;
  vertical-align: -0.25em;
  fill: currentColor;
  overflow: hidden;
  margin-right: 7px;
  font-size: 22px;
  margin-bottom: -2px;
}

img {
  vertical-align: middle;
}
</style>