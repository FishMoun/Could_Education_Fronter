<template>
  <el-button
    @click="changemode"
    style="position: absolute; right: 0; top: 0"
    v-show="false"
    >{{ isTeacher ? "老师" : "学生" }}</el-button
  >
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
            :key="item.courseId"
            :label="item.courseName"
            :value="item.courseId"
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
          ><el-icon> <Search /> </el-icon>查询</el-button
        >
      </div>
      <el-button type="primary" v-if="isTeacher" @click="dialogVisible = true"
        >创建作业</el-button
      >
      <!-- 布置作业的对话框 -->
      <el-dialog
        v-model="dialogVisible"
        title="创建作业"
        width="60%"
        :before-close="handleClose"
      >
        <!-- 作业主体 -->
        <el-form :model="form" label-width="120px">
          <div class="addHomework">
            <el-form-item label="作业名:">
              <el-input v-model="form.name" />
            </el-form-item>
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
            <el-form-item label="开始时间:">
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                placeholder="选择开始时间"
                value-format="YYYY-MM-DD hh:mm:ss"
              />
            </el-form-item>
            <el-form-item label="截止时间:">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="选择截止时间"
                value-format="YYYY-MM-DD hh:mm:ss"
              />
            </el-form-item>
            <div v-for="(item, index) in form.homeworks">
              <el-form-item :label="`题目${index + 1}`">
                <el-input
                  v-model="item.context"
                  :rows="4"
                  type="textarea"
                  resize="none"
                />
              </el-form-item>
              <el-form-item label="参考答案:">
                <el-input
                  v-model="item.refAnswer"
                  :rows="2"
                  type="textarea"
                  resize="none"
                />
              </el-form-item>
              <el-button
                style="float: right"
                @click="addProblem"
                v-if="index + 1 === form.homeworks.length"
                >+添加题目</el-button
              >
            </div>
          </div>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addHomeWork">
              确认布置
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-header>
    <el-main>
      <!-- 主体表格部分 学生-->
      <el-table
        :data="stuTableData"
        class="tableBox"
        table-layout="fixed"
        v-if="!isTeacher"
      >
        <el-table-column prop="homeworkId" label="作业编号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="courseName" label="来源课程" />
        <!-- <el-table-column prop="srcclass" label="来源小节" /> -->
        <el-table-column prop="beginTime" label="发布时间" />
        <el-table-column prop="endTime" label="截止时间" />
        <el-table-column prop="status" label="完成状态" />
        <el-table-column fixed="right" label="操作" width="200px">
          <template #default="scope">
            <el-button type="primary" @click="goToDetail(scope.row.homeworkId)"
              >查看详细</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table
        :data="teaTableData"
        class="tableBox"
        table-layout="fixed"
        v-else
      >
        <el-table-column prop="homeworkId" label="作业编号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="courseName" label="来源课程" />
        <!-- <el-table-column prop="srcclass" label="来源小节" /> -->
        <el-table-column prop="beginTime" label="发布时间" />
        <el-table-column prop="endTime" label="截止时间" />
        <el-table-column prop="status" label="状态" />
        <el-table-column fixed="right" label="操作" width="200px">
          <template #default="scope">
            <el-button
              type="primary"
              @click="goToDetail(scope.row.homeworkId)"
              v-show="!isTeacher"
              >查看详细</el-button
            >
            <el-button type="primary" @click="goToCorrect(scope.row.homeworkId)"
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
import {
  getCoursesById,
  getSemestersById,
  getCoursesBySem,
} from "../../../network/api";
import { ElMessage } from "element-plus";
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
        name: "",
        courseId: "",
        startTime: "",
        endTime: "",
        homeworks: [
          {
            context: "",
            refAnswer: "",
          },
        ],
      },
      courseIdOptions: null,
      //筛选项
      termValue: "",
      collegeValue: "",
      inputcourseId: "",
      inputcoursename: "",
      collegeoptions: [],
      termoptions: [],
      //课程信息，用于创建作业
      courses: [],
    };
  },
  components: { Search },
  async mounted() {
    // 获取课程信息
    this.getCourses();
    // 获取学生端的作业信息
    this.getStuHomeworks();
    // 获取教师端的作业信息
    this.getTeaHomeworks();
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
    async goToDetail(homeworkId) {
      this.$router.push({ path: `/homeworkdetail/${homeworkId}` });
    },
    //去批改页面
    goToCorrect(homeworkId) {
      this.$router.push({ path: `/homeworkcorrect/${homeworkId}` });
    },
    handleClose() {
      console.log("关闭");
      this.dialogVisible = false;
    },
    addProblem() {
      this.form.homeworks = this.form.homeworks.concat({
        context: "",
        refAnswer: "",
      });

      console.log("ccc");
    },
    async getCourses() {
      // 获取课程信息
      try {
        let userid = this.$store.state.userInfo.id;
        let res = await getCoursesById(userid);
        let courses = JSON.parse(JSON.stringify(res.data.data.courses));
        this.courses = courses;
        console.log(courses);
      } catch (e) {
        console.log(e);
      }
      const courseOptions = this.courses.map((item) => {
        return {
          value: item.courseId,
          label: item.courseName,
        };
      });
      this.courseIdOptions = courseOptions;
      console.log(courseOptions);
    },
    async getStuHomeworks() {
      const curUser = await this.getRoleId();
      let homeworkList = await this.$request(
        // 需要学生id而不是用户id
        `/manager/course-homework/list-student/${curUser}`,
        "",
        "get",
        "params",
        "json"
      );
      homeworkList = homeworkList.data.data.homeworks.map((item) => ({
        ...item,
        status: item.marked ? "已完成" : "未完成",
      }));
      this.stuTableData = homeworkList;
      console.log(homeworkList);
    },
    async getTeaHomeworks() {
      const curUser = await this.getRoleId();
      let teaHomeworkList = await this.$request(
        // 需要教师id而不是用户id
        // `/manager/course-homework/list-teacher/${curUser.id}`,
        `/manager/course-homework/list-teacher/${curUser}`,
        "",
        "get",
        "params",
        "json"
      );
      teaHomeworkList = teaHomeworkList.data.data.homeworks.map((item) => ({
        ...item,
        status: item.outdated ? "已过期" : "进行中",
      }));
      console.log(teaHomeworkList);
      this.teaTableData = teaHomeworkList;
    },
    async getRoleId() {
      const curUser = this.$store.state.userInfo;
      console.log(curUser.id);
      try {
        let userRoleId = await this.$request(
          `/api/manager/user/user-role-id/${curUser.id}`,
          "",
          "get"
        );
        userRoleId =
          userRoleId.data.data?.teacherId || userRoleId.data.data?.studentId;
        console.log(userRoleId);
        return userRoleId;
      } catch (e) {
        console.log(e);
      }
    },
    addHomeWork() {
      //布置作业
      const userinfo = this.$store.state.userInfo;
      const { name, startTime, endTime, courseId, homeworks } = this.form;
      const curCourse = this.courses.filter(
        (item) => item.courseId === courseId
      )[0];
      console.log(curCourse);
      const teacherId = curCourse.teachers.filter(
        (item) => item.userId === userinfo.id
      )[0].id;
      if (!name || !startTime || !endTime || !courseId || !teacherId) {
        ElMessage.success("请完整填写作业相关信息！");
        return;
      }
      this.$request(
        `/manager/course-homework/save?beginTime=${startTime}&courseId=${courseId}&endTime=${endTime}&name=${name}&teacherId=${teacherId}`,
        homeworks,
        "post",
        "params",
        "json"
      ).then(
        (res) => {
          this.dialogVisible = false;
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
      // 获取学生端的作业信息
      this.getStuHomeworks();
      // 获取教师端的作业信息
      this.getTeaHomeworks();
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

.addHomework {
  max-height: 400px;
  overflow-y: scroll;
}

.tableBox {
  height: 70vh;
}

// .searchbox {}

// .buttonbox {}
</style>