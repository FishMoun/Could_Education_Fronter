<template>
  这里是课程概览页面
  <el-button @click="goto">测试用，跳转到节次学习页面</el-button>
  <el-scrollbar class="timelinebox">
    <el-timeline style="margin: 2px">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :hollow="activity.hollow"
        :timestamp="activity.timestamp"
        placement="top"
      >
        <el-card :body-style="{ padding: '0px' }">
          <div class="card-content">
            <div class="card-main">
              <h2>{{ activity.title }}</h2>
              <span style="color: #909399"
                >{{ activity.teacher }} {{ activity.weekth }}</span
              >
              <p>课程介绍：</p>
            </div>
            <div class="card-button">
              <el-tooltip
                content="进入学习"
                placement="right"
                effect="light"
                hide-after="10"
              >
                <el-button style="height: 100%; width: 100%" @click="goto"
                  ><el-icon><DArrowRight /></el-icon
                ></el-button>
              </el-tooltip>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </el-scrollbar>
</template>

<script>
export default {
  name: "Courseview",
  data() {
    return {
      activities: [
        {
          timestamp: "2023-3-10 8:00",
          size: "large",
          type: "primary",
          title: "数据库绪论",
          teacher: "许卓明",
          weekth: "周五第1~2节",
          overview: "",
        },
        {
          timestamp: "2023-3-11 8:00",
          size: "large",
          type: "primary",
          title: "数据库绪论",
          teacher: "许卓明",
          weekth: "周五第1~2节",
          overview: "",
        },
        {
          timestamp: "2023-3-12 8:00",
          size: "large",
          color: "#0bbd87",
          title: "数据库绪论",
          teacher: "许卓明",
          weekth: "周五第1~2节",
          overview: "",
        },
        {
          timestamp: "2023-3-13 8:00",
          size: "large",
          title: "",
          title: "数据库绪论",
          teacher: "许卓明",
          weekth: "周五第1~2节",
          overview: "",
        },
        {
          timestamp: "2023-3-14 8:00",
          title: "",
          title: "数据库绪论",
          teacher: "许卓明",
          weekth: "周五第1~2节",
          overview: "",
        },
      ],
    };
  },
  methods: {
    goto() {
      this.$router.push({ path: "/classlearning" });
    },
  },
};
</script>

<style>
.timelinebox {
  position: absolute;
  top: 10%;
  left: 30%;
  height: 80%;
  width: auto;
  padding-right: 40px;
}
.card-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  --el-card-padding: 0;
  height: 150px;
  width: 500px;
}
.card-main {
  margin: 10px 10px 10px 20px;
  width: 300px;
  height: 100px;
}
.card-button {
  width: 50px;
  height: 100%;
}
</style>