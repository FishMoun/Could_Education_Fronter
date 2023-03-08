<template>
  这里是课程概览页面
  <el-button @click="goto">测试用，跳转到节次学习页面</el-button>
</template>

<script>
export default {
  name: "Courseview",
  methods: {
    goto() {
      this.$router.push({ path: "/classlearning" });
    },
  },
};
</script>

<style>
</style>