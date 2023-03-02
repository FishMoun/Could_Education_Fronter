<template>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <side-bar></side-bar>
    </el-aside>
    <el-container>
      <el-header>
        <nav-bar :key="$route.path + 1"></nav-bar>
      </el-header>
      <el-main>
        <nav-list class="navList" :key="$route.path + 1"></nav-list>
        <div class="content">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SideBar from "./navbar/sideBar.vue";
import navList from "./navbar/navList.vue";
import navBar from "./navbar/navBar.vue";
import { useStore } from "vuex";
import { computed } from "vue";
export default {
  name: "Home",
  components: {
    SideBar,
    navList,
    navBar,
  },
  setup() {
    const store = useStore();
    const isCollapse = computed(() => store.state.isCollapse);
    return {
      isCollapse,
    };
  },
};
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
}

.el-header {
  height: 50px;
  line-height: 50px;
}

.el-aside {
  line-height: 200px;
  height: 100%;
  background-color: #ffffff;
}

.el-main {
  background-color: #f5f4f4;
  height: 100%;
  padding: 0;
}
.content {
  background-color: #fff;
  min-height: calc(100vh - 110px);
  width: 98%;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  margin: 10px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
</style>
