<template>
  <el-card :body-style="{ padding: '0px' }">
    <img :src="experiment.coverUrl" alt="尚无封面" class="image" />
    <div style="padding: 14px">
      <span class="overElpSingle" :title="experiment.name">{{
        experiment.name
      }}</span>
      <ul class="bottom">
        <li class="overElpSingle">来源课程: {{ experiment.courseName }}</li>
        <li class="overElpSingle">实验名称: {{ experiment.expName }}</li>
        <li class="overElpSingle">老师: {{ experiment.teachers.join(",") }}</li>
      </ul>
    </div>
  </el-card>
</template>
  
<script>
export default {
  props: {
    experiment: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>
  
<style scoped>
.box {
  width: 50%;
}
:deep(.el-card__body:hover) {
  background-color: var(--el-color-primary-light-9);
}
.el-card {
  width: 250px;
  cursor: pointer;
}
.bottom {
  margin-top: 13px;
  line-height: 17px;
  font-size: 15px;
  color: #999;
}

.image {
  width: 100%;
  height: 150px;
  display: block;
}
</style>