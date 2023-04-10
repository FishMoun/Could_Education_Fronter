<template>
  <el-button @click="gotoAdmin" style="position: absolute; z-index: 1"
    >去管理员首页,测试用</el-button
  >
  <el-row>
    <el-col :span="14">
      <div class="left-wrapper">
        <el-card shadow="never" class="left-card">学习简报</el-card>
        <el-card shadow="never" class="left-card">通知 </el-card>
        <el-card shadow="never" class="left-card"> 作业</el-card>
      </div>
    </el-col>
    <el-col :span="10">
      <div class="right-wrapper">
        <el-card shadow="never" class="right-card">最近资源 </el-card>
      </div>
    </el-col>
  </el-row>
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
.left-wrapper {
  display: flex;
  flex-direction: column;
  height: 88vh;
  justify-content: space-around;
  align-items: center;
}
.right-wrapper {
  display: flex;
  flex-direction: column;
  height: 88vh;
  align-items: center;
}
.left-card {
  width: 90%;
  height: 30%;
}
.right-card {
  width: 90%;
  height: 90%;
  margin-top: 15px;
}
</style>