<template>
  <div class="correctpage">
    <el-card shadow="never" class="boxcard">
      <template #header>
        <div class="card-header">
          <span class="homeworktitle">作业标题</span>
          <span
            >已提交{{ submitnum }}/{{ totalnum }}&nbsp;已批改{{ correctnum }}/{{
              totalnum
            }}</span
          >
        </div>
      </template>
      <div class="homeworkcontent">学生作业内容</div>
      <div>
        <span>评价</span>
        <el-input
          style="margin-bottom: 10px"
          v-model="textarea"
          :rows="5"
          type="textarea"
          placeholder="输入评语"
          resize="none"
        />
        <div>
          <div class="bottomzone">
            <div>
              <span>打分:</span>
              <el-input style="width: 50px; margin-left: 10px"></el-input>
            </div>
            <el-button type="primary">完成批改</el-button>
          </div>
        </div>
      </div>
    </el-card>
    <el-card shadow="never" class="stulist" body-style="padding:0">
      <template #header>
        <div class="card-header">
          <span class="homeworktitle">学生列表</span>
          <el-button link
            ><el-icon><Refresh /></el-icon
          ></el-button>
        </div>
      </template>
      <el-scrollbar>
        <ul>
          <li class="listitem">
            <span class="name">某某</span>
            <el-button link type="primary">查看作业</el-button>
          </li>
        </ul>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totalnum: "10",
      submitnum: "1",
      correctnum: "1",
      //教师评语
      correctwords: "",
      textarea: "",
    };
  },
};
</script>

<style scoped lang="scss">
.correctpage {
  display: flex;
  justify-content: space-around;
  .boxcard {
    width: 50vw;
    height: 85vh;
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .homeworktitle {
        font-size: 20px;
      }
    }
    .homeworkcontent {
      height: 50vh;
      margin-bottom: 10px;
    }
    .bottomzone {
      display: flex;
      justify-content: space-between;
    }
  }

  .stulist {
    position: absolute;
    right: 0;
    width: 15vw;
    height: 100%;
    .card-header {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .listitem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      height: 50px;
      border-bottom: 1px solid #e4e7ed;
    }
  }
}
</style>