<template>
  <div class="head">
    请选择当前学期：
    <el-select
      v-model="termValue"
      class="m-2"
      placeholder="Select"
      @change="changeTerm"
    >
      <el-option
        v-for="item in termoptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-button
      style="position: absolute; right: 0; top: 0"
      @click="goToEdit"
      v-show="false"
      >去编辑节点</el-button
    >
  </div>
  <el-scrollbar>
    <div class="body">
      <ul v-for="experiment in experiments" :key="experiment.id">
        <li class="courseItem">
          <ExpItem :experiment="experiment" @click="goto(experiment)" />
        </li>
      </ul>
    </div>
  </el-scrollbar>
</template>

<script>
import ExpItem from "./utilCom/ExpItem.vue";
import { getCoursesById, getCoursesBySem } from "../../../network/api";
export default {
  components: {
    ExpItem,
  },
  computed: {},
  data() {
    const experiments = [];
    const semesters = [
      {
        id: "-1",
        time: "全部",
      },
    ];
    return {
      semesters,
      experiments,
      termValue: "all",
      termoptions: [
        {
          value: "all",
          label: "全部",
        },
        {
          value: "2022-1",
          label: "2022~2023第1学期",
        },
        {
          value: "2022-2",
          label: "2022~2023第2学期",
        },
      ],
      monidata: [
        {
          id: "1",
          courseName: "数据库原理",
          expName: "Mysql数据库实操",
          teachers: ["毛清"],
        },
        {
          id: "2",
          courseName: "操作系统",
          expName: "Linux系统实践",
          teachers: ["许飞"],
        },
        {
          id: "3",
          courseName: "软件开发环境",
          expName: "Web项目开发实践",
          teachers: ["赵燕"],
        },
        {
          id: "4",
          courseName: "软件工程",
          expName: "软件开发实践",
          teachers: ["毛清"],
        },
        {
          id: "5",
          courseName: "算法设计与分析",
          expName: "算法大作业实践",
          teachers: ["周仁", "李德"],
        },
      ],
    };
  },
  async mounted() {
    // api：通过用户id获取到用户的实验信息
    await this.getUserExp();
    console.log(this.monidata);
  },
  methods: {
    //查询用户的所有实验
    async getUserExp() {
      let userId = this.$store.state.userInfo.id;
      let res = await this.$request(
        `exp/course/list-all/${userId}`,
        "",
        "get",
        "params",
        "json"
      );
      console.log(res);
      let tmpList = [];
      if (res && res.data.code === 20000) {
        for (let i = 0; i < res.data.data.list.length; i++) {
          let item = res.data.data.list[i];
          let courseItem = await this.getCourseInfoById(item.courseId);
          console.log(courseItem);
          if (courseItem) {
            tmpList.push({
              id: item.id,
              courseId: item.courseId,
              courseName: courseItem.courseName,
              teachers: courseItem.teachers,
              coverUrl: courseItem.coverUrl,
              expName: item.name,
            });
          }
        }
      }

      this.experiments = JSON.parse(JSON.stringify(tmpList));
      console.log(this.experiments);
    },
    //根据课程Id查询课程信息
    async getCourseInfoById(courseId) {
      let res = await this.$request(
        `/admin/manager/course/get/${courseId}`,
        "",
        "get",
        "params",
        "json"
      );
      console.log(res, "课程");
      if (res && res.data.code === 20000) {
        let item = res.data.data.course;
        return {
          courseName: item.courseName,
          teachers: item.teachers.map((item) => item.name),
          coverUrl: item.coverUrl,
        };
      }
      return "";
    },
    goToEdit() {
      this.$router.push({ path: "/experimentflow" });
    },
    async changeSem(semester) {
      console.log(semester);
      this.curSemester = semester;
      this.curSemesterTime = semester.time;
      try {
        // api：通过学期信息获取课程列表
        let res = await getCoursesBySem(semester.id);
        this.courses = res.data;
      } catch (e) {
        console.log(e);
      }
    },
    goto(experiment) {
      console.log(123);
      this.$router.push({
        path: `/experimentflow/${experiment.courseId}/${experiment.id}`,
      });
    },
    async changeTerm(val) {
      let userid = this.$store.state.userInfo.id;
      let res = await getCoursesById(userid);
      let courses;
      console.log(res);
      if (val === "all") {
        courses = JSON.parse(JSON.stringify(res.data.data.courses));
      } else if (val === "2022-1") {
        courses = res.data.data.courses.filter((item) => item.term === 1);
      } else {
        courses = res.data.data.courses.filter((item) => item.term === 2);
      }
      this.courses = courses.map((item) => {
        return {
          courseId: item.courseId,
          courseName: item.courseName,
          beginWeek: item.beginWeek,
          endWeek: item.endWeek,
          teachers: item.teachers.map((item) => item.name),
          coverUrl: item.coverUrl,
        };
      });
    },
  },
};
</script>

<style scoped>
.head {
  margin: 20px 0 20px 15px;
  font-size: 14px;
}

.body {
  margin-left: 40px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.courseItem {
  box-sizing: border-box;
  width: calc((100vw - 300px) / 4);
  margin: 10px;
}

@media screen and (max-width: 650px) {
  .courseItem {
    width: calc((100vw - 280px) / 3);
  }
}

@media screen and (max-width: 550px) {
  .courseItem {
    width: calc((100vw - 260px) / 2);
  }
}

@media screen and (max-width: 460px) {
  .courseItem {
    width: calc(100vw - 240px);
  }
}
</style>