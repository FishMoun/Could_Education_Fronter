<template>
  <el-breadcrumb separator="/" class="bread-container">
    <el-breadcrumb-item v-for="item of breadcrumbList" :key="item.path">
      <span>{{ item.name }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      breadcrumbList: [],
    };
  },
  computed: {
  },
  created() {
    //替换面包屑导航
    let matched = this.$route.matched.filter((item) => item.name);
    // console.log(matched);
    const first = matched[0];
    // if (first && first.name !== "首页") {
    //   matched = [{ path: "/", name: "首页" }].concat(matched);
    // }
    this.breadcrumbList = matched;
  },
};
</script>

<style scoped>
.bread-container {
  margin-left: 20px;
  font-size: 15px;
  margin-top: -4px;
}
</style>