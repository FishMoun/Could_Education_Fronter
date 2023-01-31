<template>
  <div>
    <div class="tabs-view-container">
      <div class="tabs-wrapper">
        <span :class="isActive(item)" v-for="item of tabList" :index="item.path" :key="item.path" @click="goTo(item)">
          {{ item.name }}
          <el-icon style="vertical-align: middle" v-if="item.path != '/'" @click.stop="removeTab(item)">
            <Close />
          </el-icon>
        </span>
      </div>
      <div class="tabs-close-item" style="float:right" @click="closeAllTab">
        全部关闭
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router"
import { useStore } from "vuex"
import { computed, onMounted } from 'vue';
export default {
  name: "navList",
  setup() {
    const store = useStore()
    const tabList = computed(() => store.state.tabList)
    const route = useRoute()
    const router = useRouter()
    const currentRoute = computed(() => route.path)
    const isActive = computed(() => {
      return function (tab) {
        if (tab.path === route.path) {
          return "tabs-view-item-active";
        }
        return "tabs-view-item";
      }
    })
    const isFold = computed(() => {
      return store.state.collapse ? "el-icon-s-unfold" : "el-icon-s-fold";
    })
    onMounted(() => {
      store.dispatch("saveTab", route)
    })
    function goTo(tab) { //跳转标签
      router.push({ path: tab.path });
    }
    function removeTab(tab) { //删除标签
      store.commit("removeTab", tab);
      //如果删除的是当前页则返回上一标签页
      if (tab.path === route.path) {
        var tabList = store.state.tabList;
        router.push({ path: tabList[tabList.length - 1].path });
      }
    }
    function closeAllTab() {
      store.commit("resetTab");
      console.log(route.path);
      if (route.path != "/index") {
        router.push({ path: "/index" });
      } else {
        router.go(0);
      }
    }
    return {
      currentRoute,
      tabList,
      isActive,
      isFold,
      goTo,
      removeTab,
      closeAllTab

    }
  }
};
</script>

<style scoped>
.tabs-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  width: 95%;
}

.tabs-view-container {
  display: flex;
  position: relative;
  padding-left: 10px;
  padding-right: 10px;
  height: 36px;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}

.tabs-view-item {
  display: inline-block;
  cursor: pointer;
  height: 29px;
  line-height: 29px;
  border: 1px solid #d8dce5;
  color: #495060;
  background: #fff;
  padding: 0 8px;
  font-size: 15px;
  margin-top: 4px;
  margin-left: 5px;
  border-radius: 7px;
}

.tabs-close-item {
  position: absolute;
  right: 10px;
  display: inline-block;
  cursor: pointer;
  height: 29px;
  line-height: 29px;
  border: 1px solid #d8dce5;
  color: #495060;
  background: #fff;
  padding: 0 8px;
  font-size: 15px;
  margin-top: 4px;
  margin-left: 5px;
  border-radius: 7px;
}

.tabs-view-item-active {
  display: inline-block;
  cursor: pointer;
  height: 26px;
  line-height: 26px;
  padding: 0 8px;
  font-size: 15px;
  margin-top: 4px;
  margin-left: 5px;
  background-color: #3c8bf7;
  color: #fff;
  border-color: #3c8bf7;
  border-radius: 7px;
}

.tabs-view-item-active:before {
  content: "";
  background: #fff;
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
  margin-right: 2px;
}
</style>