<template>
  <el-row style="height: 100%">
    <el-col :span="18" style="height: 100%">
      <div
        v-show="isTeacher"
        style="position: absolute; z-index: 1; margin: 5px 0 0 5px"
      >
        <el-button type="primary" plain v-if="!isEditMode" @click="goToEdit"
          >去编辑</el-button
        >
        <el-button type="success" plain v-else @click="quitEdit"
          >退出编辑</el-button
        >
      </div>
      <div style="display: flex; height: 100%">
        <div
          id="efContainer"
          ref="efContainer"
          class="container"
          v-if="easyFlowVisible"
          v-flowDrag
        >
          <template v-for="node in data.nodeList" :key="node.id">
            <flow-node
              :id="node.id"
              :node="node"
              :activeElement="activeElement"
              @clickNode="clickNode"
              @changeNodeSite="changeNodeSite"
              :isEditMode="isEditMode"
            >
            </flow-node>
          </template>
          <!-- 给画布一个默认的宽度和高度 -->
          <div style="position: absolute; top: 2000px; left: 1500px">
            &nbsp;
          </div>
        </div>
      </div>
    </el-col>
    <!-- 侧边编辑节点信息 -->
    <el-col :span="6" style="height: 100%">
      <div class="node-form-header" style="height: 5%">节点信息</div>
      <div class="node-form-body" v-show="isFormShow">
        <el-form :model="nodeinfo" ref="dataForm" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="nodeinfo.name" v-if="isTeacher"></el-input>
            <span v-else>{{ nodeinfo.name }}</span>
          </el-form-item>
          <el-form-item v-show="isTeacher">
            <el-button type="primary" @click="saveNodeInfo">保存</el-button>
            <el-button type="danger" @click="deleteDialogVisible = true"
              >删除</el-button
            >
          </el-form-item>
        </el-form>
        <!-- 这里插入delete的对话框 -->
        <el-dialog
          v-model="deleteDialogVisible"
          title="删除节点"
          width="20%"
          center
        >
          <span>确定删除吗,节点中的资源不可恢复</span>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="deleteDialogVisible = false">取消</el-button>
              <el-button type="danger" @click="deletenode">
                确认删除
              </el-button>
            </span>
          </template>
        </el-dialog>
        <div class="main-zone">
          <el-card
            shadow="never"
            class="exp-base"
            :body-style="{ height: '100%' }"
            ><div class="exp-header">
              <span style="font-size: 22px; font-weight: bold">实验要求</span>

              <el-button type="primary" @click="goToSpace"
                >进入实验空间</el-button
              >
            </div>
            <el-button
              link
              type="primary"
              v-show="isTeacher"
              @click="
                expRequirementDialogVisible = true;
                expRequirementInput = expRequirement;
              "
              >编辑</el-button
            >
            <el-button
              link
              type="primary"
              v-show="isTeacher"
              @click="openExpCreateDialog()"
              >创建实验作业</el-button
            >
            <p style="overflow: auto; height: 70%; font-size: 20px">
              {{ expRequirement }}
            </p>
            <!-- <p>1、学习实验手册上的知识点</p>
              <p>2、完成实验手册上的任务</p>
              <p>3、提交实验报告</p> -->
          </el-card>
          <!-- 实验要求 -->
          <el-dialog
            v-model="expRequirementDialogVisible"
            title="实验要求"
            width="30%"
          >
            <el-input
              v-model="expRequirementInput"
              :rows="4"
              type="textarea"
              placeholder="输入"
              :resize="'none'"
            />
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="expRequirementDialogVisible = false"
                  >取消</el-button
                >
                <el-button type="primary" @click="submitExpRequirement">
                  确定
                </el-button>
              </span>
            </template>
          </el-dialog>
          <el-card
            shadow="never"
            class="exp-res"
            :body-style="{ height: '100%' }"
            height="35%"
            ><div class="exp-header">
              <span style="font-size: 22px; font-weight: bold">实验资源</span>
              <!-- 资源上传 -->
              <el-upload
                style="display: inline-block; position: relative; bottom: 5px"
                class="upload-demo"
                :action="uploadNodeUrl"
                :on-success="handleSuccessNode"
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
            </div>
            <div
              style="height: 70%; overflow: auto"
              v-show="fileList.length !== 0"
            >
              <div class="filelist" v-for="item in fileList" :key="item.id">
                <div style="display: flex; align-items: center">
                  <img
                    style="width: 50px; height: 50px"
                    :src="getFileImage(item.name)"
                    alt=""
                  />

                  <span>{{ item.name }}</span>
                </div>
                <div class="fileicon">
                  <el-icon
                    size="20px"
                    v-show="isTeacher"
                    @click="deleteNodeResource(item)"
                    style="cursor: pointer"
                    ><Delete
                  /></el-icon>
                  <a :href="item.url"
                    ><el-icon size="20px" color=""><Download /></el-icon
                  ></a>
                  <el-icon style="cursor: pointer" @click="starResource(item)"
                    ><Star
                  /></el-icon>
                </div>
              </div></div
          ></el-card>
          <el-card shadow="never" class="exp-rate"
            ><div>
              <span style="font-size: 22px; font-weight: bold">实验评价</span>
            </div>
            <div style="display: flex; flex-direction: column; margin-top: 5px">
              <div>
                <span>当前{{ ratenum }}人评价：</span>
                <el-rate
                  v-model="readOnlyRate"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template=""
                />
              </div>
              <div v-show="!isTeacher">
                {{ !userdisable ? "去" : "已" }}评价：
                <el-rate
                  v-model="userrate"
                  :texts="['很简单', '简单', '中等', '难', '非常难']"
                  show-text
                  allow-half
                  @change="submitRate"
                  :disabled="userdisable"
                />
              </div></div
          ></el-card>
        </div>
      </div>
    </el-col>
    <el-dialog v-model="addDialogVisible" title="新增节点" width="20%">
      <el-radio-group v-model="radio" class="ml-4">
        <el-radio label="1" size="large">一般节点</el-radio>
        <el-radio label="2" size="large" v-show="mutiNodeVisible"
          >并行节点</el-radio
        >
      </el-radio-group>
      <!-- 多行节点的数量 -->
      <div v-show="mutiNodeNumInputVisible" class="mutiinput">
        <span>节点数量：</span>
        <el-input
          style="width: 60px"
          v-model.number="mutiNodeNumInput"
          placeholder="输入节点数量"
          type="number"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAddNewNode">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 布置实验作业的对话框 -->
    <el-dialog v-model="isExpCreateDiaglogVisble" title="创建作业" width="60%">
      <!-- 作业主体 -->
      <el-form :model="homeworkform" label-width="120px">
        <div class="addHomework">
          <el-form-item label="作业名:">
            <el-input v-model="homeworkform.name" />
          </el-form-item>
          <el-form-item label="开始时间:">
            <el-date-picker
              v-model="homeworkform.startTime"
              type="datetime"
              placeholder="选择开始时间"
              value-format="YYYY-MM-DD hh:mm:ss"
            />
          </el-form-item>
          <el-form-item label="截止时间:">
            <el-date-picker
              v-model="homeworkform.endTime"
              type="datetime"
              placeholder="选择截止时间"
              value-format="YYYY-MM-DD hh:mm:ss"
            />
          </el-form-item>
          <el-form-item label="作业要求">
            <el-input
              v-model="homeworkform.context"
              :rows="4"
              type="textarea"
              resize="none"
            />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isExpCreateDiaglogVisble = false">取消</el-button>
          <el-button type="primary" @click="addHomeWork"> 确认布置 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-row>
</template>

<script>
import pdfUrl from "/src/assets/img/pdf.png";
import pptUrl from "/src/assets/img/ppt.png";
import txtUrl from "/src/assets/img/txt.png";
import wordUrl from "/src/assets/img/word.png";
import zipUrl from "/src/assets/img/zip.png";
import unknownUrl from "/src/assets/img/unknown.png";
import { jsPlumb } from "jsplumb";
import flowNode from "./utilCom/node.vue";
import { ElMessage } from "element-plus";
export default {
  directives: {
    flowDrag: {
      mounted: (el, binding, vnode, oldNode) => {
        if (!binding) {
          return;
        }
        el.onmousedown = (e) => {
          console.log(123);
          if (e.button == 2) {
            // 右键不管

            return;
          }
          //  鼠标按下，计算当前原始距离可视区的高度
          let disX = e.clientX;
          let disY = e.clientY;
          el.style.cursor = "move";

          document.onmousemove = function (e) {
            // 移动时禁止默认事件
            e.preventDefault();
            const left = e.clientX - disX;
            disX = e.clientX;
            el.scrollLeft += -left;

            const top = e.clientY - disY;
            disY = e.clientY;
            el.scrollTop += -top;
          };

          document.onmouseup = function (e) {
            el.style.cursor = "auto";
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      },
    },
  },
  data() {
    return {
      isNodeHomeworkExist: false,
      ratenum: 1,
      deleteDialogVisible: false,
      userdisable: false,
      expRequirementDialogVisible: false,
      expRequirementInput: "",
      expRequirement: "",
      //节点文件列表
      fileList: [],
      isEditMode: false,
      //jsPlumb的实例
      jsPlumb: null,
      //流程图数据
      addDialogVisible: false,
      //控制画布销毁
      easyFlowVisible: true,
      data: {},
      //控制右侧表单是否出现
      isFormShow: false,
      //初始化节点
      initNodeList: [
        {
          id: "1",
          name: "Start",
          left: "5vw",
          top: "35vh",
          type: 0,
        },
        {
          id: "2",
          name: "End",
          left: "15vw",
          top: "35vh",
          type: 5,
        },
      ],
      initLineList: [
        {
          from: "1",
          to: "2",
          type: 0,
        },
      ],
      //分支表
      branchList: [],
      node: {
        id: "123",
        name: "开始节点",
        left: "5vw",
        top: "35vh",
        ico: "",
        state: "success",
      },
      activeElement: {
        // 可选值 node 、line
        type: undefined,
        // 节点ID
        nodeId: undefined,
        // 连线ID
        sourceId: undefined,
        targetId: undefined,
      },
      userrate: 1,
      readOnlyRate: 3.5,
      //节点分类，1是一般节点，2是并行节点
      radio: "1",
      mutiNodeVisible: true,
      mutiNodeNumInputVisible: false,
      mutiNodeNumInput: 2,
      tmpsourceId: "",
      tmptargetId: "",
      scroll: {
        left: 0,
        top: 0,
      },
      nodeinfo: {
        id: "",
        name: "",
      },
      monidata: {
        lineList: [
          {
            from: "1",
            to: "3",
            type: 0,
          },
          {
            from: "3",
            to: "10",
            type: 0,
          },
          {
            from: "10",
            to: "4",
            type: 0,
          },
          {
            from: "4",
            to: "8",
            type: 1,
          },
          {
            from: "8",
            to: "9",
            type: 2,
          },
          {
            from: "4",
            to: "7",
            type: 1,
          },
          {
            from: "7",
            to: "9",
            type: 2,
          },
          {
            from: "9",
            to: "2",
            type: 0,
          },
          {
            from: "4",
            to: "6",
            type: 1,
          },
          {
            from: "6",
            to: "9",
            type: 2,
          },
          {
            from: "4",
            to: "5",
            type: 1,
          },
          {
            from: "5",
            to: "9",
            type: 2,
          },
        ],
        nodeList: [
          {
            id: "1",
            name: "Start",
            left: "16px",
            top: "371px",
            type: 0,
          },
          {
            id: "3",
            name: "基本实验1-初识Linux",
            left: "172px",
            top: "359px",
            type: 1,
          },
          {
            id: "10",
            name: "基本实验2-Linux常用命令",
            left: "441px",
            top: "355px",
            type: 1,
          },
          {
            id: "4",
            name: "综合实验1-内存管理",
            left: "704px",
            top: "377px",
            type: 2,
          },
          {
            id: "5",
            name: "综合实验2-中断与异常",
            left: "886px",
            top: "141px",
            type: 3,
          },
          {
            id: "6",
            name: "综合实验3-内核时间管理",
            left: "886px",
            top: "350px",
            type: 3,
          },
          {
            id: "7",
            name: "综合实验4-设备管理",
            left: "883px",
            top: "489px",
            type: 3,
          },
          {
            id: "8",
            name: "综合实验5-文件系统",
            left: "862px",
            top: "701px",
            type: 3,
          },
          {
            id: "9",
            name: "",
            left: "1232px",
            top: "368px",
            type: 4,
          },
          {
            id: "2",
            name: "End",
            left: "1368px",
            top: "359px",
            type: 5,
          },
        ],
        branchList: [
          {
            branchid: "4",
            toid: "5",
            length: 1,
          },
          {
            branchid: "4",
            toid: "6",
            length: 1,
          },
          {
            branchid: "4",
            toid: "7",
            length: 1,
          },
          {
            branchid: "4",
            toid: "8",
            length: 1,
          },
        ],
      },
      isExpCreateDiaglogVisble: false,
      isNodeHasHomework: false,
      homeworkform: {
        name: "",
        startTime: "",
        endTime: "",
        context: "",
      },
    };
  },
  components: {
    flowNode,
  },
  watch: {
    //控制对话框里的多项节点输入框是否出现
    radio(newValue) {
      if (newValue === "2") this.mutiNodeNumInputVisible = true;
      else this.mutiNodeNumInputVisible = false;
    },
  },
  computed: {
    nodeList() {
      return this.initNodeList;
    },
    maxid() {
      return this.data.nodeList.length;
    },
    isTeacher() {
      return this.$store.state.isTeacher;
    },
    uploadNodeUrl() {
      return `http://60.204.141.214:30900/exp/flowchart/node/resource/upload/${this.$route.params.courseId}/${this.activeElement.nodeId}`;
    },
    expId() {
      return this.$route.params.expId;
    },
    userId() {
      return this.$store.state.userInfo.id;
    },
    stateId() {
      return this.$store.state.stateId;
    },
  },

  created() {
    // this.data = {
    //   nodeList: JSON.parse(JSON.stringify(this.initNodeList)),
    //   lineList: JSON.parse(JSON.stringify(this.initLineList)),
    // };
  },
  async mounted() {
    // this.data = {
    //   nodeList: JSON.parse(JSON.stringify(this.monidata.nodeList)),
    //   lineList: JSON.parse(JSON.stringify(this.monidata.lineList)),
    // };
    // this.branchList = JSON.parse(JSON.stringify(this.monidata.branchList));
    //初始化节点
    let isNodeExist = await this.getAllNode();
    if (isNodeExist) {
      await this.getAllLine();
    } else {
      await this.initNodeAndLine();
    }
    console.log(this.data.nodeList);
    this.getBranchList();
    this.$nextTick(() => {
      this.dataReload();
    });
    //开启监听浏览器的缩放，适应不同的尺寸的屏幕
    window.addEventListener("resize", () => {
      this.jsPlumb.repaintEverything();
    });
  },
  methods: {
    //#region实验评价
    async getStuNodeInfo() {
      let res = await this.$request(
        `/exp/flowchart/node/detail/${this.activeElement.nodeId}/${this.stateId}`,
        "",
        "get",
        "params",
        "json"
      );
      if (res && res.data.code === 20000) {
        if (res.data.data.nodeDetail.difficulty) {
          this.userrate = res.data.data.nodeDetail.difficulty / 10;
          this.userdisable = true;
        }
      }
    },
    async getNodeRate(node) {
      let res = await this.$request(
        `/exp/flowchart/node/diff-avg/${node.id}`,
        "",
        "get",
        "params",
        "json"
      );
      if (res && res.data.code === 20000) {
        this.ratenum = res.data.data.count;
        this.readOnlyRate = res.data.data.avg / 10;
      }
      console.log(res, "rate");
    },

    //#endregion
    //收藏文件
    async starResource(file) {
      let res = await this.$request(
        `/educenter/file/save/${file.id}/${this.userId}`,
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
    //#region 关于节点的联调
    //如果不存在节点，就初始化节点
    async initNodeAndLine() {
      let startnode = this.initNodeList[0];
      let endnode = this.initNodeList[1];
      let conline = this.initLineList[0];
      startnode.id = this.getRandomId();
      endnode.id = this.getRandomId();
      conline.id = this.getRandomId();
      conline.from = startnode.id;
      conline.to = endnode.id;
      let start = await this.addOneNode(startnode);
      let end = await this.addOneNode(endnode);
      let con = await this.addOneLine(conline);
      if (start && end && con) {
        ElMessage.success("初始化成功！");
        this.data = {
          nodeList: JSON.parse(JSON.stringify(this.initNodeList)),
          lineList: JSON.parse(JSON.stringify(this.initLineList)),
        };
      } else ElMessage.error("初始化节点失败！");
    },
    //添加一条连线
    async addOneLine(line) {
      let params = {
        experimentId: this.expId,
        id: line.id,
        fromNodeId: line.from,
        toNodeId: line.to,
        name: "",
        type: line.type,
      };
      let res = await this.$request(
        "/exp/flowchart/line",
        params,
        "post",
        "params",
        "json"
      );
      console.log("添加连线", res);
      if (res && res.data.code === 20000) {
        return true;
      }
      return false;
    },
    //添加一个节点
    async addOneNode(node) {
      let params = {
        experimentId: this.expId,
        id: node.id,
        name: node.name,
        type: node.type,
        left: node.left,
        top: node.top,
      };
      let res = await this.$request(
        "/exp/flowchart/node",
        params,
        "post",
        "params",
        "json"
      );
      console.log("添加节点", res);
      if (res && res.data.code === 20000) {
        await this.initNodeBasic(node.id);

        return true;
      }
      return false;
    },
    //创建实验作业
    async createExpHomework() {
      let params = {
        nodeId: this.activeElement.nodeId,
        beginTime: this.homeworkform.startTime,
        endTime: this.homeworkform.endTime,
        pname: this.homeworkform.name,
        teacherId: this.stateId,
        courseId: this.$route.params.courseId,
      };
      const defaulthomeworks = [
        {
          context: this.homeworkform.context,
          refAnswer: "",
        },
      ];

      let res = await this.$request(
        `/manager/course-homework/save?nodeId=${params.nodeId}&beginTime=${params.beginTime}&courseId=${this.$route.params.courseId}&endTime=${params.endTime}&name=${params.pname}&teacherId=${this.stateId}`,
        defaulthomeworks,
        "post",
        "params",
        "json"
      );
      if (res && res.data.code === 20000) {
        ElMessage.success("节点作业创建成功！");
      } else {
        ElMessage.error("节点作业创建失败，请稍后重试！");
      }
    },
    //确认创建作业
    async addHomeWork() {
      await this.createExpHomework();
      for (let key in this.homeworkform) {
        this.homeworkform[key] = "";
      }
      this.isExpCreateDiaglogVisble = false;
    },
    //获取当前的日期
    getCurDate() {
      let date = new Date();
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString().padStart(2, "0");
      let day = date.getDate().toString().padStart(2, "0");
      let hour = date.getHours().toString().padStart(2, "0");
      let min = date.getMinutes().toString().padStart(2, "0");
      let sec = date.getSeconds().toString().padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
    },
    //打开创建实验的窗口
    openExpCreateDialog() {
      if (!this.isNodeHomeworkExist) {
        this.homeworkform.name = this.nodeinfo.name;
        let str = this.getCurDate();
        this.homeworkform.startTime = str;

        this.isExpCreateDiaglogVisble = true;
      } else {
        ElMessage.warning("该节点的作业已经存在！");
      }
    },
    //查询某个节点的作业
    async getNodeHomework() {
      let res = await this.$request(
        `/manager/course-homework/get-hmwk-id/${this.nodeinfo.id}`,
        "",
        "get",
        "params",
        "json"
      );
      console.log(1, res);
      if (res && res.data.code === 20000) {
        console.log(res.data.data.homework);
        if (res.data.data.homework) this.isNodeHomeworkExist = true;
        else this.isNodeHomeworkExist = false;
      }
    },
    //删除一条连线
    async deleteOneLine(lineId) {
      let params = {
        lineid: lineId,
      };
      let res = await this.$request(
        `/exp/flowchart/line`,
        params,
        "delete",
        "params",
        "json"
      );
      console.log("删除连线", res);
    },
    //删除一个节点
    async deleteOneNode(nodeId) {
      let params = {
        nodeid: nodeId,
      };
      let res = await this.$request(
        `/exp/flowchart/node`,
        params,
        "delete",
        "params",
        "json"
      );
      console.log("删除节点", res);
    },

    //更改一条连线
    putOneLine() {},
    //更改一个节点
    async putOneNode(node) {
      let params = {
        top: node.top,
        left: node.left,
      };
      let res = await this.$request(
        `/exp/flowchart/node/${node.id}`,
        params,
        "put",
        "params",
        "json"
      );
    },
    //查询所有连线
    async getAllLine() {
      let res = await this.$request(
        `/exp/flowchart/line/list/${this.expId}`,
        "",
        "get",
        "params",
        "json"
      );
      console.log("所有连线", res);
      if (res && res.data.code === 20000) {
        this.data.lineList = res.data.data.list.map((item) => {
          return {
            from: item.fromNodeId,
            to: item.toNodeId,
            id: item.id,
            type: item.type,
          };
        });
        return true;
      }
    },
    //查询所有节点
    async getAllNode() {
      let res = await this.$request(
        `/exp/flowchart/node/list/${this.expId}`,
        "",
        "get",
        "params",
        "json"
      );
      console.log("所有节点", res);
      if (res && res.data.code === 20000) {
        if (res.data.data.list.length === 0) return false;
        else {
          this.data.nodeList = res.data.data.list;
          return true;
        }
      } else return false;
    },
    //生成Id随机数
    getRandomId() {
      return (
        this.expId.substring(15, 19) +
        (Math.floor(Math.random() * 90000) + 10000)
      );
    },
    //找到链接某个节点的下一个节点
    findToNode(nodeid) {
      let toNodeId = this.data.lineList.find((item) => item.from === nodeid).to;
      let toNode = this.data.nodeList.find((item) => item.id === toNodeId);
      return toNode;
    },
    //找到某个节点后面的所有节点,返回包含该节点的列表
    findAllAfterNodes(nodeid) {
      let resultlist = [];
      let node = this.data.nodeList.find((item) => item.id === nodeid);
      while (1) {
        if (node.type === 0 || node.type === 1 || node.type === 4) {
          resultlist.push(node);
          node = this.findToNode(node.id);
        } else if (node.type === 2) {
          resultlist.push(node);
          let paraNodeList = this.data.lineList
            .filter((item) => item.from === node.id)
            .map((item) =>
              this.data.nodeList.find((item2) => item2.id === item.to)
            );
          resultlist.push(...paraNodeList);
          node = this.findToNode(paraNodeList[0].id);
        } else {
          resultlist.push(node);
          break;
        }
      }
      resultlist = JSON.parse(JSON.stringify(resultlist));
      console.log("resultlist", resultlist);
      return resultlist;
    },
    //查询分支节点以及其关联的节点
    async findBranchNodes() {
      let branchnodeIds = this.data.nodeList
        .filter((item) => item.type === 2)
        .map((item) => item.id);
      for (let i = 0; i < branchnodeIds.length; ++i) {
        let res = await this.$request(
          `/exp/flowchart/node/branch/${branchnodeIds[i]}`,
          "",
          "get",
          "params",
          "json"
        );
        if (res && res.data.code === 20000) {
          console.log(res, i, "分支节点");
        }
      }
    },
    //根据节点和连线表生成分支节点表
    getBranchList() {
      let branchnodeIds = this.data.nodeList
        .filter((item) => item.type === 2)
        .map((item) => item.id);
      for (let i = 0; i < branchnodeIds.length; ++i) {
        let arr = this.data.lineList
          .filter((item) => item.from === branchnodeIds[i])
          .map((item) => {
            return {
              branchid: branchnodeIds[i],
              toid: item.to,
              length: 1,
            };
          });
        this.branchList.push(...arr);
      }
      this.branchList = JSON.parse(JSON.stringify(this.branchList));
    },
    //#endregion
    //#region 单个节点的资源操作
    async getNodeInfo(nodeId) {
      let res = await this.$request(
        `/exp/flowchart/node/${nodeId}`,
        "",
        "get",
        "params",
        "json"
      );
      if (res && res.data.code === 20000) {
        console.log(res);
      }
    },
    async putNodeInfo(node) {
      let res = await this.$request(
        `/exp/flowchart/node/${node.id}`,
        node,
        "put",
        "params",
        "json"
      );
      console.log(res, "修改节点信息");
    },
    //#endregion
    //提交评价
    async submitRate() {
      console.log(this.userrate);
      let res = await this.$request(
        `/exp/flowchart/node/detail/diff/${this.activeElement.nodeId}/${
          this.stateId
        }?difficulty=${this.userrate * 10}`,
        "",
        "put",
        "params",
        "json"
      );
      if (res && res.data.code === 20000) {
        console.log("评价反馈", res);
        ElMessage.success("评价成功！");
        this.readOnlyRate = this.userrate;
        this.userdisable = true;
        this.ratenum += 1;
      }
    },
    //删除节点资源
    async deleteNodeResource(file) {
      let arr = [];
      arr.push(file.id);
      let res = await this.$request(
        `/eduoss/fileoss/removeAlyVideo/${file.memId}?idList=${arr}`,
        "",
        "delete"
      );
      if (res && res.data.code === 20000) {
        ElMessage.success("删除成功");
        this.getNodeResource();
      }
    },
    //为对象添加上experimentId属性
    addExperimentIdInObject(object) {
      object.experimentId = this.expId;
    },
    //添加一个节点
    async addNewNode(node) {
      this.addExperimentIdInObject(node);
      console.log(node);
      let res = await this.$request(
        `/exp/flowchart/node`,
        node,
        "post",
        "params",
        "json"
      );
      if (res && res.data.code === 20000) {
        return true;
      } else {
        return false;
      }
    },
    async initNodeBasic(nodeId) {
      let res = await this.$request(
        `/exp/flowchart/node/init/${nodeId}`,
        "",
        "get",
        "params",
        "json"
      );
      console.log(res, "init");
      if (res && res.data.code === 20000) {
      }
    },
    //上传节点资源的回调
    async handleSuccessNode(res) {
      if (res && res.code === 20000) {
        ElMessage.success("上传成功!");
        await this.getNodeResource();
      } else ElMessage.success("上传失败，请稍后重试");
    },
    handleprogress(p) {
      console.log(p);
    },
    handleErr(err) {
      console.log(err);
      ElMessage.success("上传失败，请稍后重试");
    },
    //获得该节点的资源
    async getNodeResource() {
      let res = await this.$request(
        `/exp/flowchart/node/resource/${this.activeElement.nodeId}`,
        "",
        "get",
        "params",
        "json"
      );
      console.log(res, "节点资源");
      if (res && res.data.code === 20000) {
        this.fileList = res.data.data.files.map((item) => {
          return {
            id: item.id,
            url: item.url,
            name: item.name + "." + item.type,
            memId: item.memId,
          };
        });
      }
    },
    async submitExpRequirement() {
      let node = {
        id: this.activeElement.nodeId,
        requirement: this.expRequirementInput,
      };
      await this.putNodeInfo(node);
      this.expRequirement = this.expRequirementInput;
      this.expRequirementDialogVisible = false;
      ElMessage.success("更新成功！");
    },
    //进入实验空间
    goToSpace() {
      this.$router.push({ path: `/experimentspace/${this.nodeinfo.id}` });
    },
    jsPlumbInit() {
      this.jsPlumb.ready(() => {
        // 会使整个jsPlumb立即重绘。
        this.jsPlumb.setSuspendDrawing(false, true);
        // 初始化节点
        this.loadEasyFlow();
        this.jsPlumb.setContainer(this.$refs.efContainer);
      });
    },
    // 改变节点的位置
    async changeNodeSite(data) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i];
        if (node.id === data.nodeId) {
          node.left = data.left;
          node.top = data.top;
        }
      }
      await this.putOneNode({
        top: data.top,
        left: data.left,
        id: data.nodeId,
      });
    },
    //加载节点Stra
    loadEasyFlow() {
      // 初始化节点
      if (this.isTeacher && this.isEditMode) {
        for (var i = 0; i < this.data.nodeList.length; i++) {
          let node = this.data.nodeList[i];
          this.jsPlumb.draggable(node.id, {
            containment: "parent",
            stop: function (el) {
              // 拖拽节点结束后的对调
            },
          });
        }
      }
      // 初始化连线
      for (var i = 0; i < this.data.lineList.length; i++) {
        let line = this.data.lineList[i];
        let linetype = line.type === 0 ? "Straight" : "Bezier";
        let location = line.type === 0 ? 0.5 : line.type === 1 ? 0.8 : 0.2;
        let overlayvisible = this.isEditMode
          ? line.type === 0
            ? true
            : false
          : false;
        var connParam = {
          source: line.from,
          target: line.to,
          connector: [linetype],
          anchor: ["Left", "Right"],
          endpoint: "Blank",
          overlays: [
            ["Arrow", { width: 12, length: 12, location: 1 }],
            [
              "Label",
              {
                location: location,
                label: "+",
                id: "label",
                cssClass: "flowLabel",
                events: {
                  click: (labelOverlay, originalEvent) => {
                    this.tmpsourceId =
                      labelOverlay.canvas._jsPlumb._jsPlumb.component.sourceId;

                    this.tmptargetId =
                      labelOverlay.canvas._jsPlumb._jsPlumb.component.targetId;
                    //判断是否是并行节点中添加元素
                    let targetnode = this.data.nodeList.find(
                      (item) => item.id === this.tmptargetId
                    );
                    if (targetnode.type === 3 || targetnode.type === 4) {
                      this.radio = "1";
                      this.mutiNodeVisible = false;
                    } else {
                      this.mutiNodeVisible = true;
                    }

                    this.addDialogVisible = true;
                  },
                },
              },
            ],
          ],
        };

        let connection = this.jsPlumb.connect(connParam);
        var overlay = connection.getOverlay("label");
        overlay.setVisible(overlayvisible);
      }

      //使滚动条始终保持在渲染的位置
      this.$refs.efContainer.scrollLeft = this.scroll.left;
      this.$refs.efContainer.scrollTop = this.scroll.top;
    },
    dataReload() {
      this.easyFlowVisible = false;
      this.$nextTick(() => {
        this.easyFlowVisible = true;
        this.$nextTick(() => {
          this.jsPlumb = jsPlumb.getInstance();
          this.$nextTick(() => {
            this.jsPlumbInit();
          });
        });
      });
      console.log("数据", this.data, this.branchList);
    },
    //确定提交新增节点
    async confirmAddNewNode() {
      let efContainer = this.$refs.efContainer;
      this.scroll.left = efContainer.scrollLeft;
      this.scroll.top = efContainer.scrollTop;
      //普通节点
      if (this.radio === "1") {
        if (!this.mutiNodeVisible) {
          //添加分支中的新节点
          this.addBranchNode();
        } else {
          //找到在数组中对应的位置
          let sourceIndex = this.data.nodeList.findIndex(
            (item) => item.id === this.tmpsourceId
          );
          //修改原来元素的位置
          let toNode = this.findToNode(this.tmpsourceId);
          let leftpostion = toNode.left;
          let afterList = this.findAllAfterNodes(this.tmptargetId);

          for (let i = 0; i < afterList.length; ++i) {
            let pnodeIndex = this.data.nodeList.findIndex(
              (item) => item.id === afterList[i].id
            );
            this.data.nodeList[pnodeIndex].left =
              "calc(" + this.data.nodeList[pnodeIndex].left + " + 14vw)";
            this.putOneNode(this.data.nodeList[pnodeIndex]);
          }
          //插入新节点
          let newid = this.getRandomId();
          this.data.nodeList.splice(sourceIndex + 1, 0, {
            id: newid,
            name: "新节点",
            left: leftpostion,
            top: "34.5vh",
            type: 1,
          });
          this.addOneNode({
            id: newid,
            name: "新节点",
            left: leftpostion,
            top: "34.5vh",
            type: 1,
          });
          //重新连线
          let lineIndex = this.data.lineList.findIndex(
            (item) =>
              item.from === this.tmpsourceId && item.to === this.tmptargetId
          );
          this.deleteOneLine(this.data.lineList[lineIndex].id);
          let lineId1 = this.getRandomId();
          let lineId2 = this.getRandomId();
          this.addOneLine({
            id: lineId1,
            from: this.tmpsourceId,
            to: newid,
            type: 0,
          });
          this.addOneLine({
            id: lineId2,
            from: newid,
            to: this.tmptargetId,
            type: 0,
          });
          //删除旧连线，形成新连线
          this.data.lineList.splice(
            lineIndex,
            1,
            {
              id: lineId1,
              from: this.tmpsourceId,
              to: newid,
              type: 0,
            },
            {
              id: lineId2,
              from: newid,
              to: this.tmptargetId,
              type: 0,
            }
          );

          //删除连线
          let conn = this.jsPlumb.getConnections({
            source: this.tmpsourceId,
            target: this.tmptargetId,
          })[0];
          this.jsPlumb.deleteConnection(conn);

          //重新渲染
          this.dataReload();
        }
      }
      //并行节点
      else {
        //找到在数组中对应的位置
        let sourceIndex = this.data.nodeList.findIndex(
          (item) => item.id === this.tmpsourceId
        );
        //修改原来节点的位置
        let toNode = this.findToNode(this.tmpsourceId);
        let leftpostion = toNode.left;
        let afterList = this.findAllAfterNodes(this.tmptargetId);
        for (let i = 0; i < afterList.length; ++i) {
          let pnodeIndex = this.data.nodeList.findIndex(
            (item) => item.id === afterList[i].id
          );
          this.data.nodeList[pnodeIndex].left =
            "calc(" + this.data.nodeList[pnodeIndex].left + " + 30vw)";
          this.putOneNode(this.data.nodeList[pnodeIndex]);
        }
        //添加分支开始节点
        let branchstartid = this.getRandomId();
        let newid = branchstartid;
        this.addOneNode({
          id: newid,
          name: "",
          left: leftpostion,
          top: "36.5vh",
          type: 2,
        });
        this.data.nodeList.splice(sourceIndex + 1, 0, {
          id: newid,
          name: "",
          left: leftpostion,
          top: "36.5vh",
          type: 2,
        });
        //添加并行节点
        let topposition;
        let paranodeId = [];
        for (let i = 0; i < this.mutiNodeNumInput; i++) {
          paranodeId[i] = this.getRandomId();
        }
        if (this.mutiNodeNumInput % 2 === 0)
          topposition = 35 - (this.mutiNodeNumInput / 2) * 5 + "vh";
        else topposition = 35 - ((this.mutiNodeNumInput - 1) / 2) * 5 + "vh";
        for (let i = 0; i < this.mutiNodeNumInput; i++) {
          let nodeid = paranodeId[i];
          this.addOneNode({
            id: nodeid,
            name: "新节点",
            left: "calc(" + leftpostion + " + 10vw)",
            top: "calc(" + topposition + " + " + 10 * i + "vh)",
            type: 3,
          });
          this.data.nodeList.splice(sourceIndex, 0, {
            id: nodeid,
            name: "新节点",
            left: "calc(" + leftpostion + " + 10vw)",
            top: "calc(" + topposition + " + " + 10 * i + "vh)",
            type: 3,
          });
          this.branchList.push({
            branchid: branchstartid,
            toid: nodeid,
            length: 1,
          });
        }

        //添加分支结束节点
        let branchendid = this.getRandomId();
        this.addOneNode({
          id: branchendid,
          name: "",
          left: "calc(" + leftpostion + " + 25vw)",
          top: "36.5vh",
          type: 4,
        });
        this.data.nodeList.splice(sourceIndex, 0, {
          id: branchendid,
          name: "",
          left: "calc(" + leftpostion + " + 25vw)",
          top: "36.5vh",
          type: 4,
        });

        //重新连线
        let lineIndex = this.data.lineList.findIndex(
          (item) =>
            item.from === this.tmpsourceId && item.to === this.tmptargetId
        );
        //删除旧连线，形成新连线
        //1)源节点到分支开始节点
        this.deleteOneLine(this.data.lineList[lineIndex].id);
        let lineid = this.getRandomId();
        this.addOneLine({
          id: lineid,
          from: this.tmpsourceId,
          to: branchstartid,
          type: 0,
        });
        this.data.lineList.splice(lineIndex, 1, {
          id: lineid,
          from: this.tmpsourceId,
          to: branchstartid,
          type: 0,
        });
        //2)分支开始节点到并行节点
        for (let i = 0; i < this.mutiNodeNumInput; ++i) {
          let lineid1 = this.getRandomId();
          let lineid2 = this.getRandomId();
          this.data.lineList.splice(
            lineIndex,
            0,
            {
              id: lineid1,
              from: branchstartid,
              to: paranodeId[i],
              type: 1,
            },
            {
              id: lineid2,
              from: paranodeId[i],
              to: branchendid,
              type: 2,
            }
          );
          this.addOneLine({
            id: lineid1,
            from: branchstartid,
            to: paranodeId[i],
            type: 1,
          });
          this.addOneLine({
            id: lineid2,
            from: paranodeId[i],
            to: branchendid,
            type: 2,
          });
        }
        //3)从分支结束节点到下一个节点
        let lineid3 = this.getRandomId();

        this.data.lineList.splice(lineIndex, 0, {
          id: lineid3,
          from: branchendid,
          to: this.tmptargetId,
          type: 0,
        });
        this.addOneLine({
          id: lineid3,
          from: branchendid,
          to: this.tmptargetId,
          type: 0,
        });
        //删除连线
        let conn = this.jsPlumb.getConnections({
          source: this.tmpsourceId,
          target: this.tmptargetId,
        })[0];
        this.jsPlumb.deleteConnection(conn);
        //重新渲染
        this.dataReload();
      }

      this.addDialogVisible = false;
    },
    //处理分支上的节点添加
    addBranchNode() {
      //向前寻找分支开始节点
      let fromid = this.tmpsourceId;
      let toid = this.tmptargetId;
      let fromnode = this.data.nodeList.find((item) => item.id === fromid);
      //找到分支开始节点索引
      let fromnodeIndex = this.data.nodeList.findIndex(
        (item) => item.id === fromid
      );
      let sourceIndex = fromnodeIndex;
      while (this.data.nodeList[fromnodeIndex].type !== 2) {
        fromnodeIndex -= 1;
      }
      //找到分支结束节点索引

      let tonodeIndex = this.data.nodeList.findIndex(
        (item) => item.id === this.tmptargetId
      );
      let targetIndex = tonodeIndex;
      while (this.data.nodeList[tonodeIndex].type !== 4) {
        tonodeIndex += 1;
      }

      //从分支表中筛选出对应的数组,并找到最多元素的那条线
      let fromnodebranchlist = this.branchList.filter((item) => {
        return item.branchid === this.data.nodeList[fromnodeIndex].id;
      });

      fromnodebranchlist.sort((a, b) => b.length - a.length);
      //找到要添加元素的分支

      let branchIndex;
      if (this.data.nodeList.find((item) => item.id === fromid).type !== 2) {
        branchIndex = fromnodebranchlist.findIndex(
          (item) => item.toid === fromid
        );
        //分类

        while (branchIndex === -1) {
          fromid = this.data.lineList.find((item) => item.to === fromid).from;
          branchIndex = fromnodebranchlist.findIndex(
            (item) => item.toid === fromid
          );
        }
      } else {
        branchIndex = fromnodebranchlist.findIndex(
          (item) => item.toid === toid
        );
      }

      let toppostion;
      if (this.data.nodeList[sourceIndex].type === 3)
        toppostion = this.data.nodeList[sourceIndex].top;
      else if (this.data.nodeList[targetIndex].type === 3)
        toppostion = this.data.nodeList[targetIndex].top;
      //to节点后面的节点向后移动
      let nodeid = this.tmptargetId;

      let node = this.data.nodeList.find((item) => item.id === nodeid);
      while (node.type !== 4) {
        node.left = "calc(" + node.left + " + 10vw)";
        nodeid = this.data.lineList.find((item) => item.from === nodeid).to;
        node = this.data.nodeList.find((item) => item.id === nodeid);
      }
      //插入新节点

      let newid = this.maxid + 1;
      this.data.nodeList.splice(sourceIndex + 1, 0, {
        id: String(newid),
        name: "新节点",
        left: "calc(" + this.data.nodeList[sourceIndex].left + " + 10vw)",
        top: toppostion,
        type: 3,
      });

      //重新连线
      let lineIndex = this.data.lineList.findIndex(
        (item) => item.from === this.tmpsourceId && item.to === this.tmptargetId
      );
      let line = this.data.lineList.find(
        (item) => item.from === this.tmpsourceId && item.to === this.tmptargetId
      );
      let firstnewlinetype = 0,
        secondnewlinetype = 0;
      if (line.type === 1) {
        firstnewlinetype = 1;
        secondnewlinetype = 0;
      } else if (line.type === 2) {
        firstnewlinetype = 0;
        secondnewlinetype = 2;
      }
      //删除旧连线，形成新连线
      this.data.lineList.splice(
        lineIndex,
        1,
        {
          from: this.tmpsourceId,
          to: String(newid),
          type: firstnewlinetype,
        },
        {
          from: String(newid),
          to: this.tmptargetId,
          type: secondnewlinetype,
        }
      );

      //删除连线
      let conn = this.jsPlumb.getConnections({
        source: this.tmpsourceId,
        target: this.tmptargetId,
      })[0];
      this.jsPlumb.deleteConnection(conn);
      //当要添加的是分支上最多的节点,整体元素向后移动

      if (
        fromnodebranchlist[branchIndex].length + 1 >
        fromnodebranchlist[0].length
      ) {
        //修改后续的元素的位置

        for (let i = tonodeIndex + 1; i < this.data.nodeList.length; ++i) {
          this.data.nodeList[i].left =
            "calc(" + this.data.nodeList[i].left + " + 10vw)";
        }
      }
      //修改分支表
      let index = this.branchList.findIndex(
        (item) => item === fromnodebranchlist[branchIndex]
      );
      this.branchList[index].length += 1;
      if (
        this.data.nodeList.find((item) => item.id === this.tmpsourceId).type ===
        2
      ) {
        this.branchList[index].toid = String(newid);
      }

      //重新渲染

      this.dataReload();
    },
    async clickNode(node) {
      if (node.type === 1 || node.type === 3) {
        this.activeElement.type = "node";
        this.activeElement.nodeId = node.id;
        this.nodeinfo.id = node.id;
        this.nodeinfo.name = node.name;
        this.expRequirement = node.requirement;
      }
      this.isFormShow = true;
      if (!this.isTeacher) {
        await this.getStuNodeInfo();
      }
      this.getNodeRate(node);

      this.getNodeResource();
      this.getNodeHomework();
    },
    //保存信息
    saveNodeInfo() {
      let index = this.data.nodeList.findIndex(
        (item) => item.id === this.activeElement.nodeId
      );
      this.data.nodeList[index].name = this.nodeinfo.name;
      this.putNodeInfo(this.data.nodeList[index]);
      this.jsPlumb.repaintEverything();
      ElMessage.success("修改成功！");
    },
    //删除节点
    async deletenode() {
      let efContainer = this.$refs.efContainer;
      this.scroll.left = efContainer.scrollLeft;
      this.scroll.top = efContainer.scrollTop;
      let id = this.activeElement.nodeId;
      let branchendnodeid, branchstartnodeid;
      //1)操作对应的表，包括更新node节点、更新连线表、分支表
      let node = this.data.nodeList.find((item) => item.id === id);
      let nodeIndex = this.data.nodeList.findIndex((item) => item.id === id);

      /*
      并行节点的删除：
      1、判断是不是并行节点的删除
      2、删除后要调整分支表，while链式寻找
      3、当一条线路上只有一个节点需要删除这条线路
      */
      let isSingleNode = false;
      let isBranchExist = true;
      if (node.type === 3) {
        //链式寻找对应的线路
        let tmpid = node.id;
        let branchIndex = this.branchList.findIndex(
          (item) => item.toid === tmpid
        );
        while (branchIndex === -1) {
          tmpid = this.data.lineList.find((item) => item.to === tmpid).from;
          branchIndex = this.branchList.findIndex(
            (item) => item.toid === tmpid
          );
        }
        //找到分支开始节点
        branchstartnodeid = this.branchList[branchIndex].branchid;
        //找到分支结束节点
        // let tmpIndex = this.data.nodeList.findIndex(
        //   (item) => item.id === node.id
        // );
        // while (this.data.nodeList[tmpIndex].type !== 4) tmpIndex++;
        branchendnodeid = this.findToNode(node.id).id;

        this.branchList[branchIndex].length -= 1;
        if (this.branchList[branchIndex].toid === node.id) {
          this.branchList[branchIndex].toid = this.data.lineList.find(
            (item) => item.from === node.id
          ).to;
        }
        //如果length变为0，就删掉这条分支
        if (this.branchList[branchIndex].length === 0) {
          this.branchList.splice(branchIndex, 1);
          isSingleNode = true;
        }

        if (
          this.branchList.findIndex(
            (item) => item.branchid === branchstartnodeid
          ) === -1
        )
          isBranchExist = false;
      }

      //删除节点表中对应id的元素
      await this.deleteOneNode(this.data.nodeList[nodeIndex].id);
      this.data.nodeList.splice(nodeIndex, 1);
      //删除连线表里的相关连线,连接新的元素
      let line = JSON.parse(
        JSON.stringify(this.data.lineList.find((item) => item.from === id))
      );

      let linenewto = this.data.lineList.find((item) => item.from === id).to;
      let linenewfrom = this.data.lineList.find((item) => item.to === id).from;
      //找到关于id作为from节点的并删除
      let linefromIndex = this.data.lineList.findIndex(
        (item) => item.from === id
      );
      await this.deleteOneLine(this.data.lineList[linefromIndex].id);
      this.data.lineList.splice(linefromIndex, 1);
      //找到关于id作为to节点的并删除
      let linetoIndex = this.data.lineList.findIndex((item) => item.to === id);
      if (!isSingleNode) {
        let lineid = this.getRandomId();
        await this.deleteOneLine(this.data.lineList[linetoIndex].id);
        this.data.lineList.splice(linetoIndex, 1, {
          id: lineid,
          from: linenewfrom,
          to: linenewto,
          type: line.type,
        });
        await this.addOneLine({
          id: lineid,
          from: linenewfrom,
          to: linenewto,
          type: line.type,
        });
      } else {
        await this.deleteOneLine(this.data.lineList[linetoIndex].id);
        this.data.lineList.splice(linetoIndex, 1);
      }
      if (!isBranchExist) {
        //删除节点
        let startIndex = this.data.nodeList.findIndex(
          (item) => item.id === branchstartnodeid
        );
        await this.deleteOneNode(this.data.nodeList[startIndex].id);
        this.data.nodeList.splice(startIndex, 1);
        let endIndex = this.data.nodeList.findIndex(
          (item) => item.id === branchendnodeid
        );
        await this.deleteOneNode(this.data.nodeList[endIndex].id);
        this.data.nodeList.splice(endIndex, 1);

        let linenewto = this.data.lineList.find(
          (item) => item.from === branchendnodeid
        ).to;
        let linenewfrom = this.data.lineList.find(
          (item) => item.to === branchstartnodeid
        ).from;

        let linefromIndex = this.data.lineList.findIndex(
          (item) => item.from === branchendnodeid
        );
        await this.deleteOneLine(this.data.lineList[linefromIndex].id);
        this.data.lineList.splice(linefromIndex, 1);

        let linetoIndex = this.data.lineList.findIndex(
          (item) => item.to === branchstartnodeid
        );
        await this.deleteOneLine(this.data.lineList[linetoIndex].id);
        let lineid = this.getRandomId();
        await this.addOneLine({
          id: lineid,
          from: linenewfrom,
          to: linenewto,
          type: 0,
        });
        this.data.lineList.splice(linetoIndex, 1, {
          id: lineid,
          from: linenewfrom,
          to: linenewto,
          type: 0,
        });
      }

      this.dataReload();
      this.isFormShow = false;
      this.deleteDialogVisible = false;
      ElMessage.success("节点删除成功！");
    },
    goToEdit() {
      let efContainer = this.$refs.efContainer;
      this.scroll.left = efContainer.scrollLeft;
      this.scroll.top = efContainer.scrollTop;
      this.isEditMode = true;
      this.dataReload();
    },
    quitEdit() {
      let efContainer = this.$refs.efContainer;
      this.scroll.left = efContainer.scrollLeft;
      this.scroll.top = efContainer.scrollTop;
      this.isEditMode = false;
      this.dataReload();
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
  },
};
</script>

<style lang="scss">
.item_start {
  position: absolute;
  top: 35vh;
  left: 15vw;
  width: 60px;
  height: 60px;
  border: 1px solid #e0e3e7;
  &:hover {
    border: 1px solid #1879ff;
    background-color: #f0f7ff;
    cursor: pointer;
  }
}
.item_end {
  position: absolute;
  top: 35vh;
  left: 20vw;
  width: 60px;
  height: 60px;
  border: 1px solid #e0e3e7;
  &:hover {
    border: 1px solid #1879ff;
    background-color: #f0f7ff;
    cursor: pointer;
  }
}
.item {
  position: absolute;
  top: 35vh;
  left: 20vw;
  width: 60px;
  height: 60px;
  border: 1px solid #e0e3e7;
  &:hover {
    border: 1px solid #1879ff;
    background-color: #f0f7ff;
    cursor: pointer;
  }
}
.canvas {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border-right: 1px solid #dce3e8;
}
.node-form-header {
  text-align: center;
  height: 32px;
  border-top: 1px solid #dce3e8;
  border-bottom: 1px solid #dce3e8;
  background: #f1f3f4;
  color: #000;
  line-height: 32px;
  padding-left: 12px;
  font-size: 14px;
}

.node-form-body {
  display: flex;
  height: 90%;
  flex-direction: column;
  padding-top: 10px;
  padding-right: 10px;
  padding-bottom: 20px;
  background: #fbfbfb;
}
/* 连线中的label 样式*/
.jtk-overlay.flowLabel {
  padding: 2px 4px 2px 4px;
  background-color: white;
  color: #565758 !important;
  border: 1px dotted black;
  border-radius: 5px;
  height: 10px;
  line-height: 10px;
  cursor: pointer;
  &:hover {
    border: 1px solid #1879ff;
    background-color: #f0f7ff;
  }
}
.mutiinput {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.nodecontent {
  display: flex;
  align-items: center;
  min-height: 88vh;
}
/*画布容器*/
#efContainer {
  position: relative;
  flex: 1;
  overflow: scroll;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #e0e3e7;
  height: 20px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}
.edit-header {
  height: 100%;
  display: flex;
  padding: 5px 5px 0 0;
  justify-content: flex-end;
}

.main-zone {
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.exp-base {
  height: 30%;
}
.exp-res {
  height: 35%;
}
.exp-rate {
  height: 20%;
}
.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.filelist {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
.fileicon {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>