<template>
  <div class="detailpage">
    <el-button @click="changemode" style="position: absolute; left: 0; top: 0">{{ isTeacher ? "老师" : "学生" }}</el-button>
    <el-card shadow="never" class="boxcard">
      <template #header>
        <div class="card-header">
          <span class="homeworktitle">{{ homeworkDetail?.homework?.name }}</span>
        </div>
      </template>
      <el-scrollbar height="60vh">
        <div>
          <ul>
            <li v-for="(item, index) in  homeworkDetail?.contexts">
              {{ "作业"+(index + 1) + "：" + item?.context }}
              <div>
                <el-form-item v-show="!isTeacher" label="答案： ">
                  <el-input v-model="answers[index]" :rows="18" type="textarea" resize="none" />
                </el-form-item>
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
      console.log("提交作业")
      console.log(this.homeworkDetail,this.answers)
      // 调用提交作业的api,这里需要再给后端对一下给的参数以及参数类型
      // 这里需要使用学生id而不是用户id
      const curUser = await this.getRoleId()
      const res = await this.$request(`/manager/course-homework/submit/${curUser}/${this.homeworkDetail.homework
        .id}`,
        this.homeworkDetail.contexts.map((item, index) => {
          return {
            contextId:item.id,
            submitAnswer: this.answers[index],
          }
        }),
        "post",
        "params",
        "json")
      console.log(res)
      alert("提交成功！")
    },
    async getRoleId(){
      const curUser = this.$store.state.userInfo;
      console.log(curUser.id)
      try {
        let userRoleId = await this.$request(
          `/api/manager/user/user-role-id/${curUser.id}`,
          "",
          "get"
        )
        userRoleId = userRoleId.data.data?.teacherId || userRoleId.data.data?.studentId
        console.log(userRoleId)
        return userRoleId
      } catch (e) {
        console.log(e)
      }
    },
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