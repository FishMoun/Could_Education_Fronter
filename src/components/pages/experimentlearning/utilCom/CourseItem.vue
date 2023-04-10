<template>
  <el-row class="box">
    <el-card :body-style="{ padding: '0px' }">
      <img
        :src="course.avatar"
        @error="
          (e) => {
            e.target.src =
              'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png';
          }
        "
        class="image"
      />
      <div style="padding: 14px">
        <span class="overElpSingle" :title="course.name">{{
          course.name
        }}</span>
        <ul class="bottom">
          <li class="overElpSingle">学校：{{ course.school }}</li>
          <li class="overElpSingle">老师：{{ course.teacher }}</li>
          <li class="overElpSingle">班级：{{ course.class }}</li>
        </ul>
      </div>
    </el-card>
  </el-row>
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
  width: 100%;
  cursor: pointer;
}
:deep(.el-card__body:hover) {
  background-color: var(--el-color-primary-light-9);
}

.bottom {
  margin-top: 13px;
  line-height: 17px;
  font-size: 12px;
  color: #999;
}

.image {
  width: 100%;
  display: block;
}
</style>