<template>
  <div class="detailpage">
    <el-button @click="changemode" style="position: absolute; left: 0; top: 0">{{ isTeacher ? "老师" : "学生" }}</el-button>
    <el-card shadow="never" class="boxcard">
      <template #header>
        <div class="card-header">
          <span class="homeworktitle">{{ homeworkDetail?.homework?.name }}</span>
          <div v-show="isTeacher">
            <el-button type="primary">批改作业</el-button>
          </div>
        </div>
      </template>
      <el-scrollbar height="60vh">
        <div>
          <ul>
            <li v-for="(item, index) in  homeworkDetail?.contexts">
              {{ (index + 1) + "、" + item?.context }}
              <div>
                <!-- <el-form-item label="参考答案:">
                  <el-input v-model="item.refAnswer" :rows="2" type="textarea" resize="none" />
                </el-form-item> -->
                <textarea v-show="!isTeacher" v-model="answers[index]" cols="45" rows="19" @keypress="handleAnswer"></textarea>
              </div>
            </li>
          </ul>
        </div>
      </el-scrollbar>
      <div v-show="!isTeacher">
        <div class="bottom-button">
          <el-button type="primary" @click="submitHomework">提交作业</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import richEditor from "./utilItems/richEditor.vue";
export default {
  components: {
    richEditor,
  },
  data() {
    return {
      homeworkDetail: {},
      answers: ""
    };
  },
  methods: {
    changemode() {
      this.$store.state.isTeacher = !this.$store.state.isTeacher;
    },
    async submitHomework() {
      const curUser = this.$store.state.userInfo;
      console.log("提交作业")
      // 调用提交作业的api,这里需要再给后端对一下给的参数以及参数类型
      const res = await this.$request(`/manager/course-homework/submit/${curUser.id}/${this.homeworkDetail.homework
        .id}`,
        this.homeworkDetail.contexts.map((item, index) => {
          return {
            ...item,
            submitAnswer: this.answers[index]
          }
        }),
        "post",
        "params",
        "json")
      console.log(res)
    },
    handleAnswer() {
      this.homeworkDetail = this.homeworkDetail.contexts.map((item, index) => {
        return {
          ...item,
          submitAnswer: this.answers[index]
        }
      })
    },
    editHomework(){
      console.log("bjzy")
    }
  },
  computed: {
    isTeacher() {
      return this.$store.state.isTeacher;
    },
  },
  async mounted() {
    // console.log(this.$route.params)
    const homeworkId = this.$route.params.id
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
    this.answers = new Array(homeworkdetail.data.data.contexts.length)
  },
  updated() {
    console.log(this.homeworkDetail)
  }
};
</script>

<style lang="scss" scoped>
.detailpage {
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

    .text {
      font-size: 14px;
    }

    .item {
      margin-bottom: 18px;
    }

    .bottom-button {
      margin-top: 10px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>