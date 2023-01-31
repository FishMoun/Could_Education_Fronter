import { createStore } from 'vuex'
export default createStore({
  state: {
    isCollapse: false,
    tabList: []
  },
  mutations: {
    // 侧边栏折叠
    setCollapse(state) {
      state.isCollapse = !state.isCollapse;
    },
    // 保存标签
    saveTab(state, tab) {
      if (state.tabList.findIndex(item => item.path === tab.path) == -1) {
        state.tabList.push({ name: tab.name, path: tab.path });
      }
    },
    // 移除标签
    removeTab(state, tab) {
      var index = state.tabList.findIndex(item => item.name === tab.name);
      state.tabList.splice(index, 1);
    },
    // 重置标签
    resetTab(state) {
      state.tabList = [];
    },
    // 侧边栏折叠
    setCollapse(state) {
      state.isCollapse = !state.isCollapse;
    }
  },
  actions: {
    saveTab(context, data) {
      context.commit('saveTab', data);
    }
  },
  modules: {
  }
})

