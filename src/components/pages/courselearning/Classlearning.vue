<template>
  这里是节次学习页面
  <div ref="pdfbox">
    {{ pages }}
    <canvas :id="'the-canvas' + num"></canvas>
    <div @click="previous">上一页</div>
    <div>{{ num }}/{{ pages }}</div>
    <div @click="next">下一页</div>
  </div>
</template>

<script>
import * as pdfjsLib from "pdfjs-dist";
export default {
  name: "Classlearning",
  // components: {
  //   pdf,
  // },q
  data() {
    return {
      title: "查看协议",
      pdfDoc: null,
      pages: 0,
      num: 1,
    };
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
      console.log(num);
      this.pdfDoc.getPage(num).then((page) => {
        let canvas = document.getElementById("the-canvas" + num);
        let ctx = canvas.getContext("2d");
        const viewport = page.getViewport({ scale: 2 });
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
        this.pages = this.pdfDoc.numPages;
        this.$nextTick(() => {
          this._renderPage(1);
        });
      });
    },
    /* 下一页 */
    next() {
      this.num++;
      this._renderPage(this.num);
    },
    /* 上一页 */
    previous() {
      this.num--;
      this._renderPage(this.num);
    },
  },
};
</script>

<style scoped>
canvas {
  display: block;
  border-bottom: 1px solid black;
}
</style>