<template>
  <router-view></router-view>
</template>

<script>
import Index from "./components/Home.vue";
import Login from "./components/Login.vue";
export default {
  name: "App",
  components: {
    Index,
    Login,
  },
  //解决在vuex状态无法保存的问题
  created() {
    // 先检查sessionStorage中是否有数据，若存在数据则加载到vuex
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
      // sessionStorage.removeItem("store");
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      console.log("存入session");
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
  },
};
</script>
<style lang="scss">
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden !important;
}
</style>