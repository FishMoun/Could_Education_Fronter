<template>
  <div class="detailpage">
    <el-button
      @click="changemode"
      style="position: absolute; left: 0; top: 0"
      >{{ isTeacher ? "老师" : "学生" }}</el-button
    >
    <el-card shadow="never" class="boxcard">
      <template #header>
        <div class="card-header">
          <span class="homeworktitle">作业标题</span>
          <div v-show="isTeacher">
            <el-button type="primary">编辑作业</el-button>
            <el-button type="primary">批改作业</el-button>
          </div>
        </div>
      </template>
      <div>作业内容</div>
      <div>作业附件</div>
      <div v-show="!isTeacher">
        <richEditor />
        <div class="bottom-button">
          <el-button type="primary">提交作业</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import richEditor from "./utilItems/richEditor.vue";
export default {
  components: {
    richEditor,
  },
  data() {
    return {};
  },
  methods: {
    changemode() {
      this.$store.state.isTeacher = !this.$store.state.isTeacher;
    },
  },

  computed: {
    isTeacher() {
      return this.$store.state.isTeacher;
    },
  },
};
</script>

<style lang="scss" scoped>
.detailpage {
  display: flex;
  justify-content: space-around;

  .boxcard {
    width: 50vw;
    height: 85vh;
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .homeworktitle {
        font-size: 20px;
      }
    }
    .text {
      font-size: 14px;
    }
    .item {
      margin-bottom: 18px;
    }
    .bottom-button {
      margin-top: 10px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>