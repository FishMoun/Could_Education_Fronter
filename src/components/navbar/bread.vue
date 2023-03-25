<template>
  <el-breadcrumb separator="/" class="bread-container">
    <el-breadcrumb-item v-for="item of breadcrumbList" :key="item.path">
      <span v-if="item.name !== 'mycloudspace'">{{ item.name }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { useRoute } from "vue-router";
import { reactive, onMounted } from "vue";
export default {
  name: "bread",
  setup() {
    const route = useRoute();
    let breadcrumbList = reactive(route.matched.filter((item) => item.name));
    return {
      breadcrumbList,
    };
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