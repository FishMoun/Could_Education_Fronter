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
      <el-button type="primary" @click="dialogVisible = true"
        >创建作业</el-button
      >
      <!-- 布置作业的对话框 -->
      <el-dialog
        v-model="dialogVisible"
        title="创建作业"
        width="40%"
        :before-close="handleClose"
      >
        <!-- 作业主体 -->
        <el-form :model="form" label-width="120px">
          <el-form-item label="选择课程:">
            <el-select
              v-model="form.courseId"
              :loading="loading"
              placeholder="选择课程"
            >
              <el-option
                v-for="item in courseIdOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="截止时间:">
            <el-date-picker
              v-model="form.date"
              type="datetime"
              placeholder="选择截止时间"
            />
          </el-form-item>

          <el-form-item label="作业标题:">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="主要内容:">
            <el-input
              v-model="form.content"
              :rows="4"
              type="textarea"
              resize="none"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogVisible = false">
              确认布置
            </el-button>
          </span>
        </template>
      </el-dialog>
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
            <el-button type="primary" @click="goToDetail">查看详细</el-button>
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
            <el-button type="primary" @click="goToDetail">查看详细</el-button>
            <el-button type="primary" @click="goToCorrect">去批改</el-button>
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
      loading: false,
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
      dialogVisible: false,
      form: {
        title: "",
        courseId: "",
        content: "",
        date: "",
      },
      courseIdOptions: null,
      //筛选项
      termValue: "",
      collegeValue: "",
      inputcourseId: "",
      inputcoursename: "",
      collegeoptions: [],
      termoptions: [],
    };
  },
  components: { Search },
  async mounted() {
    await this.searchCourseByTeaId();
  },
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
    async searchCourseByTeaId() {
      this.loading = true;
      if (!this.courseIdOptions) {
        let id = this.$store.state.userInfo.id;
        let res = await this.$request(
          `/admin/manager/course/list-teacher?id=${id}`,
          "",
          "get",
          "params",
          "json"
        );
        console.log(res);
      }
    },
    handleClose() {
      console.log("关闭");
      this.dialogVisible = false;
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