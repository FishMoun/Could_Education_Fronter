<template>
  <el-card :body-style="{ padding: '0px' }">
    <img :src="course.coverUrl" alt="尚无封面" class="image" />
    <div style="padding: 14px">
      <span class="overElpSingle" :title="course.name">{{ course.name }}</span>
      <ul class="bottom">
        <li class="overElpSingle">课程名：{{ course.courseName }}</li>
        <li class="overElpSingle">老师：{{ course.teachers?.join(",") }}</li>
        <li class="overElpSingle">
          上课周次：{{ course.beginWeek }}到{{ course.endWeek }}周
        </li>
      </ul>
    </div>
  </el-card>
</template>
  
<script>
export default {
  props: {
    course: {
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