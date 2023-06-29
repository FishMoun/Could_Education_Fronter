<template>
  <el-button
    @click="changerole"
    style="position: absolute; left: 0"
    v-show="false"
    >{{ isTeacher ? "老师" : "学生" }}</el-button
  >
  <!-- 内容区 -->
  <div class="main">
    <div class="mainleft">
      <div style="margin-top: 10px; display: flex; justify-content: right">
        <el-button
          type="primary"
          @click="expDialogVisible = true"
          v-show="isTeacher"
          >创建课程实验</el-button
        >
        <el-button type="primary" v-show="isTeacher" @click="goToHomework"
          >布置课程作业</el-button
        >
      </div>
      <!-- 实验的对话框 -->
      <el-dialog
        v-model="expDialogVisible"
        title="创建课程实验"
        width="25%"
        center
      >
        <span style="font-size: 20px">实验名称：</span>
        <div style="height: 10px"></div>
        <el-input
          v-model="expInfo.name"
          placeholder="输入实验名称"
          style="margin-bottom: 10px"
        />
        <span style="font-size: 20px; margin-bottom: 10px" v-show="false"
          >实验介绍：</span
        >

        <el-input
          v-model="expInfo.introduction"
          :rows="4"
          type="textarea"
          placeholder="输入实验介绍"
          :resize="'none'"
          style="margin-top: 10px"
          v-show="false"
        />
        <!-- <span style="font-size: 20px">选择截止日期：</span>
        <div>
          <el-date-picker
            v-model="expInfo.date"
            type="datetime"
            placeholder="选择截止日期"
          />
        </div> -->
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="expDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="createExp"> 确定 </el-button>
          </span>
        </template>
      </el-dialog>
      <el-card shadow="never" class="introduction-card">
        <div style="font-size: 20px">课程介绍</div>
        <p>
          {{ introduction }}
        </p>
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
            <el-card :body-style="{ padding: '0px', width: '100%' }">
              <div class="card-content">
                <div class="card-main">
                  <h2>{{ activity.title }}</h2>
                  <span style="color: #909399"
                    >{{ activity.teacher }} {{ activity.week
                    }}{{ activity.weekth }}</span
                  >
                  <div class="subchapter">
                    <el-tag
                      v-for="item in activity.subChapter"
                      type="success"
                      size="large"
                      :key="item.id"
                      style="margin: 10px"
                      >{{ item.name }}</el-tag
                    >
                  </div>
                  <el-button
                    style="margin-top: 10px; position: absolute; bottom: 10px"
                    link
                    type="primary"
                    v-show="isTeacher === true"
                    @click="addChapterTab(activity.id)"
                    >添加章节标签</el-button
                  >
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
          <el-card shadow="never" style="height: 70vh">
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
                    @keyup.enter="handleInputConfirm(data, $event)"
                    @blur="handleInputConfirm(data, $event)"
                  />
                  <span
                    v-else
                    @click="showInput(data)"
                    style="font-size: 20px"
                    >{{ node.label }}</span
                  >
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
          </el-card>
        </div>
        <el-dialog
          v-model="subChapterDialogVisible"
          title="添加章节标签"
          width="15%"
          center
        >
          <el-select
            v-model="subChapterList"
            class="m-2"
            placeholder="选择章节"
            size="large"
            multiple
            :loading="chapterloading"
            @visible-change="searchRemoteChapter"
          >
            <el-option
              v-for="item in subChapter"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="subChapterDialogVisible = false"
                >取消</el-button
              >
              <el-button type="primary" @click="submitChapterAdd">
                确定
              </el-button>
            </span>
          </template>
        </el-dialog>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
export default {
  name: "Courseview",
  data() {
    return {
      subChapter: [],
      subChapterList: [],
      chapterloading: false,
      //二级章节标签
      subChapterDialogVisible: false,
      //实验创建按钮
      expDialogVisible: false,
      //判断现在是新增章节还是修改章节
      isCreateChapter: true,
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
      expInfo: {
        name: "",
        introduction: "",
        date: null,
      },
      curclassId: "",
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
    //获得课程描述信息
    await this.getCourseIntroduction();
  },

  methods: {
    //获得课程描述信息
    async getCourseIntroduction() {
      let res = await this.$request(
        `/admin/manager/course/get-desc/${this.courseId}`,
        "",
        "get",
        "params",
        "json"
      );
      if (res && res.data.code === 20000) {
        this.introduction = res.data.data.description.description;
      }
    },
    //搜索章节Id
    async searchRemoteChapter(val) {
      this.chapterloading = true;
      if (val) {
        let res = await this.$request(
          `/manager/chapter/get/${this.courseId}`,
          "",
          "get",
          "params",
          "json"
        );
        console.log(res);
        console.log(
          res && res.data.code === 20000 && res.data.data.chapters.length !== 0
        );
        if (
          res &&
          res.data.code === 20000 &&
          res.data.data.chapters.length !== 0
        ) {
          let newSubChapterList = [];
          for (let i = 0; i < res.data.data.chapters.length; i++) {
            let children = res.data.data.chapters[i].children;
            for (let j = 0; j < children.length; j++) {
              console.log(children[j]);
              newSubChapterList.push(children[j].subChapter);
            }
          }
          this.subChapter = newSubChapterList.map((item) => {
            return {
              value: item.id,
              label: item.name,
            };
          });
          console.log(res);
          this.chapterloading = false;
        }
        console.log(this.subChapter);
      }
    },
    //创建一个新的课程实验
    async createExp() {
      let params = {
        courseId: this.courseId,
        // endTime: this.expInfo.date,
        introduction: this.expInfo.introduction,
        name: this.expInfo.name,
      };
      let res = await this.$request(
        "exp/course/create-exp",
        params,
        "post",
        "params",
        "json"
      );
      console.log(res);
      if (res && res.data.code === 20000) {
        ElMessage.success("创建成功！");
        this.expDialogVisible = false;
      } else {
        ElMessage.error("创建失败，请稍后重试！");
      }
    },
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
      let state = ["info", "primary", "success"];
      let iconfill = ["", "MoreFilled", "Check"];
      let newactivity = [];
      console.log(timeinfo);
      for (let i = 0; i < timeinfo.length; i++) {
        let item = timeinfo[i];

        newactivity.push({
          id: item.id,
          timestamp: item.date.split(" ")[0],
          size: "large",
          icon: iconfill[item.status],
          type: state[item.status],
          title: item.courseName + `第${i + 1}大节`,
          teacher: item.teacherName,
          week: `第${item.week}周`,
          weekth: `周${weekday[item.dayOfWeek - 1]}第${item.beginIndex}~${
            item.endIndex
          }节`,
          overview: "",
          subChapter: item.subChapters.map((item) => {
            return {
              name: item.name,
              id: item.id,
            };
          }),
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

      //计算章节和子章节的个数
      let count = 0;
      if (res && res?.data.code === 20000) {
        if (res.data.data.chapters.length !== 0) this.isCreateChapter = false;
        newChapterList = res.data.data.chapters.map((item) => {
          count++;
          return {
            id: item.chapter.id,
            label: item.chapter.name,
            type: 1,
            children: item.children.map((item2) => {
              count++;
              return {
                type: 2,
                id: item2.subChapter.id,
                label: item2.subChapter.name,
                timetable: item2?.timetables || [],
              };
            }),
          };
        });
      }

      this.id = String(parseInt(this.id + "0000") + count + 50);
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
    //提交课程简介
    async submitIntroduction() {
      let params = {
        courseId: this.courseId,
        description: this.editintroduction,
      };
      let res = await this.$request(
        "/admin/manager/course/add-desc",
        params,
        "post",
        "params",
        "json"
      );
      if (res && res.data.code === 20000) {
        ElMessage.success("简介更新成功！");
        this.introduction = this.editintroduction;
      } else {
        ElMessage.error("更新失败，请稍后重试！");
      }

      this.editcontentdialogVisible = false;
    },
    //编辑大纲
    startEdit() {
      this.showeditoutline = true;
      this.showeditfinish = true;
    },
    async endEdit() {
      if (this.treedata.length !== 0) {
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
                  name: item2.label,
                  number: index2,
                },
                timetables: item2?.timetable || [],
              };
            }),
          };
        });
        let res = await this.$request(
          `/manager/chapter/save/${this.$route.params.id}`,
          params,
          "post",
          "params",
          "json"
        );
        if (res && res.data.code === 20000) {
          ElMessage.success("编辑成功！");
        } else {
          ElMessage.error("编辑失败，请稍后重试！");
        }
      }

      this.showeditfinish = false;
      this.showeditoutline = false;
      if (this.treedata.length === 0) this.isCreateChapter = true;
      else this.isCreateChapter = false;
    },
    //向后增加章节
    addChapter() {
      const brother = {
        id: String(++this.id),
        label: "新章节，点击编辑内容",
        children: [],
        inputvisible: false,
        type: 1,
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
        type: 2,
      };
      if (!data.children) {
        data.children = [];
      }
      data.children.push(newChild);
    },
    //删除节点
    async remove(node, data) {
      let res;
      if (!this.isCreateChapter && !data.label.includes("点击编辑内容")) {
        if (data.type === 1) {
          res = await this.$request(
            `/manager/chapter/remove-chapter/${data.id}`,
            "",
            "delete",
            "params",
            "json"
          );
        } else {
          res = await this.$request(
            `/manager/chapter/remove-sub/${data.id}`,
            "",
            "delete",
            "params",
            "json"
          );
        }
        console.log("delete", res);
        if (res && res.data.code === 20000) {
          ElMessage.success("删除成功！");
        } else {
          ElMessage.error("删除失败,请稍后重试!");
        }
      }
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },
    //出现输入框
    showInput(data) {
      if (this.isTeacher && this.showeditoutline) {
        data.inputvisible = true;
        this.chapterInputValue = data.label;
        this.$nextTick(() => {
          this.$refs.InputRef.focus();
        });
      }
    },
    //章节添加框
    addChapterTab(id) {
      this.subChapterDialogVisible = true;
      this.curclassId = id;
    },
    //输入框确认
    async handleInputConfirm(data, $event) {
      if (
        !this.isCreateChapter &&
        this.chapterInputValue &&
        this.chapterInputValue !== data.label &&
        !data.label.includes("点击编辑内容")
      ) {
        //这里进行单个标签的修改
        let res;
        if (data.type === 1) {
          res = await this.$request(
            `/manager/chapter/update-chapter/${data.id}/${this.chapterInputValue}`,
            "",
            "put",
            "params",
            "json"
          );
          if (res && res.data.code === 20000) {
            ElMessage.success("修改成功！");
            data.label = this.chapterInputValue;
            this.chapterInputValue = "";
          } else {
            ElMessage.error("修改失败，请稍后重试!");
          }
        } else {
          res = await this.$request(
            `/manager/chapter/update-sub/${data.id}/${this.chapterInputValue}`,
            "",
            "put",
            "params",
            "json"
          );
          if (res && res.data.code === 20000) {
            ElMessage.success("修改成功！");
            data.label = this.chapterInputValue;
            this.chapterInputValue = "";
          } else {
            ElMessage.error("修改失败，请稍后重试!");
          }
        }
        console.log(res);
      } else {
        data.label = this.chapterInputValue;
        this.chapterInputValue = "";
      }
      data.inputvisible = false;
    },
    //提交内容
    async submitChapterAdd() {
      let tmpparams = this.subChapterList;
      let res = await this.$request(
        `/admin/manager/timetable/add-chapter/${this.curclassId}`,
        tmpparams,
        "post",
        "params",
        "json"
      );
      if (res && res.data.code === 20000) {
        ElMessage.success("添加成功！");
        this.subChapterDialogVisible = false;
        await this.getTimeList();
      } else ElMessage.error("添加失败，请稍后重试！");
      await getTimeList();
    },
    //去作业界面
    goToHomework() {
      console.log(123);
      this.$router.push({
        path: "/homeworkmanagement",
      });
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
.subchapter {
  margin-top: 10px;
}
</style>