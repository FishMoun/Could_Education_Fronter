<template>
  <el-container>
    <!-- 头部筛选区 -->
    <el-header>
      <el-select
        v-model="termValue"
        placeholder="班级选择"
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
        placeholder="院系选择"
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
        placeholder="输入Id"
        style="margin-right: 10px"
      />
      <el-input
        v-model="inputcoursename"
        placeholder="输入姓名"
        style="margin-right: 10px"
      />
      <el-button @click="reset">重置</el-button>
      <el-button type="primary" @click="selectPartCourseByCondition"
        ><el-icon><Search /></el-icon>查询</el-button
      ></el-header
    >
    <!-- 主体表格区 -->
    <el-main>
      <el-table v-loading="loading" :data="tableData" table-layout="fixed">
        <el-table-column prop="stuId" label="学生ID" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="gender" label="姓别" />
        <el-table-column prop="college" label="学院" />
        <el-table-column prop="major" label="专业" />
        <el-table-column prop="class" label="班级" />
        <el-table-column fixed="right" label="操作" width="200px">
          <template #default="{ row }">
            <!-- <el-button type="primary">编辑</el-button> -->
            <el-button type="danger" @click="deleteStudentById(row.stuId)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      tableData: [],
    };
  },
  methods: {
    //查询所有的学生信息
    async getAllStudentInfo() {
      let res = await this.$request(
        "/admin/manager/student/list",
        "",
        "get",
        "params",
        "json"
      );
      let students = res?.data.data.students;
      for (let i = 0; i < students.length; ++i) {
        this.tableData[i] = {
          stuId: students[i].id,
          name: students[i].name,
          gender: students[i].gender ? "男" : "女",
          college: students[i].department,
          major: students[i].major,
          class: students[i].className,
        };
      }
    },
    async deleteStudentById(stuId) {
      let tmpparams = {
        id: stuId,
      };
      let res = await this.$request(
        "/admin/manager/student/remove",
        tmpparams,
        "delete",
        "params",
        "json"
      );
      this.getAllStudentInfo();
    },
  },
  mounted() {
    //初始化学生列表
    this.getAllStudentInfo();
  },
};
</script>

<style scoped>
.el-header {
  display: flex;
  justify-content: left;
  align-items: center;
}
.el-input {
  width: auto;
}
</style>