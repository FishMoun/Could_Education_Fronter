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
      @click="goToAdmin"
      v-show="false"
      >切换管理员</el-button
    >
  </div>
  <el-scrollbar>
    <div class="body">
      <ul v-for="course in courses" :key="course.id">
        <li class="courseItem">
          <CourseItem :course="course" @click="goto(course.courseId)" />
        </li>
      </ul>
    </div>
  </el-scrollbar>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { computed } from "vue";
import axios from "axios";
import CourseItem from "./utilCom/CourseItem.vue";
import {
  getCoursesById,
  getSemestersById,
  getCoursesBySem,
} from "../../../network/api";
export default {
  components: {
    CourseItem,
  },
  computed: {
    // curSemesterTime() {
    //   console.log(this.curSemester, "11");
    //   return this.curSemester ? this.curSemester.time : "";
    // },
  },
  data() {
    const curSemesterTime = "全部";
    const curSemester = {
      id: "-1",
      time: "全部",
    };
    const courses = [];
    const semesters = [
      {
        id: "-1",
        time: "全部",
      },
    ];
    return {
      semesters,
      courses,
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
    };
  },
  async mounted() {
    // api：通过用户id获取到用户的课程信息
    try {
      let userid = this.$store.state.userInfo.id;
      let res = await getCoursesById(userid);
      let courses = JSON.parse(JSON.stringify(res.data.data.courses));
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
      console.log(courses);
    } catch (e) {
      console.log(e);
    }
    //模拟数据
  },
  methods: {
    goToAdmin() {
      this.$store.state.isAdmin = !this.$store.state.isAdmin;
    },
    goto(courseId) {
      this.$router.push(`/courseview/${courseId}`);
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