<template>
  <div class="head">
    请选择当前学期：
    <el-select v-model="curSemesterTime" class="m-2" placeholder="Select">
      <el-option v-for="semester in  semesters" :key="semester.id" :label="semester.time" :value="semester.time"
        @click="changeSem(semester)" />
    </el-select>
  </div>
  <div class="body">
    <ul v-for="(course) in  courses" :key="course.id">
      <li @click="goto(course.id)" class="courseItem">
        <CourseItem :course="course" />
      </li>
    </ul>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue';
import { computed } from "vue";
import CourseItem from './utilCom/CourseItem.vue';
import { getCoursesById, getSemestersById, getCoursesBySem } from '../../../network/api'
export default {
  components: {
    CourseItem
  },
  computed: {
    curSemesterTime() {
      console.log(this.curSemester, '11')
      return this.curSemester ? this.curSemester.time : ''
    }
  },
  setup() {
    const curSemesterTime = ref('全部')
    const curSemester = reactive({
      id: '-1',
      time: '全部'
    })
    const courses = reactive([{
      id: '1',
      avatar: '图片',
      name: '数学',
      school: '河海大学',
      teacher: '王老师',
      class: '高三'
    }, {
      id: '2',
      avatar: '图片',
      name: '数学',
      school: '河海大学',
      teacher: '王老师',
      class: '高三'
    }, {
      id: '3',
      avatar: '图片',
      name: '数学',
      school: '河海大学',
      teacher: '王老师',
      class: '高三'
    }, {
      id: '4',
      avatar: '图片',
      name: '数学',
      school: '河海大学',
      teacher: '王老师',
      class: '高三'
    }, {
      id: '5',
      avatar: '图片',
      name: '数学',
      school: '河海大学',
      teacher: '王老师',
      class: '高三'
    }, {
      id: '6',
      avatar: '图片',
      name: '数学',
      school: '河海大学',
      teacher: '王老师',
      class: '高三'
    }])
    const semesters = reactive([
      {
        id: '-1',
        time: '全部'
      }
    ])
    return {
      semesters,
      courses,
      curSemester,
      curSemesterTime
    }
  },
  async mounted() {
    // api：通过用户id获取到用户的课程信息
    try {
      this.courses = await getCoursesById()
    } catch (e) {
      console.log(e)
    }
    // api：通过用户id获取到用户的学期信息
    try {
      this.semesters = [{
        id: '-1',
        time: '全部'
      }].concat(await getSemestersById())
    } catch (e) {
      console.log(e)
    }
    this.curSemester = this.semesters && this.semesters[0]
    this.curSemesterTime = this.curSemester?.time
  },
  methods: {
    async changeSem(semester) {
      console.log(semester)
      this.curSemester = semester
      this.curSemesterTime = semester.time
      try {
        // api：通过学期信息获取课程列表
        this.courses = await getCoursesBySem(semester.id)
      } catch (e) {
        console.log(e)
      }
    },
    goto(courseId) {
      this.$router.push("/courseview?course=" + courseId);
    },
  },
};
</script>

<style>
.head {
  margin: 20px 0 20px 15px;
  font-size: 14px;
}

.body {
  width: 100%;
  height: calc(100% - 70px);
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
}

.courseItem {
  box-sizing: border-box;
  width: calc((100vw - 320px) / 4);
  margin: 10px;
}

@media screen and (max-width:650px) {
  .courseItem {
    width: calc((100vw - 300px) / 3);
  }
}

@media screen and (max-width:550px) {
  .courseItem {
    width: calc((100vw - 280px) / 2);
  }
}

@media screen and (max-width:460px) {
  .courseItem {
    width: calc(100vw - 255px);
  }
}
</style>