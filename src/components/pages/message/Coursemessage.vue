<template>
    <div class="box">
        <div class="left">
            <div class="selectBox">
                <SemesterSelect :semesters="semesters" :curSemester="curSemester" @changeSemCallback="changeSemCallback" />
            </div>
            <ul class="courses">
                <el-scrollbar height="370px">
                    <li v-for="course in courses" :key="course.id"
                        :class="curCourse.courseId === course.courseId ? 'activeCourse' : ''">
                        <CourseItem :course="course" @changeMessageCallback="changeMessageCallback" />
                    </li>
                </el-scrollbar>
            </ul>
        </div>
        <div class="right">
            <el-dialog v-model="dialogVisible" title="创建作业" width="60%" :before-close="handleClose">
                <el-form :model="form" label-width="50px">
                        <el-form-item label="标题:">
                            <el-input v-model="form.title" />
                        </el-form-item>
                        <el-form-item label="内容:">
                                <el-input v-model="form.content" :rows="6" type="textarea" resize="none" />
                            </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="addMsg">
                            发送消息
                        </el-button>
                    </span>
                </template>
            </el-dialog>
            <ul>
                <el-scrollbar height="80vh">
                    <div class="msgListHeader">
                        <span>消息列表：</span>
                        <el-button @click="dialogVisible=true">+发送课程消息</el-button>
                    </div>
                    <li v-for="message in messages" :key="message.id" class="msgItem" @click="checkMsg(message)">
                        <CourseMessageItem :message="message" />
                    </li>
                    <li v-if="messages.length === 0" class="msgItem">
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

import { getCoursesById, getSemestersById, getCoursesBySem, getAllMessages, getMessagesByCourseId } from '../../../network/api'

export default {
    components: { SemesterSelect, CourseItem, CourseMessageItem },
    methods: {
        async changeMessageCallback(course) {
            this.curCourse = course
            try {
                let res = await getMessagesByCourseId(course.courseId)
                this.messages = res.data.data.list
            } catch (e) {
                console.log(e)
            }
        },
        async getCourses() {
            const curUser = this.$store.state.userInfo;
            this.userInfo = curUser;
            // api：通过用户id获取到用户的课程信息
            try {
                let userid = this.$store.state.userInfo.id;
                let res = await getCoursesById(userid);
                this.courses = res.data.data.courses
                this.curCourse = res.data.data.courses[0]
                this.allCourses = res.data.data.courses
                console.log(res)
            } catch (e) {
                console.log(e)
            }
        },
        async changeSemCallback(semester) {
            if (!this.allCourses.length) {
                await this.getCourses()
            }
            const val = semester.value
            let courses = this.allCourses
            this.curSemester = semester
            if (val === "all") {
            } else if (val === "2022-1") {
                courses = courses.filter((item) => item.term === 1);
            } else {
                courses = courses.filter((item) => item.term === 2);
            }
            courses = courses.map((item) => {
                return {
                    courseId: item.courseId,
                    courseName: item.courseName,
                    beginWeek: item.beginWeek,
                    endWeek: item.endWeek,
                    teachers: item.teachers.map((item) => item.name),
                    coverUrl: item.coverUrl,
                };
            });
            this.courses = courses
            this.curCourse = courses[0]
            this.changeMessageCallback(courses[0])
        },
        async checkMsg(msg) {
            // 没什么意义，已经有完整数据了
            // this.$request(`/msg/check/${msg.id}`)
            //     .then(
            //         res=>{
            //             console.log(res)
            //         }
            //     )

            // 有条件的话可以改成elementplus弹窗，懒得改了现在
            alert(msg.content)
        },
        addMsg() {
            this.$request(
                `/msg/send`,
                {
                    content: this.form.title,
                    courseId: this.curCourse.courseId,
                    teacherUserId: this.$store.state.userInfo.id,
                    title: this.form.content
                },
                "post",
                "params",
                "json"
            ).then(
                res => {
                    console.log(res)
                    this.changeMessageCallback(this.curCourse)
                    this.dialogVisible=false
                    alert("发送消息成功！")
                },
                err => {
                    console.log("发送消息失败！")
                }
            )
        }
    },
    data() {
        const courses = []
        const curCourse = {
        }
        const semesters = [
            {
                value: "all",
                label: "全部",
            },
            {
                value: "2022-1",
                label: "2022~2023第1学期",
            },
            {
                value: "2022-2",
                label: "2022~2023第2学期",
            },
        ]
        const curSemester = {
            value: "all",
            label: "全部",
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
            userinfo,
            allCourses: [],
            isTeacher: this.$store.state.isTeacher,
            dialogVisible:false,
            form:{
                title:"",
                content:""
            }
        }
    },
    async mounted() {
        await this.getCourses()
        this.changeSemCallback({
            value: "all",
            label: "全部",
        })
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

.msgItem:last-of-type {
    margin-bottom: 0px;
}

.msgListHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 10px;
}
</style>