<template>
    <div class="select">
        <div class="font">请选择当前学期：</div>
        <el-select v-model="curSemesterTime" placeholder="Select" size="small">
            <el-option v-for="semester in  semesters" :key="semester?.id" :label="semester?.time" :value="semester?.time"
                @click="changeSem(semester)" />
        </el-select>
    </div>
</template>
  
<script>

export default {
    computed: {
        curSemesterTime() {
            return this.curSemester ? this.curSemester.time : ''
        }
    },
    props: {
        semesters: Array,
        curSemester:Object
    },
    methods: {
        async changeSem(semester) {
            await this.$emit("changeSemCallback", semester)
        },
    },
};
</script>
  
<style scoped>
.select {
    width: 100%;
    font-size: 12px;
}
.font {
    font-size: 12px;
    color: var(--el-text-color-regular);
    line-height: 30px;
}

.el-select {
    width: 100%;
}
</style>