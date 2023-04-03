<template>
  <el-row style="height: 100%">
    <el-col :span="18">
      <div style="display: flex; height: 100%">
        <div
          id="efContainer"
          ref="efContainer"
          class="container"
          v-if="easyFlowVisible"
        >
          <template v-for="node in data.nodeList" :key="node.id">
            <flow-node
              :id="node.id"
              :node="node"
              :activeElement="activeElement"
              @clickNode="clickNode"
              @changeNodeSite="changeNodeSite"
            >
            </flow-node>
          </template>
          <!-- 给画布一个默认的宽度和高度 -->
          <div style="position: absolute; top: 2000px; left: 2000px">
            &nbsp;
          </div>
        </div>
      </div>
    </el-col>
    <!-- 侧边编辑节点信息 -->
    <el-col :span="6">
      <div class="detail-zone">
        <div class="node-form-header">节点信息</div>
        <div class="node-form-body">
          <el-form
            :model="nodeinfo"
            ref="dataForm"
            label-width="80px"
            v-show="isFormShow"
          >
            <el-form-item label="名称">
              <el-input v-model="nodeinfo.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveNodeInfo">保存</el-button>
              <el-button type="danger" @click="deletenode">删除</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div></el-col
    >
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
  </el-row>
</template>

<script>
import { jsPlumb } from "jsplumb";
import flowNode from "./utilCom/node.vue";
export default {
  data() {
    return {
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
      branchList: [
        // {
        //   branchid: "",
        //   toid: "",
        //   length: 0,
        // },
      ],
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
  },
  created() {
    this.data = {
      nodeList: JSON.parse(JSON.stringify(this.initNodeList)),
      lineList: JSON.parse(JSON.stringify(this.initLineList)),
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.dataReload();
    });
    //开启监听浏览器的缩放，适应不同的尺寸的屏幕
    window.addEventListener("resize", () => {
      this.jsPlumb.repaintEverything();
    });
  },
  methods: {
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
    changeNodeSite(data) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i];
        if (node.id === data.nodeId) {
          node.left = data.left;
          node.top = data.top;
        }
      }
    },
    //加载节点Stra
    loadEasyFlow() {
      // 初始化节点
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i];
        this.jsPlumb.draggable(node.id, {
          containment: "parent",
          stop: function (el) {
            // 拖拽节点结束后的对调
          },
        });
      }
      // 初始化连线
      for (var i = 0; i < this.data.lineList.length; i++) {
        let line = this.data.lineList[i];
        let linetype = line.type === 0 ? "Straight" : "Bezier";
        let location = line.type === 0 ? 0.5 : line.type === 1 ? 0.8 : 0.2;
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
        this.jsPlumb.connect(connParam);
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
    },
    //确定提交新增节点
    confirmAddNewNode() {
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
          let leftpostion = this.data.nodeList[sourceIndex + 1].left;
          for (let i = sourceIndex + 1; i < this.data.nodeList.length; ++i) {
            this.data.nodeList[i].left =
              "calc(" + this.data.nodeList[i].left + " + 10vw)";
          }
          //插入新节点
          let newid = this.maxid + 1;
          this.data.nodeList.splice(sourceIndex + 1, 0, {
            id: String(newid),
            name: "新节点",
            left: leftpostion,
            top: "35vh",
            type: 1,
          });
          //重新连线
          let lineIndex = this.data.lineList.findIndex(
            (item) =>
              item.from === this.tmpsourceId && item.to === this.tmptargetId
          );
          //删除旧连线，形成新连线
          this.data.lineList.splice(
            lineIndex,
            1,
            {
              from: this.tmpsourceId,
              to: String(newid),
              type: 0,
            },
            {
              from: String(newid),
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
        let leftpostion = this.data.nodeList[sourceIndex + 1].left;
        for (let i = sourceIndex + 1; i < this.data.nodeList.length; ++i) {
          this.data.nodeList[i].left =
            "calc(" + this.data.nodeList[i].left + " + 30vw)";
        }
        //添加分支开始节点
        let branchstartid = this.maxid + 1;
        let newid = branchstartid;
        this.data.nodeList.splice(sourceIndex + 1, 0, {
          id: String(newid),
          name: "",
          left: leftpostion,
          top: "35vh",
          type: 2,
        });
        //添加并行节点
        let topposition;
        if (this.mutiNodeNumInput % 2 === 0)
          topposition = 35 - (this.mutiNodeNumInput / 2) * 5 + "vh";
        else topposition = 35 - ((this.mutiNodeNumInput - 1) / 2) * 5 + "vh";
        for (let i = 0; i < this.mutiNodeNumInput; i++) {
          this.data.nodeList.splice(sourceIndex + 2 + i, 0, {
            id: String(++newid),
            name: "新节点",
            left: "calc(" + leftpostion + " + 10vw)",
            top: "calc(" + topposition + " + " + 10 * i + "vh)",
            type: 3,
          });
          this.branchList.push({
            branchid: String(branchstartid),
            toid: String(newid),
            length: 1,
          });
        }

        //添加分支结束节点
        let branchendid = newid + 1;
        this.data.nodeList.splice(sourceIndex + 2 + this.mutiNodeNumInput, 0, {
          id: String(branchendid),
          name: "",
          left: "calc(" + leftpostion + " + 25vw)",
          top: "35vh",
          type: 4,
        });

        //重新连线
        let lineIndex = this.data.lineList.findIndex(
          (item) =>
            item.from === this.tmpsourceId && item.to === this.tmptargetId
        );
        //删除旧连线，形成新连线
        //1)源节点到分支开始节点
        this.data.lineList.splice(lineIndex, 1, {
          from: this.tmpsourceId,
          to: String(branchstartid),
          type: 0,
        });
        //2)分支开始节点到并行节点
        for (let i = 0; i < this.mutiNodeNumInput; ++i) {
          this.data.lineList.splice(
            lineIndex + 1,
            0,
            {
              from: String(branchstartid),
              to: String(branchstartid + 1 + i),
              type: 1,
            },
            {
              from: String(branchstartid + 1 + i),
              to: String(branchendid),
              type: 2,
            }
          );
        }
        //3)从分支结束节点到下一个节点
        this.data.lineList.splice(lineIndex + 1 + this.mutiNodeNumInput, 0, {
          from: String(branchendid),
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
    clickNode(node) {
      if (node.type === 1 || node.type === 3) {
        this.activeElement.type = "node";
        this.activeElement.nodeId = node.id;
        this.nodeinfo.id = node.id;
        this.nodeinfo.name = node.name;
      }
      this.isFormShow = true;
    },
    //保存信息
    saveNodeInfo() {
      let index = this.data.nodeList.findIndex(
        (item) => item.id === this.activeElement.nodeId
      );
      this.data.nodeList[index].name = this.nodeinfo.name;
      this.jsPlumb.repaintEverything();
    },
    //删除节点
    deletenode() {
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
        let tmpIndex = this.data.nodeList.findIndex(
          (item) => item.id === node.id
        );
        while (this.data.nodeList[tmpIndex].type !== 4) tmpIndex++;
        branchendnodeid = this.data.nodeList[tmpIndex].id;

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
      this.data.lineList.splice(linefromIndex, 1);
      //找到关于id作为to节点的并删除
      let linetoIndex = this.data.lineList.findIndex((item) => item.to === id);
      if (!isSingleNode)
        this.data.lineList.splice(linetoIndex, 1, {
          from: linenewfrom,
          to: linenewto,
          type: line.type,
        });
      else {
        this.data.lineList.splice(linetoIndex, 1);
      }
      if (!isBranchExist) {
        //删除节点
        let startIndex = this.data.nodeList.findIndex(
          (item) => item.id === branchstartnodeid
        );
        this.data.nodeList.splice(startIndex, 1);
        let endIndex = this.data.nodeList.findIndex(
          (item) => item.id === branchendnodeid
        );
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
        this.data.lineList.splice(linefromIndex, 1);

        let linetoIndex = this.data.lineList.findIndex(
          (item) => item.to === branchstartnodeid
        );
        this.data.lineList.splice(linetoIndex, 1, {
          from: linenewfrom,
          to: linenewto,
          type: 0,
        });
      }

      this.dataReload();
      this.isFormShow = false;
      //删除一般节点
      //删除并行节点（不同的连接线的分类）
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
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #e0e3e7;
  height: 20px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>