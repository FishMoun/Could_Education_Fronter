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
          <div class="status" v-show="!boxStatus.isLogin">
            <span>身份：</span>
            <el-select
              v-model="boxStatus.accountType"
              placeholder="选择身份"
              size="small"
              style="width: 90px"
            >
              <el-option
                v-for="item in accountTypes"
                :key="item"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </template>
      <div class="boxBody">
        <el-row :gutter="0">
          <el-input
            v-model="boxStatus.id"
            size="large"
            class="w-50 m-2"
            placeholder="学号或工号"
            :prefix-icon="User"
            v-show="!boxStatus.isLogin && boxStatus.accountType !== 'admin'"
          />
          <el-input
            v-model="boxStatus.nickname"
            size="large"
            class="w-50 m-2"
            placeholder="姓名"
            :prefix-icon="Cherry"
            v-show="!boxStatus.isLogin"
          />
          <el-input
            v-model="boxStatus.username"
            size="large"
            class="w-50 m-2"
            placeholder="账号"
            :prefix-icon="User"
          />
          <el-input
            v-model="boxStatus.password"
            size="large"
            class="w-50 m-2"
            placeholder="密码"
            type="password"
            show-password
            :prefix-icon="Lock"
          />
          <!-- 学生班级输入 -->
          <el-select
            v-model="classId"
            filterable
            remote
            reserve-keyword
            placeholder="选择班级"
            :remote-method="searchRemoteClass"
            remote-show-suffix
            :loading="loading"
            v-show="!boxStatus.isLogin && boxStatus.accountType === 'student'"
            size="large"
            style="width: 100%; margin-bottom: 10px"
          >
            <el-option
              v-for="item in options"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- 教室学院输入 -->
          <el-select
            v-model="departmentValue"
            class="m-2"
            placeholder="选择学院"
            size="large"
            style="width: 100%; margin-bottom: 10px"
            v-show="!boxStatus.isLogin && boxStatus.accountType === 'teacher'"
          >
            <el-option
              v-for="item in departmentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
          <span class="action" @click="changeStatus">{{
            boxStatus.isLogin ? "去注册" : "去登录"
          }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { reactive, getCurrentInstance, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { User, Lock, Cherry } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

export default {
  name: "Login",
  setup() {
    const store = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const accountTypes = [
      { value: "student", label: "学生" },
      { value: "teacher", label: "教师" },
      { value: "admin", label: "管理员" },
    ];
    // 班级参数相关
    const classId = ref("");
    const loading = ref(false);
    const options = ref([]);
    const classes = ref([]);
    const departmentValue = ref("");
    const departmentOptions = ref([
      { label: "计算机与信息学院", value: "计算机与信息学院" },
      { label: "人工智能院", value: "人工智能院" },
    ]);
    const boxStatus = reactive({
      isLogin: true,
      username: "",
      password: "",
      confirmPassword: "",
      accountType: "student",
      nickname: "",
      id:""
    });
    function changeStatus() {
      boxStatus.isLogin = !boxStatus.isLogin;
    }
    async function onSubmit() {
      if (boxStatus.isLogin === true) {
        let login = {
          username: boxStatus.username,
          password: boxStatus.password,
        };
        let res = await proxy.$request(
          "/ucenter/user/login",
          login,
          "post",
          "params",
          "json",
          "/ucenter"
        );
        console.log(res);
        if (res.data.code === 20000) {
          store.state.token = res.data.data.token;
          let info = await getLoginInfo();
          console.log(info);
          if (info) {
            store.state.userInfo = info;
            ElMessage.success("登录成功！");
            if (info.role === "admin") {
              store.state.isAdmin = true;
            }
            if (info.role === "teacher") {
              store.state.isTeacher = true;
            }
            if (info.role === "admin") {
              router.push({
                path: "/coursemanagement",
              });
            } else {
              router.push({
                path: "/home",
              });
            }
          } else {
            ElMessage.error("登录失败！");
          }
        } else {
          ElMessage.error("登录失败！");
        }
      } else {
        //注册请求
        let register = {
          nickname: boxStatus.nickname,
          password: boxStatus.password,
          role: boxStatus.accountType,
          username: boxStatus.username,

        };
        let res = await proxy.$request(
          "/ucenter/user/register",
          register,
          "post",
          "params",
          "json"
        );
        if (res.data.code === 20000) {
          let id = res.data.data.user.id;

          //根据身份进行关联
          if (boxStatus.accountType === "student") {
            let name = boxStatus.nickname;
            let stuinfo = {
              id:boxStatus.id,
              classId: classId.value,
              department: classes.value.find(
                (item) => item.id === classId.value
              ).department,
              userId: id,
              major: classes.value.find((item) => item.id === classId.value)
                .major,
              name: name,
              gender: true,
            };
            console.log(stuinfo);
            let res1 = await proxy.$request(
              "/admin/manager/student/save",
              stuinfo,
              "post",
              "params",
              "json"

            );
            console.log(res1);
            if (res1.data.code === 20000) {
              console.log(res1);
              ElMessage.success("注册成功!");
            }
          } else if (boxStatus.accountType === "teacher") {
            let name = boxStatus.nickname;
            let teainfo = {
              id:boxStatus.id,
              department: departmentValue.value,
              userId: id,
              name: name,
              gender: true,
            };
            console.log(teainfo);
            let res1 = await proxy.$request(
              "/admin/manager/teacher/save",
              teainfo,
              "post",
              "params",
              "json"
            );
            console.log(res1);
            if (res1.data.code === 20000) {
              console.log(res1);
              ElMessage.success("注册成功!");
            }
          }
        } else ElMessage.error("注册失败！");
      }
    }
    async function getLoginInfo() {
      let tmpform = {
        token: store.state.token,
      };
      let res = await proxy.$request(
        "/ucenter/user/get-login-info",
        tmpform,
        "post",
        "params",
        "json"
      );

      return res?.data.data.userInfo;
    }
    async function searchRemoteClass(query) {
      loading.value = true;
      let res = await proxy.$request(
        "/admin/manager/class/list",
        "",
        "get",
        "params",
        "json"
      );
      console.log(res);
      if (res.data.code === 20000) {
        loading.value = false;
        options.value = res.data.data.classes.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        classes.value = res.data.data.classes.map((item) => {
          return {
            id: item.id,
            department: item.department,
            major: item.major,
          };
        });
      }
    }
    return {
      departmentValue,
      departmentOptions,
      options,
      searchRemoteClass,
      loading,
      classId,
      onSubmit,
      changeStatus,
      accountTypes,
      boxStatus,
      User,
      Lock,
      Cherry,
    };
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
    height: 30px;
  }
  .status {
    display: flex;
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
