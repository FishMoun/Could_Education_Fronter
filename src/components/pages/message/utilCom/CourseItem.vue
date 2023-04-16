<template>
    <div class="box" @click="changeMessageCallback">
        <img
          :src="course.coverUrl"
          @error="
            (e) => {
              e.target.src =
                'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png';
            }
          "
          class="img"
        />
        <div style="padding: 5px" class="content">
          <span class="overElpSingle" :title="course.courseName">{{
            course.courseName
          }}</span>
          <ul class="bottom">
            <li class="overElpSingle">{{ course.teachers.map(item=>item.name).join(",") }}</li>
          </ul>
        </div>
    </div>
  </template>
    
  <script>
  export default {
    props: {
      course: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    methods:{
        async changeMessageCallback(){
            await this.$emit("changeMessageCallback",this.course)
        }
    }
  };
  </script>
    
  <style scoped>
  .box {
    width: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .box:hover {
    background-color: var(--el-color-primary-light-9);
  }

  .img {
    width: 45px;
    height: 45px;
  }

  .content {
    flex: 1;
  }
  
  .bottom {
    margin-top: 5px;
    line-height: 17px;
    font-size: 12px;
    color: #999;
  }
  
  </style>