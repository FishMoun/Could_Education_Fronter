<template>
  <div class="loginBox">
    <div class="logo-container">
      <img src="/src/assets/logo.png" />
      <span>教学管理系统</span>
    </div>
    <el-card class="box-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ boxStatus.isLogin ? "登录" : "注册" }}</span>
          <span>
            身份：
            {{ boxStatus.accountType }}
          </span>
        </div>
      </template>
      <div class="boxBody">
        <el-row :gutter="0">
          <!-- 为了测试方便，这里的v-model配合后端的api写法 -->
          <el-input
            v-model="login.mobile"
            size="large"
            class="w-50 m-2"
            placeholder="账号"
            :prefix-icon="User"
          />
          <el-input
            v-model="login.password"
            size="large"
            class="w-50 m-2"
            placeholder="密码"
            :prefix-icon="Lock"
          />
        </el-row>
      </div>
      <div class="boxFooter">
        <div class="action">
          <el-button type="primary" @click="onSubmit">{{
            boxStatus.isLogin ? "登&nbsp;&nbsp;录" : "注&nbsp;&nbsp;册"
          }}</el-button>
        </div>
        <div class="more">
          <span>{{ boxStatus.isLogin ? "没有账户？" : "已有账户？" }}</span>
          <span class="action" @click="changeStatus()">{{
            boxStatus.isLogin ? "去注册" : "去登录"
          }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { reactive } from "vue";
import { User, Lock } from "@element-plus/icons-vue";

export default {
  name: "Login",
  setup() {
    const accountTypes = ["学生", "教师", "管理员"];
    const boxStatus = reactive({
      isLogin: true,
      username: "",
      password: "",
      confirmPassword: "",
      accountType: accountTypes[0],
    });
    return {
      accountTypes,
      boxStatus,
      User,
      Lock,
    };
  },
  data() {
    return {
      login: {
        mobile: "",
        password: "",
      },
    };
  },
  methods: {
    changeStatus() {
      this.boxStatus.isLogin = !this.boxStatus.isLogin;
    }, //   点击登录的回调
    async onSubmit() {
      let res = await this.$request(
        "/educenter/member/login",
        this.login,
        "post",
        "params"
      );
      console.log(res);
      if (res.status == 200 && res.data.success) {
        // 登陆成功
        // 将用户信息保存至vuex
        this.$store.commit("updateUserInfo", res.data.data.mem);

        // 将返回的用户信息保存至localstorage中
        window.localStorage.setItem(
          "userInfo",
          JSON.stringify(res.data.data.mem)
        );

        // 将token存入本地
        window.localStorage.setItem("token", res.data.data.token);

        //   跳转至主界面
        this.$router.push("/index");
      } else if (res.status == 200 && !res.data.success) {
        this.$message.warning("登录失败,账号或密码错误!");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.loginBox {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: var(--el-color-primary-light-9);
}

.logo-container {
  padding: 10px;
  display: flex;
  justify-content: left;
  align-items: center;
  background-color: var(--el-color-primary-dark-2);
  box-shadow: 10px 0px 15px var(--el-color-primary-dark-2);

  span {
    font-size: 20px;
    font-weight: bold;
    margin: 10px;
    color: var(--el-color-white);
  }
}

.box-card {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 480px;
  transform: translateX(-50%) translateY(-50%);

  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .el-button {
    width: 100%;
    height: 40px;
  }

  .el-input {
    margin-bottom: 15px;
  }

  .boxFooter {
    .more {
      margin-top: 10px;
      span {
        padding: 5px 0;
        font-size: 12px;
        color: var(--el-color-info);
      }
      .action {
        cursor: pointer;
        color: var(--el-color-primary-dark-2);
        text-decoration: underline;
      }
    }
  }
}
</style>
