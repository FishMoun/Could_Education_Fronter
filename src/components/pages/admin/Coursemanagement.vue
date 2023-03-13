<template>
  <el-container>
    <!-- 头部筛选部分 -->
    <el-header>
      <div class="searchbox">
        <el-select
          v-model="termValue"
          placeholder="学期选择"
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
          placeholder="院系选择"
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
          placeholder="输入课程号"
          style="margin-right: 10px"
        />
        <el-input
          v-model="inputcoursename"
          placeholder="输入课程名"
          style="margin-right: 10px"
        />
        <el-button @click="reset">重置</el-button>
        <el-button type="primary"
          ><el-icon><Search /></el-icon>查询</el-button
        >
      </div>
      <div class="buttonbox">
        <el-button type="primary" @click="dialogVisible = true"
          ><el-icon><Plus /></el-icon>新增课程</el-button
        >
      </div>
    </el-header>
    <el-main>
      <!-- 主体表格部分 -->
      <el-table :data="tableData" table-layout="fixed">
        <el-table-column prop="courseId" label="课程号" />
        <el-table-column prop="coursename" label="课程名" />
        <el-table-column label="课程封面">
          <template #default="{ row }">
            <div style="display: flex; align-items: center">
              <el-image :src="row.coversrc" />
            </div> </template
        ></el-table-column>
        <el-table-column prop="classhours" label="学时" />
        <el-table-column prop="credit" label="学分" />
        <el-table-column prop="category" label="课程类别" />
        <el-table-column prop="college" label="开课院系" />
        <el-table-column prop="week" label="上课周次" />
        <el-table-column prop="classroom" label="上课教室" />
        <el-table-column prop="teacher" label="任课教师" />
        <el-table-column prop="class" label="上课班级" />
        <el-table-column fixed="right" label="操作" width="200px">
          <template #default>
            <el-button type="primary" size="middle">编辑</el-button>
            <el-button type="danger" size="middle">删除</el-button>
          </template>
        </el-table-column>
      </el-table></el-main
    >
    <!-- 增加新的课程表单 -->
    <el-dialog
      v-model="dialogVisible"
      :fullscreen="true"
      title="添加新的课程"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="form" label-width="120px" :inline="true">
        <el-form-item label="课程名称：">
          <el-input v-model="form.coursename" />
        </el-form-item>
        <el-form-item label="课程号：">
          <el-input v-model="form.coursename" />
        </el-form-item>
        <el-form-item label="开课院系：">
          <el-select v-model="form.region" placeholder="选择院系">
            <el-option label="计信院" value="计信院" />
            <el-option label="智能院" value="智能院" />
          </el-select>
        </el-form-item>
        <el-form-item label="学时：">
          <el-input v-model="form.coursename" />
        </el-form-item>
        <el-form-item label="学分：">
          <el-input v-model="form.coursename" />
        </el-form-item>
        <el-form-item label="课程类别：">
          <el-radio-group v-model="form.resource">
            <el-radio label="必修" />
            <el-radio label="选修" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上课地点：">
          <el-input v-model="form.coursename" />
        </el-form-item>
        <el-form-item label="任课老师：">
          <el-select
            v-model="teachervalue"
            multiple
            filterable
            default-first-option
            :reserve-keyword="false"
            placeholder="选择老师"
          >
            <el-option
              v-for="item in teacherOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上课班级：">
          <el-select
            v-model="classvalue"
            multiple
            filterable
            allow-create
            :reserve-keyword="false"
            placeholder="选择班级"
          >
            <el-option
              v-for="item in classOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学年学期：">
          <el-select v-model="form.region" placeholder="选择学年学期">
            <el-option label="2022~2023第1学期" value="2022~2023第1学期" />
            <el-option label="2022~2023第2学期" value="2022~2023第2学期" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            确定添加
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script>
import { Search } from "@element-plus/icons-vue";

export default {
  data() {
    return {
      tableData: [
        {
          //课程号
          courseId: "12345",
          //课程名
          coursename: "数据库原理",
          //学时
          classhours: "48",
          coversrc: "/src/assets/img/default.jpg",
          //学分
          credit: "3",
          //课程类别
          category: "必修",
          //开课院系
          college: "计信院",
          //周次
          week: "6~10周",
          //上课地点
          classroom: "致高楼B101、致用楼B101",
          //任课教师
          teacher: "许卓明",
          //上课班级
          class: "软工20_1",
        },
        {
          //课程号
          courseId: "12345",
          //课程名
          coursename: "数据库原理",
          //学时
          classhours: "48",
          //学分
          credit: "3",
          //课程类别
          category: "必修",
          //开课院系
          college: "计信院",
          //任课教师
          teacher: "许卓明",
          //上课班级
          class: "软工20_1",
        },
        {
          //课程号
          courseId: "12345",
          //课程名
          coursename: "数据库原理",
          //学时
          classhours: "48",
          //学分
          credit: "3",
          //课程类别
          category: "必修",
          //开课院系
          college: "计信院",
          //任课教师
          teacher: "许卓明",
          //上课班级
          class: "软工20_1",
        },
        {
          //课程号
          courseId: "12345",
          //课程名
          coursename: "数据库原理",
          //学时
          classhours: "48",
          //学分
          credit: "3",
          //课程类别
          category: "必修",
          //开课院系
          college: "计信院",
          //任课教师
          teacher: "许卓明",
          //上课班级
          class: "软工20_1",
        },
        {
          //课程号
          courseId: "12345",
          //课程名
          coursename: "数据库原理",
          //学时
          classhours: "48",
          //学分
          credit: "3",
          //课程类别
          category: "必修",
          //开课院系
          college: "计信院",
          //任课教师
          teacher: "许卓明",
          //上课班级
          class: "软工20_1",
        },
      ],
      termValue: "",
      termoptions: [
        {
          value: "2022",
          label: "2022~2023第1学期",
        },
        {
          value: "2023",
          label: "2022~2023第2学期",
        },
      ],
      collegeValue: "",
      collegeoptions: [
        {
          value: "计信院",
          label: "计信院",
        },
        {
          value: "人工智能学院",
          label: "人工智能学院",
        },
      ],
      //查询的课程号和课程名
      inputcourseId: "",
      inputcoursename: "",
      dialogVisible: false,
      form: {
        coursename: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      //任课老师选择
      teachervalue: "",
      teacherOptions: [
        {
          value: "许卓明",
          label: "许卓明",
        },
        {
          value: "刘凡",
          label: "刘凡",
        },
        {
          value: "毛莺池",
          label: "毛莺池",
        },
      ],
      classvalue: "",
      classOptions: [
        {
          value: "软工20_1",
          label: "软工20_1",
        },
        {
          value: "软工20_2",
          label: "软工20_2",
        },
        {
          value: "软工20_3",
          label: "软工20_3",
        },
      ],
    };
  },
  components: { Search },
  methods: {
    reset() {
      this.termValue = "";
      this.collegeValue = "";
      this.inputcourseId = "";
      this.inputcoursename = "";
    },
  },
};
</script>

<style scoped>
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