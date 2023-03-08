<template>
  这是我的课程
  <el-button @click="goto">测试用，跳转到课程概览界面</el-button>
</template>

<script>
export default {
  methods: {
    goto() {
      this.$router.push("/courseview");
    },
  },
};
</script>

<style>
</style>