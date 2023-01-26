<template>
  <router-view></router-view>
</template>

<script>
import Index from "./components/Index.vue";
import Login from "./components/Login.vue";
export default {
  name: "App",
  components: {
    Index,
    Login
  },
};
</script>
