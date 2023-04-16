<template>
  <el-container>
    <!-- 头部筛选区 -->
    <el-header>
      <div>
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
        <el-select
          v-model="collegeValue"
          placeholder="专业选择"
          style="margin-right: 10px"
        >
          <el-option
            v-for="item in collegeoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="selectPartCourseByCondition"
          ><el-icon><Search /></el-icon>查询</el-button
        >
      </div>
      <div class="buttonbox">
        <el-button type="primary"
          ><el-icon><Plus /></el-icon>新增班级</el-button
        >
      </div></el-header
    >
    <!-- 主体表格区 -->
    <el-main>
      <el-table v-loading="loading" :data="tableData" table-layout="fixed">
        <el-table-column prop="classId" label="班级ID" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="college" label="学院" />
        <el-table-column prop="major" label="专业" />
        <el-table-column fixed="right" label="操作" width="200px">
          <template #default="{ row }">
            <el-button type="primary">编辑</el-button>
            <el-button type="danger" @click="deleteClassById(row.classId)"
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
      collegeValue: "",
      collegeoptions: [
        {
          value: "计算机与信息学院",
          label: "计算机与信息学院",
        },
        {
          value: "人工智能学院",
          label: "人工智能学院",
        },
      ],
    };
  },
  methods: {
    //查询所有的班级信息
    async getAllClassInfo() {
      let res = await this.$request(
        "/admin/manager/class/list",
        "",
        "get",
        "params",
        "json"
      );
      let classes = res?.data.data.classes;
      for (let i = 0; i < classes.length; ++i) {
        this.tableData[i] = {
          classId: classes[i].id,
          name: classes[i].name,
          college: classes[i].department,
          major: classes[i].major,
        };
      }
    },
    async deleteClassById(classId) {
      let tmpparams = {
        id: classId,
      };
      let res = await this.$request(
        "/admin/manager/class/remove",
        tmpparams,
        "delete",
        "params",
        "json"
      );
      this.getAllClassInfo();
    },
  },
  mounted() {
    //初始化学生列表
    this.getAllClassInfo();
  },
};
</script>
  
  <style scoped>
.buttonbox {
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>