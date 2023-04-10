<template>
  <el-container>
    <el-main>
      <el-descriptions title="个人基本信息" border>
        <el-descriptions-item label="姓名">秦岭</el-descriptions-item>
        <el-descriptions-item label="身份">学生</el-descriptions-item>
        <el-descriptions-item label="账号">12345</el-descriptions-item>

        <el-descriptions-item label="性别">男</el-descriptions-item>
        <el-descriptions-item label="学院"
          >计算机与信息学院</el-descriptions-item
        >
        <el-descriptions-item label="班级" v-show="!isTeacher"
          >软工1班</el-descriptions-item
        >
        <el-descriptions-item label="专业" v-show="!isTeacher"
          >软件工程</el-descriptions-item
        >
        <el-descriptions-item label="头像">
          <!-- 这里需要修改 -->
          <el-upload action="#" list-type="picture-card" :auto-upload="false">
            <el-icon><Plus /></el-icon>

            <template #file="{ file }">
              <div>
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <el-icon><zoom-in /></el-icon>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                  >
                    <el-icon><Download /></el-icon>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <el-icon><Delete /></el-icon>
                  </span>
                </span>
              </div>
            </template>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-descriptions-item> </el-descriptions
    ></el-main>
  </el-container>
</template>

<script>
export default {
  data() {},
  computed: {
    isTeacher() {
      return this.$store.state.isTeacher;
    },
  },
};
</script>

<style scoped>
.el-header span {
  font-size: 25px;
  font-weight: 550;
}
:deep(.el-upload--picture-card) {
  --el-upload-picture-card-size: 50px;
}
</style>
