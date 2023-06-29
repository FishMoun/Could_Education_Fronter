<template>
  <el-container>
    <!-- 头部筛选部分 -->
    <el-header>
      <div class="searchbox">
        <el-select
          v-model="termValue"
          placeholder="学期选择"
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
          placeholder="输入课程号"
          style="margin-right: 10px"
        />
        <el-input
          v-model="inputcoursename"
          placeholder="输入课程名"
          style="margin-right: 10px"
        />
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="selectPartCourseByCondition"
          ><el-icon><Search /></el-icon>查询</el-button
        >
      </div>
      <div class="buttonbox">
        <el-button type="primary" @click="addNewCourse"
          ><el-icon><Plus /></el-icon>新增课程</el-button
        >
      </div>
    </el-header>
    <el-main>
      <!-- 主体表格部分 -->
      <el-table v-loading="loading" :data="tableData" table-layout="fixed">
        <el-table-column prop="courseId" label="课程号" />
        <el-table-column prop="coursename" label="课程名" />
        <el-table-column label="课程封面">
          <template #default="{ row }">
            <el-image
              :src="row.coversrc"
              style="width: 100px; height: 100px"
            /> </template
        ></el-table-column>
        <el-table-column prop="classhours" label="学时" />
        <el-table-column prop="credit" label="学分" />
        <el-table-column prop="category" label="课程类别" />
        <el-table-column prop="college" label="开课院系" />
        <el-table-column prop="week" label="上课周次" />
        <el-table-column prop="teacher" label="任课教师" />
        <el-table-column prop="class" label="上课班级" />
        <el-table-column fixed="right" label="操作" width="200px">
          <template #default="{ row }">
            <!-- <el-button type="primary" @click="editForm(row.courseId)"
              >编辑</el-button
            > -->
            <el-button type="danger" @click="deleteCourseById(row.courseId)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table></el-main
    >
    <!-- 增加新的课程表单 -->
    <el-dialog
      v-model="dialogVisible"
      :fullscreen="true"
      :title="isCreate ? '添加新的课程' : '编辑该课程'"
      center
      :close-on-press-escape="false"
    >
      <el-steps
        style="width: 300px"
        :space="300"
        :active="step"
        process-status="process"
        finish-status="success"
        align-center
      >
        <el-step :title="(isCreate ? '添加' : '编辑') + '基本课程信息'" />
        <el-step :title="(isCreate ? '添加' : '编辑') + '课程小节信息'" />
      </el-steps>
      <el-form :model="form" label-width="120px" :inline="true">
        <div class="left-form" v-if="step === 0">
          <el-form-item label="课程名称：">
            <el-input v-model="form.coursename" />
          </el-form-item>
          <el-form-item label="课程号：">
            <el-input v-model="form.courseid" />
          </el-form-item>
          <el-form-item label="开课院系：">
            <el-select v-model="form.college" placeholder="选择院系">
              <el-option label="计算机与信息学院" value="计算机与信息学院" />
              <el-option label="智能院" value="智能院" />
            </el-select>
          </el-form-item>
          <el-form-item label="学时：">
            <el-input v-model="form.coursehour" type="number" />
          </el-form-item>
          <el-form-item label="学分：">
            <el-input v-model="form.credit" type="number" />
          </el-form-item>
          <el-form-item label="课程类别：" style="width: 300px">
            <el-radio-group v-model="form.category">
              <el-radio label="必修" />
              <el-radio label="选修" />
            </el-radio-group>
          </el-form-item>

          <el-form-item label="任课教师：">
            <el-select
              v-model="form.teacher"
              :loading="teacherloading"
              remote
              :remote-method="searchRemoteTeachers"
              remote-show-suffix
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
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="上课班级：">
            <el-select
              v-model="form.class"
              :loading="classloading"
              remote
              :remote-method="searchRemoteClasses"
              remote-show-suffix
              multiple
              filterable
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
            <el-select v-model="form.term" placeholder="选择学年学期">
              <el-option label="2022~2023第1学期" value="2022-1" />
              <el-option label="2022~2023第2学期" value="2022-2" />
            </el-select>
          </el-form-item>
          <el-form-item label="开始周次：">
            <el-input v-model="form.beginweek" type="number" />
          </el-form-item>
          <el-form-item label="结束周次：">
            <el-input v-model="form.endweek" type="number" />
          </el-form-item>
          <el-form-item label="上传封面：">
            <el-upload
              v-model:file-list="fileList"
              class="upload-demo"
              action="http://60.204.141.214:30801/eduoss/fileoss/upload-cover"
              style="width: 150px"
              :on-progress="onProgressCover"
              :on-success="onCoverSuccess"
            >
              <el-button type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </div>
        <div class="right-form" v-else>
          <div class="right-form-item">
            <el-form-item label="开始周次：">
              <el-input v-model="form.c_beginweek" type="number" />
            </el-form-item>
            <el-form-item label="结束周次：">
              <el-input v-model="form.c_endweek" type="number" />
            </el-form-item>
            <el-form-item label="选择周几：">
              <el-input v-model="form.weekth" type="number" />
            </el-form-item>
            <el-form-item label="上课教室：">
              <el-input v-model="form.c_classroom" />
            </el-form-item>
            <el-form-item label="开始节次：">
              <el-input v-model="form.beginclass" type="number" />
            </el-form-item>
            <el-form-item label="结束节次：">
              <el-input v-model="form.endclass" type="number" />
            </el-form-item>

            <el-form-item label="上课老师：">
              <el-select
                v-model="form.c_teacher"
                placeholder="选择老师"
                no-data-text="尚未选择老师，请在上一步中添加"
              >
                <el-option
                  v-for="item in c_teacherOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="right-form-button">
            <el-button @click="getBatchClassList">批量增加</el-button>
          </div>
          <h3>小节列表</h3>
          <el-scrollbar class="right-form-list">
            <el-tag
              v-for="tag in tempClassList"
              :key="tag"
              class="classtag"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ generateTag(tag) }}
            </el-tag>
          </el-scrollbar>
        </div>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="quitForm">退出</el-button>
          <!-- <el-button @click="PressSubmitBasicButton">提交基本信息</el-button> -->
          <el-button
            type="primary"
            v-show="this.step === 1"
            @click="this.step = 0"
            >上一步</el-button
          >
          <el-button type="primary" @click="goToNext">
            {{ this.step === 0 ? "下一步" : "完成" }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script>
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
export default {
  data() {
    return {
      //课程上传封面
      fileList: [],
      //教师远程搜索加载项
      teacherloading: false,
      //班级远程搜索加载项
      classloading: false,
      //步骤1是否提交表单
      isStepOneFinished: false,
      //步骤条
      step: 0,
      //加载
      loading: true,
      tableData: [
        //测试数据
        // {
        //   //课程号
        //   courseId: "12345",
        //   //课程名
        //   coursename: "数据库原理",
        //   //学时
        //   classhours: "48",
        //   coversrc: "/src/assets/img/default.jpg",
        //   //学分
        //   credit: "3",
        //   //课程类别
        //   category: "必修",
        //   //开课院系
        //   college: "计信院",
        //   //周次
        //   week: "6~10周",
        //   //上课地点
        //   classroom: "致高楼B101、致用楼B101",
        //   //任课教师
        //   teacher: "许卓明",
        //   //上课班级
        //   class: "软工20_1",
        // },
      ],
      //筛选条件
      //学期学年
      termValue: "",
      termoptions: [
        {
          value: "2022-1",
          label: "2022~2023第1学期",
        },
        {
          value: "2022-2",
          label: "2022~2023第2学期",
        },
      ],
      //学院
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
      //查询的课程号和课程名
      inputcourseId: "",
      inputcoursename: "",
      dialogVisible: false,
      isCreate: true,
      form: {
        //课程信息
        coursename: "",
        courseid: "",
        coursehour: 48,
        credit: 3,
        college: "",
        category: "",
        classroom: "",
        teacher: [],
        class: [],
        term: "",
        coverUrl: "",
        //排课信息
        beginclass: "",
        endclass: "",
        beginweek: 1,
        endweek: 12,
        weekth: "",
        c_classroom: "",
        c_teacher: [],
        c_beginweek: 1,
        c_endweek: 12,
      },
      //任课老师选择
      teacherOptions: [],
      //上课班级选择
      classOptions: [],
      //缓存的全部教师列表
      teachersList: [],
      //缓存的班级列表
      classesList: [],
      //缓存的小节列表
      tempClassList: [],
      //拷贝的表单
      copyform: {},
      //是否已提交基本信息
    };
  },
  computed: {
    c_teacherOptions() {
      return this.form.teacher;
    },
  },
  components: { Search },
  methods: {
    //按下提交基本信息的按钮
    // PressSubmitBasicButton(){
    onProgressCover(res) {
      console.log(res);
    },
    // }
    //上传课程封面的接口
    onCoverSuccess(res) {
      console.log(res);
      if (res && res.code === 20000) {
        this.form.coverUrl = res.data.url;
        ElMessage.success("上传成功！");
      } else {
        ElMessage.error("上传失败，请稍后重试！");
      }
    },
    //新增课程
    addNewCourse() {
      this.isCreate = true;
      this.dialogVisible = true;
    },
    reset() {
      this.termValue = "";
      this.collegeValue = "";
      this.inputcourseId = "";
      this.inputcoursename = "";
    },
    // #region 标签方法
    handleClose(tag) {
      this.tempClassList.splice(this.tempClassList.indexOf(tag), 1);
    },
    // #endregion
    //新增课程信息
    async submitCourseForm() {
      //数据预处理
      let yearandterm = this.form.term.split("-");
      let tmptype = true;
      if (this.form.category === "选修") tmptype = false;
      const tmpform = {
        course: {
          id: this.form.courseid,
          name: this.form.coursename,
          creditHour: this.form.coursehour,
          creditNum: this.form.credit,
          //课程类型
          type: tmptype,
          year: Number(yearandterm[0]),
          department: this.form.college,
          term: Number(yearandterm[1]),
          beginWeek: this.form.beginweek,
          endWeek: this.form.endweek,
          coverUrl: this.form.coverUrl,
        },

        //浅拷贝
        teacherIds: [...this.form.teacher.map((teacher) => teacher.value)],

        classIds: [...this.form.class],
      };
      console.log(tmpform);
      //新增课程发送请求
      let res = await this.$request(
        "/admin/manager/course/save",
        tmpform,
        "post",
        "params",
        "json"
      );
      if (res.data.code === 20000) {
        console.log(res);
        ElMessage({
          message: "添加成功",
          type: "success",
        });
        this.isStepOneFinished = true;
        return true;
      } else {
        ElMessage({
          message: "添加失败，请检查信息是否有误",
          type: "warning",
        });
        return false;
      }
    },
    //新增课程小节信息
    async submitClassForm() {
      console.log("添加课程小节信息");
    },
    //查询所有课程信息
    async selectallcourse() {
      let res = await this.$request(
        "/admin/manager/course/list",
        "",
        "get",
        "params",
        "json",
        "/manager"
      );
      this.tableData = [];
      let courses = res?.data.data.courses;
      for (let i = 0; i < courses.length; ++i) {
        //这里加上问号防止渲染的时候axios没有拿到数据
        this.tableData[i] = {
          courseId: courses[i]?.courseId,
          coursename: courses[i]?.courseName,
          classhours: courses[i]?.creditHour,
          coversrc: courses[i]?.coverUrl,
          credit: courses[i]?.creditNum,
          category: courses[i]?.type ? "必修" : "选修",
          college: courses[i]?.department,
          week: courses[i]?.beginWeek + "~" + courses[i]?.endWeek + "周",
          // classroom: ,
          teacher: courses[i]?.teachers.map((item) => item.name),
          class: courses[i]?.classes.map((item) => item.name),
        };
      }
      this.loading = false;
    },
    //筛选查询课程信息
    async selectPartCourseByCondition() {
      //拼接url
      let params = {
        courseId: this.inputcourseId,
        courseName: this.inputcoursename,
        department: this.collegeValue,
        year: this.termValue.split("-")[0],
        term: this.termValue.split("-")[1] || "",
      };
      let url = `/admin/manager/course/list/1/10\
?courseId=${params.courseId}\
&courseName=${params.courseName}\
&department=${params.department}\
&term=${params.term}\
&year=${params.year}`;
      this.loading = true;
      let res = await this.$request(
        url,
        "",
        "get",
        "params",
        "json",
        "/manager"
      );
      console.log(res);
      let courses = res?.data.data.rows;
      this.tableData = [];
      for (let i = 0; i < courses.length; ++i) {
        //这里加上问号防止渲染的时候axios没有拿到数据
        this.tableData[i] = {
          courseId: courses[i]?.courseId,
          coursename: courses[i]?.courseName,
          classhours: courses[i]?.creditHour,
          coversrc: courses[i]?.coverUrl,
          credit: courses[i]?.creditNum,
          category: courses[i]?.type ? "必修" : "选修",
          college: courses[i]?.department,
          week: courses[i]?.beginWeek + "~" + courses[i]?.endWeek + "周",
          // classroom: ,
          teacher: courses[i]?.teachers.map((item) => item.name),
          class: courses[i]?.classes.map((item) => item.name),
        };
      }
      console.log(this.tableData);
      this.loading = false;
    },
    //删除某条课程的信息
    async deleteCourseById(courseId) {
      let tmpparams = {
        id: courseId,
      };
      let res = await this.$request(
        "/admin/manager/course/remove",
        tmpparams,
        "delete",
        "params",
        "json"
      );
      if (res && res.data.code === 20000) {
        ElMessage.success("删除成功！");
      } else ElMessage.error("删除失败，请稍后重试");
      this.selectallcourse();
    },
    //教师选择（搜索数据库）
    async searchRemoteTeachers(query) {
      if (1) {
        this.teacherloading = true;
        //未缓存先缓存
        if (this.teachersList.length === 0) {
          let res = await this.$request(
            "/admin/manager/teacher/list",
            "",
            "get",
            "params",
            "json"
          );
          console.log(res);
          if (res.data.code === 20000) {
            this.teachersList = res.data.data.teachers;
          }
        }
        for (let i = 0; i < this.teachersList.length; ++i) {
          this.teacherOptions[i] = {
            value: this.teachersList?.[i]?.id,
            label:
              this.teachersList?.[i]?.name +
              " " +
              this.teachersList?.[i]?.department,
          };
        }
        this.teacherOptions = this.teacherOptions.filter((item) => {
          return item.label.includes(query);
        });
        this.teacherloading = false;
      } else {
        this.teacherOptions = [];
      }
    },
    //班级选择（搜索数据库）
    async searchRemoteClasses(query) {
      if (1) {
        this.classloading = true;
        //未缓存先缓存
        if (this.classesList.length === 0) {
          let res = await this.$request(
            "/admin/manager/class/list",
            "",
            "get",
            "params",
            "json"
          );
          if (res.data.code === 20000) {
            this.classesList = res.data.data.classes;
          }
        }
        for (let i = 0; i < this.classesList.length; ++i) {
          this.classOptions[i] = {
            value: this.classesList?.[i]?.id,
            label:
              this.classesList?.[i]?.major + " " + this.classesList?.[i]?.name,
          };
        }
        this.classOptions = this.classOptions.filter((item) => {
          return item.label.includes(query);
        });
        this.classloading = false;
      } else {
        this.classOptions = [];
      }
    },
    //批量获取小节列表
    async getBatchClassList() {
      console.log(123);
      let tmpform = {
        beginIndex: this.form.beginclass,
        beginWeek: this.form.c_beginweek,
        courseId: this.form.courseid,
        dayOfWeek: this.form.weekth,
        endIndex: this.form.endclass,
        endWeek: this.form.c_endweek,
        location: this.form.c_classroom,
        teacherId: this.form.c_teacher,
      };
      //拼接模板字符串
      let url = `/admin/manager/schedule/temp-list?beginIndex=${tmpform.beginIndex}\
&beginWeek=${tmpform.beginWeek}\
&courseId=${tmpform.courseId}\
&dayOfWeek=${tmpform.dayOfWeek}\
&endIndex=${tmpform.endIndex}\
&endWeek=${tmpform.endWeek}\
&location=${tmpform.location}\
&teacherId=${tmpform.teacherId}`;
      let res = await this.$request(url, "", "get", "params", "json");
      console.log(res);
      if (res?.data.code === 20000) {
        let tempList = res.data.data.tempList;
        this.tempClassList = this.tempClassList.concat(tempList);
      }
    },
    //
    //将小节列表传给后端
    async postClassList() {
      let tmpform = this.tempClassList;
      console.log(tmpform);
      let res = await this.$request(
        "/admin/manager/schedule/save-list",
        tmpform,
        "post",
        "params",
        "json"
      );
      if (res.data.code === 20000) return true;
      else return false;
    },
    //根据Id获取课程的详细信息
    async getCourseInfoById(tmpid) {
      let param = {
        id: tmpid,
      };
      let res = await this.$request(
        "/admin/manager/course/get",
        param,
        "get",
        "resful",
        "json"
      );
      return res?.data.data.course;
    },

    //切换到下一步的小节表单,并且兼任提交的功能
    async goToNext() {
      if (this.step === 0) {
        let result = await this.submitCourseForm();
        if (result === true) this.step = 1;
      } else {
        let result = await this.postClassList();
        if (result === true) {
          ElMessage.success("新增成功!");
          this.$nextTick(() => {
            this.quitForm();
          });
        }
      }
    },
    //tag的字符串拼接
    generateTag(tag) {
      const ChineseNum = ["一", "二", "三", "四", "五", "六", "日"];
      let chosenNum = ChineseNum[tag.dayOfWeek];

      //tags: [{ name: "第4周周一第1~2节" }],
      return (
        "第" +
        tag.week +
        "周周" +
        chosenNum +
        "第" +
        tag.beginIndex +
        "~" +
        tag.endIndex +
        "节" +
        "  " +
        tag.location +
        "  "
        // this.form.teacher.find((item) => item.value === tag.teacherId).label
      );
    },
    //退出新增课程
    quitForm() {
      //关闭对话框
      this.dialogVisible = false;
      //重置表单
      this.$nextTick(() => {
        this.step = 0;
        this.termValue = "";
        this.collegeValue = "";
        this.tempClassList = [];
        this.teachersList = [];
        this.classesList = [];

        this.form = JSON.parse(JSON.stringify(this.copyform));
      });
      this.selectallcourse();
    },
    //编辑一个课程的内容
    async editForm(tmpId) {
      //打开对话框
      this.isCreate = false;
      this.dialogVisible = true;
      //获取该课程的基本信息，然后填入表单
      //基本课程信息
      let courseinfo = await this.getCourseInfoById(tmpId);
      this.form.coursename = courseinfo.courseName;
      this.form.courseid = courseinfo.courseId;
      this.form.coursehour = courseinfo.creditHour;
      this.form.credit = courseinfo.creditNum;
      this.form.college = courseinfo.department;
      this.form.category = courseinfo.type ? "必修" : "选修";
      this.form.beginweek = courseinfo.beginWeek;
      this.form.endweek = courseinfo.endWeek;
      //获取课程小节信息
      let classinfo = await this.getCourseClassList(tmpId);
      this.tempClassList = classinfo;
    },
    //根据课程ID获得课程的小节列表
    async getCourseClassList(tmpid) {
      let param = {
        id: tmpid,
      };
      let res = await this.$request(
        "/admin/manager/timetable/course-time",
        param,
        "get",
        "resful",
        "json"
      );
      return res?.data.data.time;
    },
  },

  mounted() {
    // 渲染页面的表格
    this.selectallcourse();
    //将表单初始值进行深拷贝进行备份
    this.copyform = JSON.parse(JSON.stringify(this.form));
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
.el-form {
  display: flex;
  justify-content: center;
}
:deep(.el-dialog__body) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.left-form {
  margin-top: 2vh;
  width: 30vw;
  height: 65vh;
  overflow: auto;
}
.right-form {
  margin-top: 2vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40vw;
  height: 65vh;
}
.right-form-list {
  width: 80%;
  height: 200px;
  border: 1px solid var(--el-border-color);
  border-radius: 0;
}

.classtag {
  width: 100%;
}
.right-form-item {
  display: inline-block;
}
</style>