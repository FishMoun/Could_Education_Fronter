<template>
  <!-- 节点容器 -->
  <div
    ref="node"
    :style="nodeContainerStyle"
    @click="clickNode"
    :class="nodeContainerClass"
    @mouseup="changeNodeSite"
  >
    <template v-if="node.type === 1 || node.type === 3">
      <!-- 最左侧的那条竖线 -->
      <div class="ef-node-left"></div>
      <!-- 节点类型的图标 -->
      <div class="ef-node-left-ico">
        <!-- 这里节点的类型应该有三种 -->
        <!-- <i :class="nodeIcoClass"></i> -->
      </div>
      <!-- 节点名称 -->
      <div class="ef-node-text">{{ node.name }}</div>
    </template>
    <template v-if="node.type === 0 || node.type === 5">
      <div class="ef-node-se">{{ node.name }}</div>
    </template>
  </div>
</template>
 


<script>
export default {
  props: {
    node: Object,
    activeElement: Object,
    isEditMode: Boolean,
  },
  data() {
    return {};
  },
  computed: {
    nodeContainerClass() {
      //根据不同类型的节点选择不同的类
      if (this.node.type === 0) return { "ef-node-start": true };
      else if (this.node.type === 1 || this.node.type === 3) {
        return {
          "ef-node-container-edit": this.isEditMode,
          "ef-node-container-normal": !this.isEditMode,
          "ef-node-container": true,
          "ef-node-active":
            this.activeElement?.type == "node"
              ? this.activeElement?.nodeId === this.node.id
              : false,
        };
      } else if (this.node.type === 2 || this.node.type === 4)
        return { "ef-node-branch": true };
      else return { "ef-node-end": true };
    },
    nodeContainerStyle() {
      return {
        top: this.node.top,
        left: this.node.left,
      };
    },
    nodeIcoClass() {
      var nodeIcoClass = {};
      nodeIcoClass[this.node.ico] = true;
      // 添加该class可以推拽连线出来，viewOnly 可以控制节点是否运行编辑
      nodeIcoClass["flow-node-drag"] = this.node.viewOnly ? false : true;
      return nodeIcoClass;
    },
  },
  methods: {
    // 点击节点
    clickNode() {
      if (this.node.type === 1 || this.node.type === 3)
        this.$emit("clickNode", this.node);
    },
    changeNodeSite() {
      // 避免抖动
      if (
        this.node.left == this.$refs.node.style.left &&
        this.node.top == this.$refs.node.style.top
      ) {
        return;
      }
      console.log(123);
      this.$emit("changeNodeSite", {
        nodeId: this.node.id,
        left: this.$refs.node.style.left,
        top: this.$refs.node.style.top,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/*节点左侧的竖线*/
.ef-node-left {
  width: 4px;
  background-color: #1879ff;
  border-radius: 4px 0 0 4px;
}
/*节点左侧的图标*/
.ef-node-left-ico {
  line-height: 32px;
  margin-left: 8px;
}
/*节点显示的文字*/
.ef-node-text {
  color: #565758;
  font-size: 20px;
  line-height: 28px;
  /* 设置超出宽度文本显示方式*/
  white-space: wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
/*节点的最外层容器*/
.ef-node-container {
  position: absolute;
  display: flex;
  width: 9vw;
  height: 6vh;
  border: 1px solid #e0e3e7;
  border-radius: 5px;
  background-color: #fff;
}

.ef-node-container-edit:hover {
  cursor: move;
  background-color: #f0f7ff;
  background-color: #f0f7ff;
  border: 1px dashed #1879ff;
}
.ef-node-container-normal:hover {
  cursor: pointer;
  background-color: #f0f7ff;
  background-color: #f0f7ff;
  border: 1px dashed #1879ff;
}
/*节点激活样式*/
.ef-node-active {
  background-color: #f0f7ff;
  background-color: #f0f7ff;
  border: 1px solid #1879ff;
}

.ef-node-start {
  position: absolute;
  display: flex;
  background-color: #409eff;
  height: 5vh;
  width: 3vw;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
}
.ef-node-end {
  position: absolute;
  display: flex;
  background-color: #67c23a;
  height: 5vh;
  width: 3vw;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
}
.ef-node-branch {
  position: absolute;
  display: flex;
  background-color: #e6a23c;
  height: 2vh;
  width: 2vh;
}
.ef-node-se {
  font-weight: 500;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: white;
  font-size: 20px;
}
</style>