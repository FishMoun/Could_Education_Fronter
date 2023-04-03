<template>
  这是我的实验
  <el-button @click="goToEditFlow">去编辑节点</el-button>
</template>

<script>
export default {
  methods: {
    goToEditFlow() {
      this.$router.push({ path: "/editflow" });
    },
  },
};
</script>

<style>
</style>