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
    Login
  },
};
</script>
<style>
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