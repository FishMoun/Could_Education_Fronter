import { request } from "./request";

/**
 * api请求参数：空，后端可以从token中解析出用户id等用于查询相关数据
 * api返回数据格式示例：
 *  [{
      id:'1',
      avatar:'图片',
      name:'数学',
      school:'河海大学',
      teacher:'王老师',
      class:'高三'
    }]
 */
export const getCoursesById = (userid) => {

  let params = { userid }

  // return request(`manager/user/user-course`, params, "get",
  //   "resful",
  //   "json");
  return request("/api/manager/user/user-course", params, "get",
    "resful",
    "json");
};

/**
 * api请求参数：空，后端可以从token中解析出用户id等用于查询相关数据
 * api返回数据格式示例：
 * [{
    id:'1',
    time:'第一学期'
   }]
 */
export const getSemestersById = () => {
  return request("/semesters/get");
};

/**
 * api请求参数：当前学期，为空时表示全部学期
 */
export const getCoursesBySem = (sem) => {
  return request("/courses/post", sem, "post");
};

/**
 * 返回格式参考：
 * [{
 * id:xxx,
 * time:xxx,
 * title:xxx,
 * content:xxx
 * }]
 */
export const getMessagesByCourseId = (courseId) => {
  return request("/msg/list/msg/" + courseId);
  // 测试用
  return request("/msg/list/msg/" + 1001);
};

export const getAllMessages = (userId) => {
  return request("/msg/list/user/" + userId);
};
