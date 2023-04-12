<template>
  <el-button @click="changerole" style="position: absolute; left: 0">{{
    isTeacher ? "老师" : "学生"
  }}</el-button>
  <!-- 内容区 -->
  <div class="main">
    <div class="mainleft">
      <el-card shadow="never" class="introduction-card">
        <div style="font-size: 20px">课程介绍</div>
        <p>{{ introduction }}</p>
        <div v-show="isTeacher">
          <el-button link type="primary" @click="editcontent">编辑</el-button>
        </div>

        <!-- 编辑内容的对话框 -->
        <el-dialog
          v-model="editcontentdialogVisible"
          title="课程介绍"
          width="30%"
        >
          <el-input
            v-model="editintroduction"
            :rows="5"
            type="textarea"
            placeholder="输入内容"
            resize="none"
          />
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="editcontentdialogVisible = false"
                >取消</el-button
              >
              <el-button type="primary" @click="submitIntroduction">
                确定
              </el-button>
            </span>
          </template>
        </el-dialog>
      </el-card>
    </div>
    <div class="mainright">
      <div class="righthead">
        <span style="font-size: 20px">课程场景</span>
        <el-radio-group class="view-change-button" v-model="tabview">
          <el-radio-button label="timemode">时序视图</el-radio-button>
          <el-radio-button label="outlinemode">大纲视图</el-radio-button>
        </el-radio-group>
      </div>
      <el-scrollbar class="timelinebox">
        <!-- 时序视图 -->
        <el-timeline style="margin: 2px" v-if="tabview == 'timemode'">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :icon="activity.icon"
            :type="activity.type"
            :color="activity.color"
            :size="activity.size"
            :hollow="activity.hollow"
            :timestamp="activity.timestamp"
            placement="top"
          >
            <el-card :body-style="{ padding: '0px' }">
              <div class="card-content">
                <div class="card-main">
                  <h2>{{ activity.title }}</h2>
                  <span style="color: #909399"
                    >{{ activity.teacher }} {{ activity.weekth }}</span
                  >
                  <p v-if="isTeacher" style="color: #909399">
                    尚无内容，进入学习空间编辑
                  </p>
                  <p v-else>本节概要：</p>
                </div>
                <div class="card-button">
                  <el-tooltip
                    content="进入学习空间"
                    placement="right"
                    effect="light"
                    :hide-after="10"
                  >
                    <el-button
                      style="height: 100%; width: 100%"
                      @click="gotoClass(activity.id)"
                      ><el-icon><DArrowRight /></el-icon
                    ></el-button>
                  </el-tooltip>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <!-- 大纲视图 -->
        <div v-else>
          <!-- 编辑 -->
          <div v-show="isTeacher">
            <el-button link type="primary" @click="startEdit"
              >编辑大纲</el-button
            >
            <el-button
              link
              type="primary"
              @click="addChapter"
              v-show="showeditfinish"
              >增加章节</el-button
            >
            <el-button
              link
              type="primary"
              @click="endEdit"
              v-show="showeditfinish"
              >完成编辑</el-button
            >
          </div>
          <el-tree
            :data="treedata"
            :show-checkbox="showeditoutline"
            node-key="id"
            :expand-on-click-node="false"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <el-input
                  v-if="isTeacher && showeditoutline && data.inputvisible"
                  ref="InputRef"
                  v-model="chapterInputValue"
                  class="ml-1 w-20"
                  size="small"
                  @keyup.enter="handleInputConfirm(data, $event)"
                  @blur="handleInputConfirm(data, $event)"
                />
                <span v-else @click="showInput(data)" style="font-size: 25px">{{
                  node.label
                }}</span>
                <span style="color: #409eff" v-show="showeditoutline">
                  <a
                    @click="append(data)"
                    v-show="node.parent.parent == undefined"
                  >
                    增加小节
                  </a>
                  <a style="margin-left: 8px" @click="remove(node, data)">
                    删除
                  </a>
                </span>
              </span>
            </template>
          </el-tree>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
export default {
  name: "Courseview",
  data() {
    return {
      //视图
      tabview: "timemode",
      //课程介绍编辑框
      editcontentdialogVisible: false,
      //课程介绍的内容
      introduction: "",
      //正在编辑的节次介绍的内容
      editintroduction: "",
      //是否显示增加和删除按钮
      showeditoutline: false,
      //显示编辑完成按钮
      showeditfinish: false,
      //时序属性
      activities: [
        // {
        //   timestamp: "2023-3-10 8:00",
        //   size: "large",
        //   type: "primary",
        //   title: "数据库绪论",
        //   teacher: "许卓明",
        //   weekth: "周五第1~2节",
        //   overview: "",
        // },
      ],
      //大纲数据
      treedata: [
        // {
        //   id: 1,
        //   label: "Level one 1",
        //   //控制章节编辑输入框是否出现
        //   inputvisible: false,
        //   children: [
        //     {
        //       id: 4,
        //       label: "Level two 1-1",
        //       //小节信息
        //       timetable: [
        //         {
        //           //小节id
        //           id: "1",
        //           //下面给小节对应信息，传第几周周几第几节
        //         },
        //       ],
        //       //控制章节编辑输入框是否出现
        //       inputvisible: false,
        //     },
        //   ],
        // },
        // {
        //   id: 2,
        //   label: "Level one 2",
        //   //控制章节编辑输入框是否出现
        //   inputvisible: false,
        // },
        // {
        //   id: 3,
        //   label: "Level one 3",
        //   //控制章节编辑输入框是否出现
        //   inputvisible: false,
        // },
      ],
      //节点标识
      id: "",
      //章节编辑内容
      chapterInputValue: "",
    };
  },
  computed: {
    isTeacher() {
      return this.$store.state.isTeacher;
    },
    courseId() {
      return this.$route.params.id;
    },
  },
  async mounted() {
    await this.getTimeList();
    this.id = this.courseId + "0000";
    await this.getChapterList();
  },
  methods: {
    //获取时序列表
    async getTimeList() {
      let param = { id: this.$route.params.id };
      let res = await this.$request(
        "/admin/manager/timetable/course-time",
        param,
        "get",
        "resful",
        "json"
      );
      let weekday = ["一", "二", "三", "四", "五", "六", "日"];
      let timeinfo = res.data.data.time;

      let newactivity = [];
      console.log(timeinfo);
      for (let i = 0; i < timeinfo.length; i++) {
        let item = timeinfo[i];

        newactivity.push({
          id: item.id,
          timestamp: item.date.split(" ")[0],
          size: "large",
          type: "primary",
          title: item.courseName + `第${i + 1}大节`,
          teacher: item.teacherName,
          weekth: `周${weekday[item.dayOfWeek]}第${item.beginIndex}~${
            item.endIndex
          }节`,
          overview: "",
        });
      }
      this.activities = JSON.parse(JSON.stringify(newactivity));
    },
    //获取章节列表
    async getChapterList() {
      let res = await this.$request(
        `/manager/chapter/get/${this.courseId}`,
        "",
        "get",
        "params",
        "json"
      );
      console.log(res);
      let newChapterList = [];
      if (res?.data.code === 20000) {
        newChapterList = res.data.data.chapters.map((item) => {
          return {
            id: item.chapter.id,
            label: item.chapter.name,
            children: item.children.map((item2) => {
              return {
                id: item2.subChapter.id,
                label: item2.subChapter.name,
                timetable: item2?.timetables || [],
              };
            }),
          };
        });
      }
      this.treedata = JSON.parse(JSON.stringify(newChapterList));
    },
    //老师和学生切换
    changerole() {
      this.$store.state.isTeacher = !this.$store.state.isTeacher;
    },
    gotoClass(classId) {
      this.$router.push({ path: `/classlearning/${this.courseId}/${classId}` });
    },
    //编辑介绍内容
    editcontent() {
      this.editcontentdialogVisible = true;
    },
    //提交内容
    submitIntroduction() {
      this.introduction = this.editintroduction;
      this.editcontentdialogVisible = false;
    },
    //编辑大纲
    startEdit() {
      this.showeditoutline = true;
      this.showeditfinish = true;
    },
    async endEdit() {
      let params = this.treedata.map((item, index) => {
        return {
          chapter: {
            courseId: this.courseId,
            id: item.id,
            name: item.label,
            number: index,
          },
          children: item.children.map((item2, index2) => {
            return {
              subChapter: {
                chapterId: item.id,
                courseId: this.courseId,
                id: item2.id,
                name: item2.name,
                number: index2,
              },
              timetables: item2?.timetable || [],
            };
          }),
        };
      });
      console.log(params);
      let res = await this.$request(
        `/manager/chapter/save/${this.$route.params.id}`,
        params,
        "post",
        "params",
        "json"
      );
      console.log(res);
      this.showeditfinish = false;
      this.showeditoutline = false;
    },
    //向后增加章节
    addChapter() {
      const brother = {
        id: String(++this.id),
        label: "新章节，点击编辑内容",
        children: [],
        inputvisible: false,
      };
      this.treedata.push(brother);
      console.log(this.treedata);
    },
    //增加子节点
    append(data) {
      const newChild = {
        id: String(++this.id),
        label: "新小节，点击编辑内容",
        children: [],
        inputvisible: false,
      };
      if (!data.children) {
        data.children = [];
      }
      data.children.push(newChild);
    },
    //删除节点
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },
    //出现输入框
    showInput(data) {
      if (this.isTeacher && this.showeditoutline) {
        data.inputvisible = true;
        this.$nextTick(() => {
          this.$refs.InputRef.focus();
        });
      }
    },
    //输入框确认
    handleInputConfirm(data, $event) {
      console.log($event);
      if (this.chapterInputValue) data.label = this.chapterInputValue;
      console.log(data.label);
      data.inputvisible = false;
      this.chapterInputValue = "";
      console.log(data.label);
    },
  },
};
</script>

<style scoped>
.introduction-card {
  margin-top: 20px;
  min-height: 20vh;
}

.timelinebox {
  height: 80vh;
  width: 40vw;
  padding-right: 40px;
}
.card-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  --el-card-padding: 0;
  height: 150px;
  width: 100%;
}
.card-main {
  margin: 10px 10px 10px 20px;
  width: 300px;
  height: 100px;
}
.card-button {
  width: 50px;
  height: 100%;
}
.main {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-around;
}
/* 这里左右换位 */
.mainleft {
  width: 30vw;
}
.header {
  display: flex;
  justify-content: center;
}
.righthead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  padding-right: 8px;
}
.mainright {
  position: relative;
  left: 5vw;
}
</style>