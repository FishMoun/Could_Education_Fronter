<template>
  <el-row style="height: 100%; justify-content: center">
    <el-col :span="12" class="experiment-zone">
      <el-card shadow="never" class="node-title">
        {{ monidata.title }}
        <el-button
          link
          type="primary"
          style="position: relative; left: 10vw"
          @click="isTerminalOpen = true"
          >打开实验终端</el-button
        >
      </el-card>
      <el-card shadow="never" style="font-size: 25px; height: 15%">
        <div>实验资源</div>
        <el-button type="primary">上传</el-button>
      </el-card>
      <el-card shadow="never" style="height: 60%; font-size: 25px">
        <div>实验步骤</div>
        <p style="font-size: 20px">{{ monidata.stepconten }}</p>
        <el-button link type="primary">编辑</el-button>
      </el-card>
      <el-card shadow="never" class="node-report">
        <el-button type="primary">提交报告</el-button>
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
  </el-row>
</template>

<script>
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WSSHClient } from "/src/plugins/webssh.js";
export default {
  name: "terminal",
  data() {
    return {
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
  },
  mounted() {},
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
    initTerm() {
      //新建websocket连接
      const client = new WSSHClient();
      // 1.xterm终端初始化
      const term = new Terminal({
        rendererType: "canvas", //渲染类型
        rows: 43, //行数
        cols: 100, // 不指定行数，自动回车后光标从下一行开始
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
}
p {
  margin-top: 10px;
  white-space: pre-line;
}
</style>