<template>
  <el-button @click="goToTerminal">跳转到命令行界面</el-button>
</template>

<script>
export default {
  methods: {
    goToTerminal() {
      this.$router.push("/terminal");
    },
  },
};
</script>

<style>
</style>