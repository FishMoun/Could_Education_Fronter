<template>
  <!-- 节次学习 -->
  <div class="classlearningcontent">
    <!-- 节次学习左侧资源区 -->
    <el-scrollbar class="left">
      <!-- 左上本节概要区 -->
      <div class="classintroduction">
        <el-button @click="changerole" style="position: absolute; left: 0"
          >当前是{{ isTeacher ? "老师" : "学生" }}模式</el-button
        >
        <el-card shadow="never" class="introduction-card">
          <div style="font-size: 20px">算法设计与分析第1节概要:</div>
          <div v-if="introduction != ''">
            <p>{{ introduction }}</p>
          </div>
          <el-button
            style="margin-top: 10px"
            link
            type="primary"
            v-show="isTeacher == true"
            @click="editcontent"
            >编辑</el-button
          >
          <!-- 编辑内容的对话框 -->
          <el-dialog
            v-model="editcontentdialogVisible"
            title="本节概要"
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
      <!-- 主要资源区，用折叠面板实现 -->
      <div style="margin-left: 10px; height: 70vh">
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
          <el-collapse-item name="1">
            <template #title>
              <div class="header">PPT课件</div>
            </template>
            <el-button
              style="margin-left: 10px; margin-top: 10px"
              type="primary"
              v-show="isTeacher == true"
              >上传</el-button
            >
            <div>
              <div class="pptzone">
                <canvas :id="'the-canvas' + num"></canvas>
              </div>
              <div class="pptoperatebar">
                <el-button @click="previous">上一页</el-button>
                <div>{{ num }}/{{ pages }}</div>
                <div>
                  <el-button @click="zoomin">放大</el-button>
                  <el-button @click="zoomout">缩小</el-button>
                  <el-button @click="next">下一页</el-button>
                </div>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template #title> <div class="header">教学视频</div> </template>
            <el-button
              style="margin-left: 10px; margin-top: 10px"
              type="primary"
              v-show="isTeacher == true"
              >上传</el-button
            >
            <div class="videozone">
              <video-player
                class="vjs-custom-skin videoPlayer"
                ref="videoplayer"
                :playsinline="true"
                width="800px"
                height="600px"
                :options="playerOptions"
                customEventName="changed"
              >
              </video-player>
            </div>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template #title>
              <div class="header">共享资源</div>
            </template>
            <el-button
              style="margin-left: 10px; margin-top: 10px"
              type="primary"
              >上传</el-button
            >
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-scrollbar>
    <div>
      <!-- 折叠元素 -->
      <el-button link @click="collapsediscusszone"
        ><el-icon v-if="isDiscusszoneCollapse"><DArrowLeft /></el-icon>
        <el-icon v-else> <DArrowRight /></el-icon>
      </el-button>
    </div>
    <!-- 右侧讨论区 -->
    <transition>
      <div class="discusszone" v-show="isDiscusszoneCollapse == false">
        <!-- 讨论区标题 -->
        <el-header>
          <el-card
            shadow="never"
            style="margin-top: 10px; text-align: center; min-height: 100%"
          >
            <div style="font-size: 24px">讨论区</div>
          </el-card>
        </el-header>
        <!-- 讨论区主体 -->
        <el-main style="height: 95%">
          <!-- 讨论卡片 -->
          <el-card shadow="never" style="height: 90%; padding: 0">
            <div class="inputzone">
              <el-input
                v-model="mydiscussion"
                autosize
                type="textarea"
                placeholder="发布讨论"
                resize="none"
              />
              <el-button type="primary" style="margin-left: 10px"
                >发布</el-button
              >
            </div>
            <div style="margin-bottom: 5px" v-show="activeNames == '1'">
              <el-button link>全部</el-button>
              <el-divider direction="vertical" />
              <el-button link style="margin-left: 0"
                >看当前第{{ num }}页</el-button
              >
            </div>
            <el-scrollbar height="66vh">
              <el-card
                class="discussion-card"
                shadow="never"
                v-for="(item, value) in discusslist"
                :key="value"
              >
                <div class="userinfo">{{ item.name }}</div>
                <div class="userdiscussion">
                  <p>{{ item.content }}</p>
                </div>
                <div class="usercredit">
                  <div>{{ item.date }}</div>
                  <div class="credit-right">
                    <div style="margin-right: 5px">
                      <el-button link>
                        <el-icon>
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-dianzan"></use>
                          </svg>
                        </el-icon>
                      </el-button>
                      {{ item.creditnum }}
                    </div>
                    <el-button link @click="item.replyvisible = true"
                      >回复</el-button
                    >
                  </div>
                </div>
                <div class="replyinput" v-show="item.replyvisible">
                  <el-input
                    v-model="mydiscussion"
                    autosize
                    type="textarea"
                    placeholder="写回复"
                    resize="none"
                    style="width: 70%"
                  />
                  <el-button
                    type="primary"
                    style="margin-left: 10px; height: 30px"
                    >回复</el-button
                  >
                  <el-button link @click="item.replyvisible = false"
                    ><el-icon><CloseBold /></el-icon
                  ></el-button>
                </div>
                <el-divider style="margin: 5px" />
                <div
                  class="userrelpy"
                  v-for="(subitem, subvalue) in item.replycard"
                  :key="subvalue"
                >
                  <el-card
                    shadow="never"
                    class="replycard"
                    body-style="padding:0 0 0 5px "
                  >
                    <div class="userinfo">{{ subitem.name }}</div>
                    <div class="userdiscussion">
                      <p>{{ subitem.content }}</p>
                    </div>
                    <div class="usercredit">
                      <div>{{ subitem.date }}</div>
                      <div class="credit-right">
                        <div style="margin-right: 5px">
                          <el-button link>
                            <el-icon>
                              <svg class="icon" aria-hidden="true">
                                <use xlink:href="#icon-dianzan"></use>
                              </svg>
                            </el-icon>
                          </el-button>
                          {{ subitem.creditnum }}
                        </div>
                      </div>
                    </div></el-card
                  >
                </div>
              </el-card>
            </el-scrollbar></el-card
          ></el-main
        >
      </div>
    </transition>
  </div>
</template>

<script>
//video引入
import VideoPlayer from "./utilCom/VideoPlayer.vue";
//pdf引入
import * as pdfjsLib from "pdfjs-dist";
import { toRaw } from "vue";
import { ElMessage } from "element-plus";
export default {
  name: "Classlearning",
  components: {
    VideoPlayer,
  },
  data() {
    return {
      title: "查看协议",
      pdfDoc: null,
      pages: 0,
      num: 1,
      mydiscussion: "",
      //控制画布放大缩小
      myscale: 0.6,
      //节次介绍的内容
      introduction: "",
      //正在编辑的节次介绍的内容
      editintroduction: "",
      //编辑介绍的对话框
      editcontentdialogVisible: false,
      //折叠讨论区
      isDiscusszoneCollapse: false,
      //左侧折叠面板的打开情况
      activeNames: "",
      //评论卡片
      discusslist: [
        {
          name: "秦岭",
          content: "你好",
          date: "两天前",
          creditnum: "2",
          replyvisible: false,
          replycard: [
            {
              name: "葛天辰",
              content: "你也好",
              date: "一天前",
              creditnum: "1",
            },
            {
              name: "韩耀杰",
              content: "你也好",
              date: "一天前",
              creditnum: "1",
            },
          ],
        },
        {
          name: "李锴凌",
          content: "你好",
          date: "两天前",
          creditnum: "2",
          replyvisible: false,
          replycard: [
            {
              name: "陈佩沛",
              content: "你也好",
              date: "一天前",
              creditnum: "1",
            },
          ],
        },
        {
          name: "秦岭",
          content: "你好",
          date: "两天前",
          creditnum: "2",
          replyvisible: false,
          replycard: [
            {
              name: "葛天辰",
              content: "你也好",
              date: "一天前",
              creditnum: "1",
            },
            {
              name: "韩耀杰",
              content: "你也好",
              date: "一天前",
              creditnum: "1",
            },
          ],
        },
      ],
    };
  },
  computed: {
    isTeacher() {
      return this.$store.state.isTeacher;
    },
  },
  mounted() {
    this.initThePDFJSLIB();
    let url = "/src/assets/ppttest/ppt_test.pdf";
    this._loadFile(url);
  },
  methods: {
    // 初始化pdfjs
    initThePDFJSLIB: function () {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/src/plugins/pdf.worker.js";
    },
    /* pdf渲染 */
    _renderPage(num) {
      toRaw(this.pdfDoc)
        .getPage(num)
        .then((page) => {
          let canvas = document.getElementById("the-canvas" + num);
          let ctx = canvas.getContext("2d");
          const viewport = page.getViewport({ scale: this.myscale });
          var CSS_UNITS = 96.0 / 72.0;
          canvas.height = Math.floor(viewport.height * CSS_UNITS);
          canvas.width = Math.floor(viewport.width * CSS_UNITS);
          // 画布的dom大小, 设置移动端,宽度设置铺满整个屏幕
          const clientWidth = canvas.width;
          canvas.style.width = clientWidth + "px";
          // 根据pdf每页的宽高比例设置canvas的高度
          canvas.style.height =
            clientWidth * (canvas.height / canvas.width) + "px";
          page.render({
            transform: [CSS_UNITS, 0, 0, CSS_UNITS, 0, 0],
            canvasContext: ctx,
            viewport,
          });
        });
    },
    /* 获取pdf相关信息 */
    _loadFile(url) {
      const loadingTask = pdfjsLib.getDocument(url);
      loadingTask.promise.then((pdf) => {
        console.log(pdf);
        this.pdfDoc = pdf;
        this.pages = pdf.numPages;
        this.$nextTick(() => {
          this._renderPage(1);
        });
      });
    },
    /* 下一页 */
    next() {
      if (this.num < this.pages) {
        this.num++;
        this._renderPage(this.num);
      }
    },
    /* 上一页 */
    previous() {
      if (this.num !== 1) {
        this.num--;
        this._renderPage(this.num);
      }
    },
    // 放大
    zoomin() {
      if (this.myscale > 1.1) ElMessage("已经是最大了");
      else {
        this.myscale += 0.1;
        this._renderPage(this.num);
      }
    },
    // 缩小
    zoomout() {
      if (this.myscale < 0.3) ElMessage("已经是最小了");
      else {
        this.myscale -= 0.1;
        this._renderPage(this.num);
      }
    },
    changerole() {
      this.$store.state.isTeacher = !this.$store.state.isTeacher;
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
    //折叠讨论区
    collapsediscusszone() {
      this.isDiscusszoneCollapse = !this.isDiscusszoneCollapse;
    },
  },
};
</script>

<style scoped>
.el-header {
  height: auto;
  padding-left: 0;
}
.el-main {
  padding-top: 10px;
  padding-left: 0;
}
canvas {
  display: block;
  border-bottom: 1px solid black;
}
.pptoperatebar {
  display: flex;
  justify-content: space-around;
}
.canvasbox {
  border: 1px solid;
  width: fit-content;
}
.left {
  width: 100%;
  height: 80vh;
}
.discusszone {
  width: 30vw;
  height: 90vh;
}
.pptzone {
  display: flex;
  justify-content: center;
}
.header {
  margin-left: 10px;
}
.classintroduction {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.classlearningcontent {
  display: flex;
}
.introduction-card {
  width: 30vw;
  min-height: 10vh;
  margin-bottom: 10px;
}
.inputzone {
  display: flex;
  flex-direction: row;
  margin-bottom: 2px;
}
.userinfo {
  color: #606266;
  font-size: 15px;
  margin-bottom: 5px;
}
.userdiscussion {
  margin-bottom: 5px;
}
.usercredit {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: #909399;
  font-size: 15px;
  margin-bottom: 5px;
}
.credit-right {
  display: flex;
  flex-direction: raw;
  align-items: center;
}
.videozone {
  display: flex;
  justify-content: center;
}
.replyinput {
  display: flex;
}
/* 回复卡片 */
.replycard {
  border: 0;
  padding: 0px;
}
.discussion-card {
  margin-bottom: 10px;
}
</style>