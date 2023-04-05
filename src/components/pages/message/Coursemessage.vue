<template>
    <div class="box">
        <div class="left">
            <div class="selectBox">
                <SemesterSelect :semesters="semesters" :curSemester="curSemester" @changeSemCallback="changeSemCallback" />
            </div>
            <ul class="courses">
                <el-scrollbar height="370px">
                    <li v-for="course in courses" 
                    :key="course.id" 
                    :class="curCourse.id===course.id ? 'activeCourse':''">
                        <CourseItem :course="course" @changeMessageCallback="changeMessageCallback" />
                    </li>
                </el-scrollbar>
            </ul>
        </div>
        <div class="right">
            <ul>
                <el-scrollbar height="450px">
                    <li v-for="message in messages" :key="message.id" class="msgItem">
                        <CourseMessageItem :message="message" />
                    </li>
                    <li v-if="messages.length===0" class="msgItem">
                       当前没有消息
                    </li>
                </el-scrollbar>
            </ul>
        </div>
    </div>
</template>

<script>
import SemesterSelect from './utilCom/SemesterSelect.vue';
import CourseItem from './utilCom/CourseItem.vue';
import CourseMessageItem from './utilCom/CourseMessageItem.vue';

import { getCoursesById, getSemestersById, getCoursesBySem,getAllMessages, getMessagesByCourseId } from '../../../network/api'

export default {
    components: { SemesterSelect, CourseItem, CourseMessageItem },
    methods: {
        async changeSemCallback(semester) {
            this.curSemester = semester
            try {
                // api：通过学期信息获取课程列表
                let res = await getCoursesBySem(semester.id)
                this.courses = res.data
            } catch (e) {
                console.log(e)
            }
        },
        async changeMessageCallback(course) {
            if(this.curCourse.id === course.id){
                return
            }
            this.curCourse = course
            try {
                let res= await getMessagesByCourseId(course.id)
                this.messages = res.data.data.list
            } catch (e) {
                console.log(e)
            }
        }
    },
    data() {
        const courses = [{
            id: '1',
            avatar: '图片',
            name: '数学',
            school: '河海大学',
            teacher: '王老师',
            class: '高三'
        }, {
            id: '2',
            avatar: '图片',
            name: '数学',
            school: '河海大学',
            teacher: '王老师',
            class: '高三'
        },]
        const curCourse = {
        }
        const semesters = [
            {
                id: '-1',
                time: '全部'
            }, {
                id: '1',
                time: '1semester'
            }
        ]
        const curSemester = {
            id: '-1',
            time: '全部'
        }
        const messages = [{
            id: "1",
            time: "2023-10-11",
            title: "nihao",
            content: "xxx"
        }, {

            id: "2",
            time: "2023-10-11",
            title: "nihao",
            content: "xxx111F"

        }]
        const userinfo = {}
        return {
            semesters,
            courses,
            curSemester,
            curCourse,
            messages,
            userinfo
        }
    },
    async mounted() {
        const curUser = this.$store.state.userInfo;
        this.userInfo = curUser;
        // api：通过用户id获取到用户的课程信息
        try {
            let res = await getCoursesById()
            this.courses = res.data
        } catch (e) {
            console.log(e)
        }
        // api：通过用户id获取到用户的学期信息
        try {
            let res = await getSemestersById()
            this.semesters = [{
                id: '-1',
                time: '全部'
            }].concat(res.data)
        } catch (e) {
            console.log(e)
        }
        // api：获取用户所有消息
        try {
            let res = await getAllMessages(curUser.id)
            this.messages = res.data.data.list
        } catch (e) {
            console.log(e)
        }
        this.curSemester = this.semesters && this.semesters[0]
        this.curSemesterTime = this.curSemester?.time
    },
};
</script>

<style scoped>
.box {
    height: 100%;
    display: flex;
}

.left {
    width: 200px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--el-color-info-light-8);
}

.selectBox {
    padding-bottom: 10px;
    border-bottom: 1px solid var(--el-color-info-light-8);
}

.courses {
    flex: 1;
    padding-top: 10px;
    overflow: hidden;
}

.activeCourse {
    background-color: var(--el-color-primary-light-9);
}

.right {
    flex: 1;
    overflow: hidden;
    padding: 10px;
}

.msgItem {
    margin-bottom: 20px;
}
.msgItem:last-of-type{
    margin-bottom: 0px;
}
</style>