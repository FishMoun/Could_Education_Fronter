<template>
    <el-row class="box">
      <el-card :body-style="{ padding: '0px' }" class="card">
          <div class="overElpSingle" :title="message.title" >{{
            message.title
          }}</div>
          <ul class="bottom">
            <li class="overElpSingle">发布者：{{ message.author }}</li>
            <li class="overElpSingle">时间：{{ message.gmtCreate }}</li>
            <li class="content">{{ message.content }}</li>
          </ul>
      </el-card>
    </el-row>
  </template>
    
  <script>
  export default {
    props: {
      message: {
        type: Object,
        default() {
          return {};
        },
      },
    },
  };
  </script>
    
  <style scoped>
  .box {
    width: 100%;
    cursor: pointer;
  }
  .card {
    width: 100%;
    padding: 14px;
    overflow: hidden;
  }
  .card:hover {
    background-color: var(--el-color-primary-light-9);
  }

  
  .bottom {
    margin-top: 5px;
    line-height: 17px;
    font-size: 12px;
    color: #999;
  }

  .content {
    width: 100%;
    overflow-wrap:break-word;
  }
  
  </style>