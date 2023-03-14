<template>
  <el-button @click="gotoAdmin">去管理员首页,测试用</el-button>
</template>

<script>
export default {
  name: "index",
  methods: {
    gotoAdmin() {
      console.log(this.$store.state.isAdmin);
      this.$store.state.isAdmin = !this.$store.state.isAdmin;
      this.$router.push("/coursemanagement");
    },
  },
};
</script>

<style>
</style>