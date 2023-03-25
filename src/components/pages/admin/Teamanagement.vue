<template>
  <el-container>
    <!-- 头部筛选区 -->
    <el-header> </el-header>
    <!-- 主体表格区 -->
    <el-main>
      <el-table v-loading="loading" :data="tableData" table-layout="fixed">
        <el-table-column prop="teaId" label="教师ID" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="gender" label="姓别" />
        <el-table-column prop="college" label="学院" />
        <el-table-column fixed="right" label="操作" width="200px">
          <template #default="{ row }">
            <el-button type="primary">编辑</el-button>
            <el-button type="danger" @click="deleteTeacherById(row.teaId)"
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
      tableData: [
        {
          teaId: "",
          name: "",
          gender: "",
          college: "",
        },
      ],
    };
  },
  methods: {
    //查询所有的老师信息
    async getAllTeacherInfo() {
      let res = await this.$request(
        "/admin/manager/teacher/list",
        "",
        "get",
        "params",
        "json"
      );
      let teachers = res?.data.data.teachers;
      for (let i = 0; i < teachers.length; ++i) {
        this.tableData[i] = {
          teaId: teachers[i].id,
          name: teachers[i].name,
          gender: teachers[i].gender ? "男" : "女",
          college: teachers[i].department,
        };
      }
    },
    //根据Id删除某个学生的信息
    async deleteTeacherById(teaId) {
      console.log(1);
      let tmpparams = {
        id: teaId,
      };
      let res = await this.$request(
        "/admin/manager/teacher/remove",
        tmpparams,
        "delete",
        "params",
        "json"
      );
      this.getAllTeacherInfo();
    },
  },
  mounted() {
    //初始化教师列表
    this.getAllTeacherInfo();
  },
};
</script>

<style>
</style>