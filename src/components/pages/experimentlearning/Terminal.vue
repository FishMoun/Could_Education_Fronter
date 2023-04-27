<template>
  <el-row style="height: 100%; justify-content: center">
    <el-col :span="12" class="experiment-zone">
      <el-card shadow="never" class="node-title">
        {{ nodetitle }}
        <el-button
          link
          type="primary"
          style="position: relative; left: 10vw"
          @click="isTerminalOpen = true"
          >打开实验终端</el-button
        >
      </el-card>
      <el-card shadow="never" style="font-size: 25px; height: 15%">
        <div style="display: flex; justify-content: space-between">
          实验资源
        </div>
        <div style="height: 70%; overflow: auto" v-show="fileList.length !== 0">
          <div class="filelist" v-for="item in fileList" :key="item.id">
            <div style="display: flex; align-items: center">
              <img
                style="width: 50px; height: 50px"
                :src="getFileImage(item.name)"
                alt=""
              />

              <span style="font-size: 20px">{{ item.name }}</span>
            </div>
            <div class="fileicon">
              <a :href="item.url"
                ><el-icon size="20px" color=""><Download /></el-icon
              ></a>
            </div>
          </div>
        </div>
      </el-card>
      <el-card shadow="never" style="height: 60%; font-size: 25px">
        <div>实验步骤</div>
        <p style="font-size: 20px">{{ expStep }}</p>
        <el-button
          link
          type="primary"
          v-show="isTeacher"
          @click="
            this.expStepDialogVisible = true;
            this.expStepInput = this.expStep;
          "
          >编辑</el-button
        >
      </el-card>
      <el-card shadow="never" class="node-report">
        <el-upload
          v-show="!isTeacher"
          class="upload-demo"
          :action="uploadReportUrl"
          :on-success="handleSuccess"
          list-type="picture"
          :show-file-list="false"
          :headers="{ token: this.$store.state.token }"
        >
          <template #trigger>
            <el-button
              style="margin-left: 10px; margin-top: 10px"
              type="primary"
              >提交报告</el-button
            >
            <span
              style="position: relative; left: 10px; top: 5px"
              v-show="isSubmit"
              >实验得分:（待批改）</span
            >
          </template>
        </el-upload>
        <div>
          <el-button type="primary" v-show="isTeacher" @click="goToCri"
            >批改报告</el-button
          >
          <span style="margin-left: 10px" v-show="isTeacher"
            >提交人数：0/11</span
          >
          <span style="margin-left: 10px" v-show="isTeacher"
            >完成率：{{ finish_rate }}%</span
          >
        </div>
      </el-card>
    </el-col>
    <el-col :span="12" class="terminal-zone" v-show="isTerminalOpen">
      <div class="terminal-header">
        <span>实验终端</span>
        <el-button
          link
          style="position: absolute; right: 20px"
          @click="isTerminalOpen = false"
          ><el-icon><Close /></el-icon>
        </el-button>
      </div>
      <div class="terminal-wrapper">
        <div ref="terminal" /></div
    ></el-col>
    <!-- 实验步骤的对话框 -->
    <el-dialog v-model="expStepDialogVisible" title="实验步骤" width="30%">
      <el-input
        v-model="expStepInput"
        :rows="4"
        type="textarea"
        placeholder="输入"
        :resize="'none'"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="expStepDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitExpStep"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-row>
</template>

<script>
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WSSHClient } from "/src/plugins/webssh.js";
import { ElMessage } from "element-plus";
export default {
  name: "terminal",
  data() {
    return {
      expStep: "",
      expStepDialogVisible: false,
      expStepInput: "",
      fileList: [],
      isSubmit: false,
      isTerminalOpen: false,
      term: null,
      socketUri: "ws://60.204.141.214:8005/exp/webssh",
      socket: "",
      Initoption: {
        operate: "connect",
        host: "60.204.141.214", //IP
        port: "30034", //端口号
        username: "cirros", //用户名
        password: "gocubsgo", //密码
      },
      nodetitle: "",
      res: "",
      finish_rate: "",
      dataoption: { operate: "command", command: "" },
      monidata: {
        title: "基本实验1-初识Linux",
        res: {},
        stepconten:
          "1、使用shutdown命令设定在30分钟之后关闭计算机。\n2、使用init命令实现图形界面到字符界面及字符界面到图形界面的切换。\n3、分别使用命令man和help查看ls命令的帮助文档。\n4、使用命令将当前计算机的主机名显示为IT。\n5、使用命令显示公元2008年8月的月历。\n6、显示当前计算机上的日期和时间。",
      },
    };
  },
  computed: {
    token() {
      return this.$store.state.token;
    },
    nodeId() {
      return this.$route.params.nodeId;
    },
    isTeacher() {
      return this.$store.state.isTeacher;
    },
    uploadReportUrl() {
      return "http://60.204.141.214:30802/manager/course-homework/submit/file";
    },
  },
  async mounted() {
    await this.getNodeInfo(this.nodeId);
    await this.getNodeResource();
    if (this.isTeacher) {
      this.getNodeCompleteRate();
    }
  },
  watch: {
    isTerminalOpen(newval) {
      if (newval) {
        this.initTerm();
      } else {
        this.socket && this.socket.close();
        this.term && this.term.dispose();
      }
    },
  },
  beforeDestroy() {
    this.socket && this.socket.close();
    this.term && this.term.dispose();
  },
  methods: {
    async getNodeCompleteRate() {
      let res = await this.$request(
        `/exp/flowchart/node/finish-rate/${this.nodeId}`,
        "",
        "get",
        "params",
        "json"
      );
      if (res && res.data.code === 20000) {
        this.finish_rate = res.data.data.finish_rate;
      }
    },
    async submitExpStep() {
      let node = {
        id: this.nodeId,
        steps: this.expStepInput,
      };
      let isSubmit = await this.putNodeInfo(node);
      if (isSubmit) {
        ElMessage.success("步骤更新成功！");
        this.expStep = this.expStepInput;
      } else {
        ElMessage.error("更新失败请稍后重试！");
      }
      this.expStepDialogVisible = false;
    },
    async getNodeInfo(nodeId) {
      let res = await this.$request(
        `/exp/flowchart/node/${nodeId}`,
        "",
        "get",
        "params",
        "json"
      );
      console.log(res);
      if (res && res.data.code === 20000) {
        let node = res.data.data.node;
        this.nodetitle = node.name;
        this.expStep = node.steps;
      }
    },
    //获得该节点的资源
    async getNodeResource() {
      let res = await this.$request(
        `/exp/flowchart/node/resource/${this.nodeId}`,
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
    async putNodeInfo(node) {
      let res = await this.$request(
        `/exp/flowchart/node/${node.id}`,
        node,
        "put",
        "params",
        "json"
      );
      if (res && res.data.code === 20000) return true;
      return false;
    },
    //资源缩略图
    getFileImage(name) {
      if (name.includes("pdf")) return "/src/assets/img/pdf.png";
      else if (name.includes("ppt")) return "/src/assets/img/ppt.png";
      else if (name.includes("txt")) return "/src/assets/img/txt.png";
      else if (name.includes("zip")) return "/src/assets/img/zip.png";
      else if (name.includes("doc")) return "/src/assets/img/word.png";
      else return "/src/assets/img/unknown.png";
    },
    handleSuccess(res) {
      if (res && res.code === 20000) {
        ElMessage.success("提交成功！");
      }
      ElMessage.success("提交成功！");
      this.isSubmit = true;
    },
    initTerm() {
      //新建websocket连接
      const client = new WSSHClient();
      // 1.xterm终端初始化
      const term = new Terminal({
        rendererType: "canvas", //渲染类型
        rows: 35, //行数
        cols: 70, // 不指定行数，自动回车后光标从下一行开始
        convertEol: true, //启用时，光标将设置为下一行的开头
        // scrollback: 50, //终端中的回滚量
        disableStdin: false, //是否应禁用输入
        windowsMode: true, // 根据窗口换行
        cursorStyle: "underline", //光标样式
        cursorBlink: true, //光标闪烁
        theme: {
          foreground: "#ECECEC", //字体
          background: "#000000", //背景色
          cursor: "help", //设置光标
          lineHeight: 20,
        },
      });
      // 2.webSocket初始化
      console.log(this.token);
      const fitAddon = new FitAddon(); // 全屏插件
      term.loadAddon(fitAddon);

      term.open(this.$refs.terminal);
      term.write("Connecting...");
      fitAddon.fit();
      term.focus();
      this.term = term;
      term.onData((data) => {
        //键盘输入时的回调函数
        client.sendClientData(data);
      });

      //执行连接操作
      client.connect({
        onError: (error) => {
          //连接失败回调
          term.write("Error: " + error + "\r\n");
        },
        onConnect: () => {
          console.log();
          //连接成功回调
          client.sendInitData(this.Initoption);
          term.write("\nConnect Successful!");
        },
        onClose: () => {
          //连接关闭回调
          term.write("\rconnection closed");
        },
        onData: (data) => {
          //收到数据时回调
          term.write(data);
        },
      });
    },
    goToCri() {
      this.$router.push({ path: `/homeworkcorrect/${3}` });
    },
  },
};
</script>

<style scoped>
.terminal-wrapper {
  width: 100%;
  height: 95%;
}
.terminal-zone {
  padding: 10px;
  height: 100%;
}
.terminal-header {
  font-size: 25px;
  width: 100%;
  background-color: #f1f1f1;
  height: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.experiment-zone {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 10px;
  height: 100%;
}
.node-title {
  text-align: center;
  font-size: 25px;
}
.node-report {
  height: 10%;
  display: flex;
  flex-direction: row;
  justify-content: left;
}
p {
  margin-top: 10px;
  white-space: pre-line;
}
.filelist {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
</style>