<template>
  <div class="terminal-wrapper">
    <div ref="terminal" />
  </div>
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
    };
  },
  computed: {
    token() {
      return this.$store.state.token;
    },
  },
  mounted() {
    this.initTerm();
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
        rows: 40, //行数
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

<style>
.terminal-wrapper {
  width: 50%;
  height: 50%;
}
</style>