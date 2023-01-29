<template>
  <div class="nav-container">
    <div class="left-container">
      <div class="change" @click="setCollapse">
        <el-icon
          :class="
            isCollapse ? 'close el-icon-s-unfold' : 'close el-icon-s-fold'
          "
        />
      </div>
      <bread></bread>
    </div>
    <div class="right-container">
      <div class="btn-fullscreen" @click="handleFullScreen">
        <el-tooltip
          effect="dark"
          :content="fullscreen ? `取消全屏` : `全屏`"
          placement="bottom"
        >
          <i style="font-size:23px" class="el-icon-full-screen"></i>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>

import { mapMutations, mapState } from "vuex";
import Bread from './bread.vue';
export default {
  data() {
    return {
      fullscreen: false
    };
  },
  components: {
    Bread

  },
  computed: {
    ...mapState(["isCollapse"]),
  },
  methods: {
    ...mapMutations(["setCollapse"]),
    // 全屏事件
    handleFullScreen() {
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
    },
  },
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
.btn-fullscreen{
  cursor: pointer;
}
</style>