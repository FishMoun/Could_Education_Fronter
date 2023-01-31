<template>
  <div class="nav-container">
    <div class="left-container">
      <div class="change" @click="setCollapse">
        <el-icon>
          <Fold v-show="!isCollapse" />
          <Expand v-show="isCollapse" />
        </el-icon>
      </div>
      <bread></bread>
    </div>
    <div class="right-container">
      <el-dropdown style="margin-right:10px">
        <span class="el-dropdown-link">
          admin
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>账号管理</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="btn-fullscreen" @click="handleFullScreen">
        <el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom">
          <el-icon>
            <FullScreen />
          </el-icon>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>

import { useStore, mapMutations } from "vuex";
import bread from "./bread.vue";
import { ref, computed } from 'vue';
export default {
  name: "navBar",
  components: {
    bread
  },
  setup() {
    const fullscreen = ref(false)
    const store = useStore()
    const isCollapse = computed(() => store.state.isCollapse)
    const storeMutations = mapMutations(['setCollapse'])
    //全屏
    function handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    }
    return {
      fullscreen,
      isCollapse,
      ...storeMutations,
      handleFullScreen
    }
  }

};
</script>

<style lang="scss" scoped>
.nav-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  line-height: 50px;
  align-items: center;
}

.change {
  cursor: pointer;
  font-size: 26px;
}

.left-container {
  display: flex;
  justify-content: left;
  align-items: center;
}

.right-container {
  display: flex;
  justify-content: right;
  align-items: center;
}

.right-container .icon {
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin-right: 15px;
}

.btn-fullscreen {
  cursor: pointer;
}
</style>