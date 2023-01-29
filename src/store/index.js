import { createStore } from 'vuex'
export default createStore({
  state: {
    isCollapse: false,

  },
  mutations: {
    // 侧边栏折叠
    setCollapse(state) {
      state.isCollapse = !state.isCollapse;
    },
  },
  actions: {
  },
  modules: {
  }
})

