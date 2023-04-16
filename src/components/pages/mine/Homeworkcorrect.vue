<template>
  <div class="correctpage">
    <el-card shadow="never" class="boxcard">
      <template #header>
        <div class="card-header">
          <span class="homeworktitle">{{ homeworkDetail?.homework?.name }}</span>
          <span>已批改{{ studentRes.filter(item=>item.score.score!==undefined).length }}/{{
            studentRes.length
          }}</span>
        </div>
      </template>
      <div class="homeworkcontent">
        <ul class="homList">
          <li v-for="(item, index) in  homeworkDetail?.contexts">
            {{ "作业" + (index + 1) + "：" + item?.context }}
            <br>
            {{ curStudentRes?.studentId ? "学生答案：" + curStudentRes.res[index].submitAnswer : "" }}
          </li>
        </ul>
      </div>
      <div v-show="this.curStudentRes.studentId">
        <span>评价</span>
        <el-input style="margin-bottom: 10px" v-model="mark" :rows="5" type="textarea" placeholder="输入评语" resize="none" />
        <div>
          <div class="bottomzone">
            <div>
              <span>打分:</span>
              <el-input v-model="score" style="width: 50px; margin-left: 10px"></el-input>
            </div>
            <el-button type="primary" @click="markRes">完成批改</el-button>
          </div>
        </div>
      </div>
    </el-card>
    <el-card shadow="never" class="stulist" body-style="padding:0">
      <template #header>
        <div class="card-header">
          <span class="homeworktitle">学生列表</span>
          <el-button link><el-icon>
              <Refresh />
            </el-icon></el-button>
        </div>
      </template>
      <el-scrollbar>
        <ul>
          <li class="listitem" v-for="item in students">
            <span class="name">{{ item.name }}</span>
            <el-button link type="primary" @click="viewRes(item.id)">查看作业</el-button>
          </li>
        </ul>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      homeworkDetail: {},
      students: [],
      studentRes: [],
      curStudentRes: {},
      totalnum: "10",
      submitnum: "1",
      correctnum: "1",
      //教师评语
      mark: "",
      score: ""
    };
  },
  async mounted() {
    const homeworkId = this.$route.params.id
    console.log(homeworkId)
    let homeworkdetail = await this.$request(
      `/manager/course-homework/get-context/${homeworkId}`,
      // `/manager/course-homework/get-context/${String(homeworkId)}`,
      "",
      "get",
      "params",
      "json"
    )
    console.log(homeworkdetail)
    this.homeworkDetail = { contexts: homeworkdetail.data.data.contexts, homework: homeworkdetail.data.data.homework }
    const students = await this.getStudents()
    this.students = students
    const studentRes = []
    for (let item of students) {
      let curStudentRes = await this.getStudentRes(item.id)
      studentRes.push({
        studentId: item.id,
        res: curStudentRes.studentRes,
        score:curStudentRes.studentScore
      })
    }
    console.log(studentRes)
    this.studentRes = studentRes
  },
  methods: {
    async getStudents() {
      const homeworkId = this.$route.params.id
      let students = await this.$request(
        `/manager/course-homework/get-marked/${homeworkId}`
      )
      students = students.data.data.markedStudents
      console.log(students)
      return students
    },
    async getStudentRes(studentId) {
      console.log("zz", studentId)
      const homeworkId = this.$route.params.id
      let studentRes = await this.$request(
        `/manager/course-homework/get-submit/${homeworkId}/${studentId}`
      )
      console.log(studentRes.data.data)
      studentRes = studentRes.data.data
      return {
        studentRes:studentRes.submits,
        studentScore:studentRes.homework
      }
    },
    viewRes(studentId) {
      console.log(this.studentRes)
      const curStudentRes = this.studentRes.filter(item => (item.studentId === studentId))[0]
      this.curStudentRes = curStudentRes
      this.score = curStudentRes.score.score
      this.mark = curStudentRes.score.remark
    },
    async markRes() {
      if(!this.curStudentRes.studentId){
        alert("请先选择学生！")
        return
      }
      const res = await this.$request(
        "/manager/course-homework/correct",
        {
          homeworkId: this.homeworkDetail.homework.id,
          remark: this.mark,
          score: this.score,
          studentId: this.curStudentRes.studentId
        },
        "post",
        "params",
        "json"
      )
      console.log(res)
    }
  }
};
</script>

<style scoped lang="scss">
.name {
  width: 70px;
  overflow-x: scroll;
}

.correctpage {
  display: flex;
  justify-content: space-around;

  .boxcard {
    width: 50vw;
    height: 85vh;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .homeworktitle {
        font-size: 20px;
      }
    }

    .homeworkcontent {
      height: 38vh;
      margin-bottom: 10px;
    }

    .bottomzone {
      display: flex;
      justify-content: space-between;
    }
  }

  .stulist {
    position: absolute;
    right: 0;
    width: 15vw;
    height: 100%;

    .card-header {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .listitem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      height: 50px;
      border-bottom: 1px solid #e4e7ed;
    }
  }
}
</style>