<template>
  <el-container>
    <el-main>
      <el-descriptions title="个人基本信息" border>
        <el-descriptions-item label="姓名">{{
          userInfo.name
        }}</el-descriptions-item>
        <el-descriptions-item label="身份">{{
          userInfo.state
        }}</el-descriptions-item>
        <el-descriptions-item label="账号">{{
          userInfo.account
        }}</el-descriptions-item>

        <el-descriptions-item label="性别">{{
          userInfo.gender
        }}</el-descriptions-item>
        <el-descriptions-item label="学院">{{
          userInfo.academy
        }}</el-descriptions-item>
        <template v-if="!isTeacher">
          <el-descriptions-item label="班级">{{
            userInfo.class
          }}</el-descriptions-item>
          <el-descriptions-item label="专业">{{
            userInfo.major
          }}</el-descriptions-item>
        </template>
      </el-descriptions></el-main
    >
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        name: "",
        state: "",
        account: "",
        gender: "",
        academy: "",
        class: "",
        major: "",
      },
    };
  },
  computed: {
    isTeacher() {
      return this.$store.state.isTeacher;
    },
  },
  async mounted() {
    await this.getUserInfo();
    console.log(this.userInfo);
  },
  methods: {
    async getUserInfo() {
      let id = this.$store.state.stateId;
      let res;
      if (this.isTeacher) {
        res = await this.$request(
          `/admin/manager/teacher/get/${id}`,
          "",
          "get",
          "params",
          "json"
        );
        console.log(res);
        let teacher = res.data.data.teacher;
        this.userInfo = {
          academy: teacher.department,
          gender: teacher.gender ? "男" : "女",
          name: teacher.name,
          account: this.$store.state.userInfo.userName,
          state: this.isTeacher ? "教师" : "学生",
        };
      } else {
        res = await this.$request(
          `/admin/manager/student/get/${id}`,
          "",
          "get",
          "params",
          "json"
        );
        console.log(res);

        let student = res.data.data.student;
        let classname = await this.getClassName(student.classId);
        if (classname) {
          this.userInfo = {
            name: student.name,
            academy: student.department,
            gender: student.gender ? "男" : "女",
            major: student.major,
            account: this.$store.state.userInfo.userName,
            class: classname,
            state: this.isTeacher ? "教师" : "学生",
          };
        }
      }
    },
    async getClassName(id) {
      let res = await this.$request(
        `/admin/manager/class/get/${id}`,
        "",
        "get",
        "params",
        "json"
      );
      if (res && res.data.code === 20000) {
        return res.data.data.class.name;
      }
      return "";
    },
  },
};
</script>

<style scoped>
.el-header span {
  font-size: 25px;
  font-weight: 550;
}
:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 50px;
}
</style>
