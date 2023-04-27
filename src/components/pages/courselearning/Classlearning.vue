<template>
  <!-- 节次学习 -->
  <div class="classlearningcontent">
    <!-- 节次学习左侧资源区 -->
    <el-scrollbar class="left">
      <!-- 左上本节概要区 -->
      <div class="classintroduction">
        <el-button
          @click="changerole"
          style="position: absolute; left: 0"
          v-show="false"
          >当前是{{ isTeacher ? "老师" : "学生" }}模式</el-button
        >
        <el-card shadow="never" class="introduction-card">
          <div style="font-size: 20px; text-align: center">
            {{ courseName }} {{ classtitle }}
          </div>
          <div class="subchapter">
            <el-tag
              v-for="item in subChapterList"
              type="success"
              size="large"
              :key="item.id"
              style="margin: 10px"
              >{{ item.name }}</el-tag
            >
          </div>
          <!-- 编辑内容的对话框 -->
        </el-card>
      </div>
      <!-- 主要资源区，用折叠面板实现 -->
      <div style="margin-left: 10px; height: 70vh">
        <el-collapse v-model="activeNames" accordion @change="changeResource">
          <el-collapse-item name="1">
            <template #title>
              <div class="header" style="font-size: 18px">课堂课件</div>
            </template>
            <!-- PPT资源操作 -->
            <div class="button-wrapper">
              <el-upload
                style="display: inline-block"
                class="upload-demo"
                :action="uploadPPTUrl"
                :on-success="handleSuccessPPT"
                :on-error="handleErr"
                :on-progress="handleprogress"
                :headers="{ token: this.$store.state.token }"
                :show-file-list="false"
              >
                <template #trigger>
                  <el-button
                    style="margin-left: 10px; margin-top: 10px"
                    type="primary"
                    v-show="isTeacher == true"
                    >上传</el-button
                  >
                </template>
              </el-upload>
              <a :href="this.PPTUrl">
                <el-button
                  style="margin-left: 10px; margin-top: 10px"
                  type="primary"
                  v-show="isPPTExist === true"
                  @click="downloadPPT"
                  >下载
                </el-button>
              </a>
              <el-button
                style="margin-left: 10px; margin-top: 10px"
                type="danger"
                v-show="isTeacher === true && isPPTExist === true"
                @click="deletePPT"
                >删除</el-button
              >
              <el-button
                type="primary"
                style="margin-left: 10px; margin-top: 10px"
                v-show="isPPTExist === true"
                @click="starResource"
                ><el-icon class="el-icon--left"><Star /></el-icon
                >收藏</el-button
              >
            </div>
            <div v-show="isPPTExist" style="margin-top: 10px">
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
            <template #title>
              <div class="header" style="font-size: 18px">教学视频</div>
            </template>
            <!-- 视频资源操作 -->
            <div class="button-wrapper">
              <el-upload
                :show-file-list="false"
                style="display: inline-block"
                class="upload-demo"
                :action="uploadVideoUrl"
                :on-success="handleSuccessVideo"
                :on-error="handleErr"
                :on-progress="handleprogress"
                :headers="{ token: this.$store.state.token }"
              >
                <template #trigger>
                  <el-button
                    style="margin-left: 10px; margin-top: 10px"
                    type="primary"
                    v-show="isTeacher == true"
                    >上传</el-button
                  >
                </template>
              </el-upload>
              <el-button
                style="margin-left: 10px; margin-top: 10px"
                type="danger"
                v-show="isTeacher === true && isVideoExist === true"
                @click="deleteVideo"
                >删除</el-button
              >
              <a :href="videoUrl">
                <el-button
                  style="margin-left: 10px; margin-top: 10px"
                  type="primary"
                  v-show="isVideoExist === true"
                  @click="downloadPPT"
                  >下载
                </el-button>
              </a>
              <el-button
                type="primary"
                style="margin-left: 10px; margin-top: 10px"
                v-show="isVideoExist === true"
                @click="starResource"
                ><el-icon class="el-icon--left"><Star /></el-icon
                >收藏</el-button
              >
            </div>
            <div
              class="videozone"
              v-show="isVideoExist"
              style="margin-top: 10px"
            >
              <video-player
                :src="videoUrl"
                :height="450"
                @timeupdate="logtime($event)"
                controls
                :disablePictureInPicture="true"
                :playback-rates="[0.5, 1.0, 1.5, 2.0]"
                :volume="0.6"
              />
            </div>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template #title>
              <div class="header" style="font-size: 18px">共享资源</div>
            </template>
            <!-- 共享资源操作 -->

            <el-upload
              class="upload-demo"
              :action="uploadShareUrl"
              :on-success="handleSuccessShare"
              :on-error="handleErr"
              :on-progress="handleprogress"
              list-type="picture"
              :show-file-list="false"
              :headers="{ token: this.$store.state.token }"
            >
              <template #trigger>
                <el-button
                  style="margin-left: 10px; margin-top: 10px"
                  type="primary"
                  >上传</el-button
                >
              </template>
            </el-upload>

            <el-card
              shadow="never"
              v-for="item in sharefileList"
              :key="item.id"
              v-show="sharefileList.length !== 0"
              style="margin: 10px"
              class="card-hover"
              @click="getShareDiscussionList(item)"
            >
              <div class="filelist">
                <div style="display: flex; align-items: center">
                  <img
                    style="width: 70px; height: 70px"
                    :src="getFileImage(item.name)"
                    alt=""
                  />

                  <span>{{ item.name }}</span>
                </div>
                <div class="fileicon">
                  <el-icon
                    size="20px"
                    v-show="isTeacher"
                    @click="deleteShare(item.id)"
                    style="cursor: pointer"
                    ><Delete
                  /></el-icon>
                  <a :href="item.url" style="margin-top: 5px"
                    ><el-icon size="20px" color=""><Download /></el-icon
                  ></a>
                  <el-icon
                    size="20px"
                    @click="starShareFile(item.fileId)"
                    style="cursor: pointer"
                    ><Star
                  /></el-icon>
                </div>
              </div>
            </el-card>
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
              <el-button
                type="primary"
                style="margin-left: 10px"
                @click="submitCurrentDiscussion"
                >发布</el-button
              >
            </div>
            <div
              style="margin-bottom: 5px; display: flex; align-items: center"
              v-show="activeNames === '1' && isPPTExist"
            >
              <el-button link @click="getDiscussionById(PPTId[0])"
                >全部</el-button
              >
              <el-divider direction="vertical" />
              <el-button
                link
                style="margin-left: 0"
                @click="goToDiscussionByPage"
                >当前第{{ num }}页</el-button
              >
            </div>
            <div
              style="margin-bottom: 5px; display: flex; align-items: center"
              v-show="activeNames === '3' && currentShareResource.id"
            >
              <span>{{ this.currentShareResource?.name }}</span>
            </div>
            <el-scrollbar height="66vh">
              <el-card
                class="discussion-card"
                shadow="never"
                v-for="(item, value) in discusslist"
                :key="value"
              >
                <div class="discuss-header">
                  <div class="userinfo">{{ item.name }}</div>
                  <span
                    v-show="item.page && activeNames === '1'"
                    style="font-size: 10px"
                    >来源课件第{{ item.page }}页</span
                  >
                  <span v-show="activeNames === '2'" style="font-size: 10px"
                    >来源{{ item.time }}</span
                  >
                </div>
                <div class="userdiscussion">
                  <p>{{ item.content }}</p>
                </div>
                <div class="usercredit">
                  <div>{{ item.date }}</div>
                  <div class="credit-right">
                    <div style="margin-right: 5px">
                      <el-button link @click="creditDiscussion(item)">
                        <el-icon>
                          <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-dianzan"></use>
                          </svg>
                        </el-icon>
                        <span>{{ item.creditnum }}</span>
                      </el-button>
                    </div>
                    <el-button link @click="item.replyvisible = true"
                      >回复</el-button
                    >
                  </div>
                </div>
                <div class="replyinput" v-show="item.replyvisible">
                  <el-input
                    v-model="myreplydiscussion"
                    autosize
                    type="textarea"
                    placeholder="写回复"
                    resize="none"
                    style="width: 70%"
                  />
                  <el-button
                    type="primary"
                    style="margin-left: 10px; height: 30px"
                    @click="submitReplyDiscussion(item)"
                    >回复</el-button
                  >
                  <el-button link @click="item.replyvisible = false"
                    ><el-icon><CloseBold /></el-icon
                  ></el-button>
                </div>
                <el-divider
                  style="margin: 5px"
                  v-show="item.replycard.length !== 0"
                />
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
                          <el-button
                            link
                            @click="creditDiscussionReply(subitem)"
                          >
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
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";
//pdf引入
import * as pdfjsLib from "pdfjs-dist";
import { toRaw } from "vue";
import { ElMessage } from "element-plus";
import { Download } from "@element-plus/icons-vue";
import pdfUrl from "/src/assets/img/pdf.png";
import pptUrl from "/src/assets/img/ppt.png";
import txtUrl from "/src/assets/img/txt.png";
import wordUrl from "/src/assets/img/word.png";
import zipUrl from "/src/assets/img/zip.png";
import unknownUrl from "/src/assets/img/unknown.png";
import workerURL from "/src/plugins/pdf.worker.js?url";
export default {
  name: "Classlearning",
  components: {
    VideoPlayer,
  },
  data() {
    return {
      //资源讨论
      courseName: "",
      currentShareResource: {
        id: "",
        name: "",
      },
      subChapterList: [],
      //视频播放时间
      playingtime: 0,
      isPPTExist: false,
      isVideoExist: false,
      isShareExist: false,
      PPTId: [],
      PPTUrl: "",
      videoId: "",
      videoUrl: "",
      shareId: [],
      shareUrl: [],
      PPTfileList: [],
      videofileList: [],
      sharefileList: [],
      title: "查看协议",
      pdfDoc: null,
      pages: 0,
      num: 1,
      mydiscussion: "",
      myreplydiscussion: "",
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
        // {
        //   name: "秦岭",
        //   content: "你好",
        //   date: "两天前",
        //   creditnum: "2",
        //   replyvisible: false,
        //   replycard: [
        //     {
        //       name: "葛天辰",
        //       content: "你也好",
        //       date: "一天前",
        //       creditnum: "1",
        //     },
        //     {
        //       name: "韩耀杰",
        //       content: "你也好",
        //       date: "一天前",
        //       creditnum: "1",
        //     },
        //   ],
        // },
        // {
        //   name: "李锴凌",
        //   content: "你好",
        //   date: "两天前",
        //   creditnum: "2",
        //   replyvisible: false,
        //   replycard: [
        //     {
        //       name: "陈佩沛",
        //       content: "你也好",
        //       date: "一天前",
        //       creditnum: "1",
        //     },
        //   ],
        // },
        // {
        //   name: "秦岭",
        //   content: "你好",
        //   date: "两天前",
        //   creditnum: "2",
        //   replyvisible: false,
        //   replycard: [
        //     {
        //       name: "葛天辰",
        //       content: "你也好",
        //       date: "一天前",
        //       creditnum: "1",
        //     },
        //     {
        //       name: "韩耀杰",
        //       content: "你也好",
        //       date: "一天前",
        //       creditnum: "1",
        //     },
        //   ],
        // },
      ],
      //存放fileId
      files: {},
      chapterloading: false,
      classinfo: {},
      classSubChapterTab: [],
    };
  },
  computed: {
    //视频秒数切换
    getTime() {
      let time = this.playingtime;
      let h = parseInt((time / 60 / 60) % 24);
      h = h < 10 ? "" + h : h;
      let m = parseInt((time / 60) % 60);
      m = m < 10 ? "" + m : m;
      let s = parseInt(time % 60);
      s = s < 10 ? "" + s : s;
      // 作为返回值返回
      return `${m}分${s}秒`;
    },
    isTeacher() {
      return this.$store.state.isTeacher;
    },
    //PPT上传地址
    uploadPPTUrl() {
      return `http://60.204.141.214:30900/manager/course-resource/upload-timetable/ppt/${this.$route.params.courseId}/${this.$route.params.classId}`;
    },
    //视频上传地址
    uploadVideoUrl() {
      return `http://60.204.141.214:30900/manager/course-resource/upload-timetable/video/${this.$route.params.courseId}/${this.$route.params.classId}`;
    },
    //共享资源上传地址
    uploadShareUrl() {
      return `http://60.204.141.214:30900/manager/course-resource/upload-timetable/share/${this.$route.params.courseId}/${this.$route.params.classId}`;
    },
    courseId() {
      return this.$route.params.courseId;
    },
    classId() {
      return this.$route.params.classId;
    },
    userId() {
      return this.$store.state.userInfo.id;
    },
    classtitle() {
      let weekday = ["一", "二", "三", "四", "五", "六", "日"];
      return `第${this.classinfo?.week}周周${
        weekday[this.classinfo?.dayOfWeek - 1]
      }第${this.classinfo?.beginIndex}~${this.classinfo?.endIndex}节`;
    },
    currentResourceId() {
      if (this.activeNames === "1") return this.PPTId[0];
      else if (this.activeNames === "2") return this.videoId;
      else if (this.activeNames === "3") {
        return this.currentShareResource.id;
      } else {
        this.discusslist = [];
        return "";
      }
    },
  },
  watch: {
    isPPTExist(newVal) {
      if (newVal) this._loadFile(this.PPTUrl);
    },
  },
  async mounted() {
    //获取章节标签
    await this.getClassSubChapterTab();
    //获取小节信息
    let res = await this.$request(
      `/admin/manager/timetable/get/${this.classId}`,
      "",
      "get",
      "params",
      "json"
    );
    if (res && res.data.code === 20000) {
      this.classinfo = res.data.data.timetable;
    }
    this.initThePDFJSLIB();
    let ppturl = await this.getClassPPTUrl();
    if (ppturl) {
      this.PPTUrl = ppturl;
      this.isPPTExist = true;
      await this.getDiscussionById(this.PPTId[0]);
    }

    this.$nextTick(() => {
      this.activeNames = "1";
    });

    let videourl = await this.getClassVideoUrl();
    if (videourl) {
      this.videoUrl = videourl;
      this.isVideoExist = true;
    }
    await this.getClassShareUrl();
    this.getCourseName();
  },
  methods: {
    //下载PPT
    async downloadPPT() {},
    //删除PPT
    async deletePPT() {
      let isSuccess = true;
      for (let i = 0; i < this.PPTId.length; i++) {
        let res = await this.$request(
          `/manager/course-resource/delete/${this.courseId}/${this.PPTId[i]}`,
          "",
          "delete",
          "params",
          "json"
        );
        if (res?.data.code !== 20000) isSuccess = false;
      }
      if (isSuccess) {
        this.isPPTExist = false;
        ElMessage.success("删除成功！");
      } else {
        ElMessage.error("删除失败，请稍后重试！");
      }
    },
    //删除视频
    async deleteVideo() {
      let res = await this.$request(
        `/manager/course-resource/delete/${this.courseId}/${this.videoId}`,
        "",
        "delete",
        "params",
        "json"
      );
      if (res && res?.data.code === 20000) {
        this.isVideoExist = false;
        ElMessage.success("删除成功！");
      } else {
        ElMessage.error("删除失败，请稍后重试！");
      }
    },
    //删除共享资源
    async deleteShare(id) {
      let res = await this.$request(
        `/manager/course-resource/delete/${this.courseId}/${id}`,
        "",
        "delete",
        "params",
        "json"
      );
      if (res && res?.data.code === 20000) {
        this.isShareExist = false;
        await this.getClassShareUrl();
        console.log(this.sharefileList);
        ElMessage.success("删除成功！");
      } else {
        ElMessage.error("删除失败，请稍后重试！");
      }
    },
    //获取小节PPT的url
    async getClassPPTUrl() {
      let params = {
        classId: this.$route.params.classId,
      };
      let res = await this.$request(
        "/manager/course-resource/get-timetable/ppt",
        params,
        "get",
        "resful",
        "json"
      );
      console.log("ppt", res);
      let url;
      if (res?.data.code === 20000 && res.data.data.files.length !== 0) {
        let item = res.data.data.files?.find((item) => item.type === "pdf");
        url = item.url;
        this.files.PPTfileId = res.data.data.resource[0].fileId;
        this.PPTId.push(...res.data.data?.resource.map((item) => item.id));
        console.log("fileId", this.files.PPTfileId);
      }

      if (url) return url;
      else return null;
    },
    //获取视频的url
    async getClassVideoUrl() {
      let params = {
        classId: this.$route.params.classId,
      };
      let res = await this.$request(
        "/manager/course-resource/get-timetable/video",
        params,
        "get",
        "resful",
        "json"
      );
      console.log("resvideo", res);
      let url;
      if (res) {
        if (res.data.code === 20000 && res.data.data.urls.length !== 0) {
          let item = res.data.data.urls;
          url = item[0];
          this.videoId = res.data.data.resources[0].id;
          this.files.videofileId = res.data.data.resources[0].fileId;
        }
      }
      console.log(this.files.videofileId);
      if (url) return url;
      else return null;
    },
    //获取共享资源的url
    async getClassShareUrl() {
      let params = {
        classId: this.$route.params.classId,
      };
      let res = await this.$request(
        "/manager/course-resource/get-timetable/share",
        params,
        "get",
        "resful",
        "json"
      );
      console.log("resshare", res);
      if (res) {
        if (res.data.code === 20000 && res.data.data.files.length !== 0) {
          this.sharefileList = res.data.data.files.map((item, index) => {
            return {
              url: item.url,
              name: item.name + "." + item.type,
              type: item.type,
              id: res.data.data.resources[index].id,
              fileId: res.data.data.resources[index].fileId,
            };
          });
          this.shareId = res.data.data.resources.map((item) => item.id);
        } else {
          this.sharefileList = [];
        }
      }
    },
    //文件上传回调
    async handleSuccessPPT(res) {
      console.log(res);
      if (res && res.code === 20000) {
        ElMessage.success("上传成功!");
        this.PPTUrl = await this.getClassPPTUrl();
        this.isPPTExist = true;
      } else ElMessage.success("上传失败，请稍后重试");
    },
    async handleSuccessVideo(res) {
      if (res && res.code === 20000) {
        ElMessage.success("上传成功!");
        this.videoUrl = await this.getClassVideoUrl();
        this.isVideoExist = true;
      } else ElMessage.success("上传失败，请稍后重试");
    },
    async handleSuccessShare(res) {
      if (res && res.code === 20000) {
        ElMessage.success("上传成功!");
        await this.getClassShareUrl();
        this.isShareExist = true;
      } else ElMessage.success("上传失败，请稍后重试");
    },
    handleprogress(p) {
      console.log("p");
      console.log(p);
    },
    handleErr(err) {
      console.log("err");
      console.log(err);
      ElMessage.success("上传失败，请稍后重试");
    },
    // 初始化pdfjs
    initThePDFJSLIB: function () {
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerURL;
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
        this.pdfDoc = pdf;
        this.pages = pdf.numPages;
        this.$nextTick(() => {
          this._renderPage(1);
        });
      });
    },
    /* 下一页 */
    async next() {
      if (this.num < this.pages) {
        this.num++;
        this._renderPage(this.num);
        this.getDiscussionByIdAndPage(this.PPTId[0]);
      } else {
        ElMessage.warning("已经是最后一页了");
      }
    },
    /* 上一页 */
    async previous() {
      if (this.num !== 1) {
        this.num--;
        this._renderPage(this.num);
        this.getDiscussionByIdAndPage(this.PPTId[0]);
      } else {
        ElMessage.warning("没有上一页");
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
    //折叠讨论区
    collapsediscusszone() {
      this.isDiscusszoneCollapse = !this.isDiscusszoneCollapse;
    },
    //视频记录秒数
    logtime(event) {
      this.playingtime = event.target.player.cache_.currentTime;
    },
    //对资源的某一页发表评论
    async submitCurrentDiscussion() {
      if (this.currentResourceId) {
        let pagenum = 0;
        let discussioncontent = this.mydiscussion;
        if (this.activeNames === "1") pagenum = this.num;
        if (this.activeNames === "2")
          discussioncontent = discussioncontent + "##" + this.getTime;
        if (this.mydiscussion) {
          let params = {
            content: discussioncontent,
            page: pagenum,
            resourceId: this.currentResourceId,
            userId: this.userId,
          };
          let res = await this.$request(
            "/manager/course-discussion/issue",
            params,
            "post",
            "params",
            "json"
          );

          console.log("sumbit", res);
          if (res && res.data.code === 20000) {
            ElMessage.success("发布成功！");

            if (this.activeNames === "1") {
              this.getDiscussionByIdAndPage(this.currentResourceId);
            } else this.getDiscussionById(this.currentResourceId);
            this.mydiscussion = "";
          }
        } else {
          ElMessage.error("输入内容不能为空！");
        }
      } else {
        ElMessage.warning("请先选中某个资源哦！");
      }
    },
    //根据资源Id查询讨论
    async getDiscussionById(resourceId) {
      if (resourceId) {
        let res = await this.$request(
          `/manager/course-discussion/list-all/${resourceId}`,
          "",
          "get",
          "params",
          "json"
        );
        console.log(res);
        let tmpdiscusslist;
        if (res && res.data.code === 20000) {
          if (res.data.data.discussions.length !== 0) {
            tmpdiscusslist = res.data.data.discussions.map((item) => {
              return {
                id: item.id,
                name: item.nickname,
                content: item.content.split?.("##")[0] || item.content,
                creditnum: item.likes,
                replyvisible: false,
                date: item.sendTime,
                page: item.page,
                time: item.content.split?.("##")[1],
                replycard: item.replies.map((item2) => {
                  return {
                    id: item2.id,
                    name: item2.nickname,
                    content: item2.content,
                    date: item2.sendTime,
                    creditnum: item2.likes,
                  };
                }),
              };
            });
            this.discusslist = JSON.parse(JSON.stringify(tmpdiscusslist));
            console.log(this.discusslist);
          } else this.discusslist = [];
        }
      }
    },
    //获得资源的某一页的讨论
    async getDiscussionByIdAndPage(resourceId) {
      let res = await this.$request(
        `/manager/course-discussion/list-page/${resourceId}/${this.num}`,
        "",
        "get",
        "params",
        "json"
      );
      console.log(res);
      let tmpdiscusslist;
      if (res && res.data.code === 20000) {
        if (res.data.data.discussions.length !== 0) {
          tmpdiscusslist = res.data.data.discussions.map((item) => {
            return {
              name: item.nickname,
              content: item.content,
              creditnum: item.likes,
              replyvisible: false,
              date: item.sendTime,
              replycard: item.replies.map((item2) => {
                return {
                  id: item2.id,
                  name: item2.nickname,
                  content: item2.content,
                  date: item2.sendTime,
                  creditnum: item2.likes,
                };
              }),
              id: item.id,
            };
          });
          this.discusslist = JSON.parse(JSON.stringify(tmpdiscusslist));
          console.log("123", this.discusslist);
        } else this.discusslist = [];
      }
    },
    async goToDiscussionByPage() {
      await this.getDiscussionByIdAndPage(this.PPTId[0]);
    },
    async submitReplyDiscussion(item) {
      let params = {
        discussionId: item.id,
        userId: this.userId,
        content: this.myreplydiscussion,
      };
      let res = await this.$request(
        "/manager/course-discussion/reply",
        params,
        "post",
        "params",
        "json"
      );
      if (res && res.data.code === 20000) {
        ElMessage.success("回复成功！");
        if (this.activeNames === "1") {
          this.getDiscussionByIdAndPage(this.currentResourceId);
        } else this.getDiscussionById(this.currentResourceId);
        this.myreplydiscussion = "";
        //刷新评论区
      } else {
        ElMessage.error("发送失败，请稍后重试！");
      }
    },
    //给讨论点赞
    async creditDiscussion(item) {
      let discussionId = item.id;
      let res = await this.$request(
        `/manager/course-discussion/like-issue/${discussionId}`,
        "",
        "put",
        "params",
        "json"
      );
      if (res && res.data.code === 20000) {
        console.log(res);
        item.creditnum++;

        ElMessage.success("点赞成功！");
      } else ElMessage.error("点赞失败，请稍后重试！");
    },

    //给讨论回复点赞
    async creditDiscussionReply(item) {
      let replyId = item.id;
      let res = await this.$request(
        `/manager/course-discussion/like-reply/${replyId}`,
        "",
        "put",
        "params",
        "json"
      );

      if (res && res.data.code === 20000) {
        item.creditnum++;
        ElMessage.success("点赞成功！");
      } else ElMessage.error("点赞失败，请稍后重试！");
    },
    //资源缩略图
    getFileImage(name) {
      if (name.includes("pdf")) return pdfUrl;
      else if (name.includes("ppt")) return pptUrl;
      else if (name.includes("txt")) return txtUrl;
      else if (name.includes("zip")) return zipUrl;
      else if (name.includes("doc")) return wordUrl;
      else return unknownUrl;
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
    //查找小节对应的章节标签
    async getClassSubChapterTab() {
      let res = await this.$request(
        `/admin/manager/timetable/get-chapter/${this.classId}`,
        "",
        "get",
        "params",
        "json"
      );
      if (res && res.data.code === 20000) {
        this.subChapterList = res.data.data.subchapters.map((item) => {
          return {
            id: item.id,
            name: item.name,
          };
        });
      }
    },
    //当改变折叠面板的时候触发
    async changeResource() {
      console.log("111");
      await this.getDiscussionById(this.currentResourceId);
    },
    //获取对应资源的列表
    async getShareDiscussionList(item) {
      this.currentShareResource = {
        id: item.id,
        name: item.name,
      };

      let id = item.id;
      this.currentResourceId = id;
      await this.getDiscussionById(id);
    },
    async getCourseName() {
      let res = await this.$request(
        `/admin/manager/course/get/${this.courseId}`,
        "",
        "get",
        "params",
        "json"
      );
      if (res && res.data.code === 20000) {
        this.courseName = res.data.data.course.courseName;
      }
    },
    async starResource() {
      let fileId;

      if (this.activeNames === "1") {
        fileId = this.files.PPTfileId;
      } else if (this.activeNames === "2") fileId = this.files.videofileId;
      console.log(fileId, "fileId");
      let res = await this.$request(
        `/educenter/file/save/${fileId}/${this.userId}`,
        "",
        "post",
        "params",
        "json"
      );
      console.log(res);
      if (res && res.data.code === 20000) {
        ElMessage.success("收藏成功！");
      }
    },
    async starShareFile(fileId) {
      let res = await this.$request(
        `/educenter/file/save/${fileId}/${this.userId}`,
        "",
        "post",
        "params",
        "json"
      );
      console.log(res);
      if (res && res.data.code === 20000) {
        ElMessage.success("收藏成功！");
      }
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
.button-wrapper {
  display: flex;
}
.fileicon {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-around;
}
.filelist {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.discuss-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
}
.card-hover:hover {
  background: #ecf5ff;
  cursor: pointer;
}
</style>