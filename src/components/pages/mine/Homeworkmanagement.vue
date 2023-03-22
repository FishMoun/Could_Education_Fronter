<template>
  <el-button @click="changemode" style="position: absolute; right: 0; top: 0">{{
    isTeacher ? "老师" : "学生"
  }}</el-button>
  <el-container>
    <!-- 头部筛选部分 -->
    <el-header>
      <div class="searchbox">
        <el-select
          v-model="termValue"
          placeholder="课程选择"
          size="middle"
          style="margin-right: 10px"
        >
          <el-option
            v-for="item in termoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="collegeValue"
          placeholder="完成状态选择"
          size="middle"
          style="margin-right: 10px"
        >
          <el-option
            v-for="item in collegeoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="inputcourseId"
          placeholder="输入作业名称"
          style="margin-right: 10px"
        />
        <el-button @click="reset">重置</el-button>
        <el-button type="primary"
          ><el-icon><Search /></el-icon>查询</el-button
        >
      </div>
      <div class="buttonbox"></div>
    </el-header>
    <el-main>
      <!-- 主体表格部分 学生-->
      <el-table :data="stuTableData" table-layout="fixed" v-if="!isTeacher">
        <el-table-column prop="homeworkId" label="作业编号" />
        <el-table-column prop="homeworkname" label="名称" />
        <el-table-column prop="srccourse" label="来源课程" />
        <el-table-column prop="srcclass" label="来源小节" />
        <el-table-column prop="teacher" label="布置老师" />
        <el-table-column prop="begintime" label="发布时间" />
        <el-table-column prop="deadline" label="截止时间" />
        <el-table-column prop="state" label="完成状态" />
        <el-table-column fixed="right" label="操作" width="200px">
          <template #default>
            <el-button type="primary" size="middle" @click="goToDetail"
              >查看详细</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="stuTableData" table-layout="fixed" v-else>
        <el-table-column prop="homeworkId" label="作业编号" />
        <el-table-column prop="homeworkname" label="名称" />
        <el-table-column prop="srccourse" label="来源课程" />
        <el-table-column prop="srcclass" label="来源小节" />
        <el-table-column prop="begintime" label="发布时间" />
        <el-table-column prop="deadline" label="截止时间" />
        <el-table-column prop="state" label="状态" />
        <el-table-column fixed="right" label="操作" width="200px">
          <template #default>
            <el-button type="primary" size="middle" @click="goToDetail"
              >查看详细</el-button
            >
            <el-button type="primary" size="middle" @click="goToCorrect"
              >去批改</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 主体表格部分 老师 -->
    </el-main>
  </el-container>
</template>

<script>
import { Search } from "@element-plus/icons-vue";
export default {
  data() {
    return {
      stuTableData: [
        {
          homeworkId: "1",
          homeworkname: "数据库绪论",
          srccourse: "数据库",
          srcclass: "1_1",
          teacher: "许卓名",
          begintime: "2023-3-20",
          deadline: "2023-3-27",
          state: "未完成",
        },
      ],
      teaTableData: [],
    };
  },
  components: { Search },
  methods: {
    changemode() {
      this.$store.state.isTeacher = !this.$store.state.isTeacher;
    },
    reset() {
      this.termValue = "";
      this.collegeValue = "";
      this.inputcourseId = "";
      this.inputcoursename = "";
    },
    //去详情页面
    goToDetail() {
      this.$router.push({ name: "作业详细" });
    },
    //去批改页面
    goToCorrect() {
      this.$router.push({ name: "作业批改" });
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
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-main {
  display: flex;
  justify-items: center;
}
.el-input {
  width: auto;
}
.searchbox {
}
.buttonbox {
}
</style>