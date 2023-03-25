<template>
  <el-container>
    <!-- 头部筛选区 -->
    <el-header> </el-header>
    <!-- 主体表格区 -->
    <el-main>
      <el-table v-loading="loading" :data="tableData" table-layout="fixed">
        <el-table-column prop="stuId" label="学生ID" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="gender" label="姓别" />
        <el-table-column prop="college" label="学院" />
        <el-table-column prop="class" label="班级" />
        <el-table-column fixed="right" label="操作" width="200px">
          <template #default>
            <el-button type="primary">编辑</el-button>
            <el-button type="danger">删除</el-button>
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
          stuId: "",
          name: "",
          gender: "",
          college: "",
          class: "",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style>
</style>