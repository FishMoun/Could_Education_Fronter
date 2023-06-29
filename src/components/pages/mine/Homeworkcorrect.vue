<template>
  <div class="correctpage">
    <el-card shadow="never" class="boxcard">
      <template #header>
        <div class="card-header">
          <span class="homeworktitle">{{
            homeworkDetail?.homework?.name
          }}</span>
          <span v-show="ismoni"
            >已批改{{ this.monidata.correctnum }}/{{
              this.monidata.submitnum
            }}</span
          >
        </div>
      </template>
      <div class="homeworkcontent">
        <ul class="homeList">
          <li v-for="(item, index) in homeworkDetail?.contexts">
            {{ "作业" + (index + 1) + "：" + item?.context }}
            <br />
            {{
              curStudentRes?.studentId
                ? "学生答案：" + curStudentRes.res[index].submitAnswer
                : ""
            }}
          </li>
        </ul>
        <el-card
          shadow="never"
          v-for="item in curStudentRes.fileList"
          :key="item.id"
          v-show="curStudentRes.fileList.length !== 0 && click"
          style="margin-top: 5px; border: none"
          body-style="padding:0 "
        >
          <div class="filelist">
            <div style="display: flex; align-items: center">
              <img
                style="width: 50px; height: 50px"
                :src="getFileImage(item.url)"
                alt=""
              />

              <span>{{ item.name }}</span>
            </div>
            <div class="fileicon">
              <a :href="item.url"
                ><el-icon size="20px" color=""><Download /></el-icon
              ></a>
            </div></div
        ></el-card>
      </div>
      <div v-show="this.curStudentRes.studentId">
        <span>评价</span>
        <el-input
          style="margin-bottom: 10px"
          v-model="mark"
          :rows="5"
          type="textarea"
          placeholder="输入评语"
          resize="none"
        />
        <div>
          <div class="bottomzone">
            <div>
              <span>打分:</span>
              <el-input
                v-model="score"
                style="width: 50px; margin-left: 10px"
              ></el-input>
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
          <el-button link
            ><el-icon> <Refresh /> </el-icon
          ></el-button>
        </div>
      </template>
      <el-scrollbar>
        <div
          style="text-align: center; color: grey; margin-top: 10px"
          v-show="students.length === 0"
        >
          暂无提交
        </div>
        <ul v-show="!ismoni">
          <li class="listitem" v-for="item in students">
            <span class="name">{{ item.name }}</span>
            <el-button link type="primary" @click="viewRes(item.id)"
              >查看作业</el-button
            >
          </li>
        </ul>
        <ul v-show="ismoni">
          <li class="listitem" v-for="item in monidata.studentInfo">
            <span class="name">{{ item.name }}</span>
            <el-button link type="primary" @click="click = !click"
              >查看作业</el-button
            >
          </li>
        </ul>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import pdfUrl from "/src/assets/img/pdf.png";
import pptUrl from "/src/assets/img/ppt.png";
import txtUrl from "/src/assets/img/txt.png";
import wordUrl from "/src/assets/img/word.png";
import zipUrl from "/src/assets/img/zip.png";
import unknownUrl from "/src/assets/img/unknown.png";
export default {
  data() {
    return {
      click: false,
      homeworkDetail: {},
      students: [],
      studentRes: [],
      curStudentRes: {},
      totalnum: "10",
      submitnum: "1",
      correctnum: "1",
      //教师评语
      mark: "",
      score: "",
      fileList: [],
      monidata: {
        fileList: [
          {
            id: "1",
            name: "实验报告.pdf",
            url: "/public/实验报告.pdf",
          },
        ],
        correctnum: 0,
        submitnum: 1,
        studentInfo: [
          {
            id: 20230011,
            name: "王可",
          },
        ],
      },
    };
  },
  computed: {
    ismoni() {
      if (this.$route.params.id === "3") return true;
      else return false;
    },
    isTeacher() {
      return this.$store.state.isTeacher;
    },
  },
  async mounted() {
    const homeworkId = this.$route.params.id;
    console.log(homeworkId);
    let homeworkdetail = await this.$request(
      `/manager/course-homework/get-context/${homeworkId}`,

      "",
      "get",
      "params",
      "json"
    );
    console.log(homeworkdetail);
    this.homeworkDetail = {
      contexts: homeworkdetail.data.data.contexts,
      homework: homeworkdetail.data.data.homework,
    };
    const students = await this.getStudents();
    this.students = students;
    const studentRes = [];
    if (students) {
      for (let item of students) {
        let curStudentRes = await this.getStudentRes(item.id);
        studentRes.push({
          studentId: item.id,
          res: curStudentRes.studentRes,
          score: curStudentRes.studentScore,
          fileList: curStudentRes.fileList,
        });
      }
    }
    console.log(studentRes);
    this.studentRes = studentRes;
  },
  methods: {
    async getStudents() {
      const homeworkId = this.$route.params.id;
      let students = await this.$request(
        `/manager/course-homework/get-marked/${homeworkId}`
      );
      students = students.data.data.markedStudents;
      console.log("学生信息", students);
      return students;
    },
    async getStudentRes(studentId) {
      console.log("zz", studentId);
      const homeworkId = this.$route.params.id;
      let studentRes = await this.$request(
        `/manager/course-homework/get-submit/${homeworkId}/${studentId}`
      );
      console.log(studentRes.data.data);
      studentRes = studentRes.data.data;
      let fileList;
      if (studentRes.files) {
        for (let key in studentRes.files) {
          fileList = studentRes.files[key];
        }
      }
      console.log(this.fileList, "fileList");
      return {
        studentRes: studentRes.submits,
        studentScore: studentRes.homework,
        fileList: fileList,
      };
    },
    viewRes(studentId) {
      console.log(this.studentRes);
      const curStudentRes = this.studentRes.filter(
        (item) => item.studentId === studentId
      )[0];
      this.curStudentRes = curStudentRes;
      this.score = curStudentRes.score.score;
      this.mark = curStudentRes.score.remark;
      this.click = true;
    },
    async markRes() {
      if (!this.curStudentRes.studentId) {
        ElMessage.success("请先选择学生！");
        return;
      }
      const res = await this.$request(
        "/manager/course-homework/correct",
        {
          homeworkId: this.homeworkDetail.homework.id,
          remark: this.mark,
          score: this.score,
          studentId: this.curStudentRes.studentId,
        },
        "post",
        "params",
        "json"
      );
      console.log(res);
      ElMessage.success("批改成功！");
    },
    monimark() {
      ElMessage.success("完成批改！");
      this.monidata.correctnum += 1;
    },
    getFileImage(name) {
      if (name.includes("pdf")) return pdfUrl;
      else if (name.includes("ppt")) return pptUrl;
      else if (name.includes("txt")) return txtUrl;
      else if (name.includes("zip")) return zipUrl;
      else if (name.includes("doc")) return wordUrl;
      else return unknownUrl;
    },
  },
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
.filelist {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>