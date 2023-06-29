import axios from 'axios';
import qs from 'qs'
import store from '/src/store/index.js'
import router from '/src/router/index.js'
import { ElMessage } from 'element-plus';
//封装好的axios方法
export async function request(url,//请求地址
    params, //参数
    method,//请求方法
    type, //请求类型（params，resful，paramsSerializer）
    header, //请求头（）
) {
    let baseurl
    if (import.meta.env.PROD)
        baseurl = "http://10.195.12.78:9000/"
    else if (url.includes('/eduoss/fileoss'))
        baseurl = "http://10.195.12.78:9000"
    else
        baseurl = "/api"
    //创建axios实例
    const instance = axios.create({
        baseURL: baseurl,
        timeout: 2000,
        withCredentials: false,
    })

    // axios request拦截器
    instance.interceptors.request.use(
        config => {

            if (store.state.token && !url.includes("/ucenter/user/login") && !url.includes("register") && !url.includes("download") && !url.includes("get-login-info"))
                config.headers.token = store.state.token
            return config
        },
        err => {
            return Promise.reject(err)
        }
    )
    // aixos response拦截器
    instance.interceptors.response.use(
        res => {
            return res
        },
        err => {
            if (err.response)
                if (err.response.status === 401) {
                    ElMessage.warning("登录会话过期，请重新登录!")
                    setTimeout(() => {
                        router.replace({ name: "登录" })
                    }, 2000);

                }
            return Promise.reject(err)
        }
    )
    //具体操作
    if (method && method == 'post') {
        if (type && type == "params") {
            if (params) {
                // return instance.post(url, params)
                if (header == 'json') {
                    return instance.request({
                        url,
                        data: params,
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                    })
                } else if (type == 'paramsSerializer') {
                    return instance.request({
                        url,
                        data: qs.stringify(params, { arrayFormat: 'repeat' }),
                        method: 'post',
                    })
                }
                else {
                    return instance.request({
                        url,
                        data: params,
                        method: 'post',
                    })
                }
            }
            else {
                return instance.post(url)
            }
        }
        else if (type == 'paramsSerializer') {
            return instance.request({
                url,
                data: qs.stringify(params, { arrayFormat: 'repeat' }),
                method: 'post',

            }).catch(err => { console.log(err) })
        }
        else {
            // resful的形式
            if (params) {

                for (var key in params) {
                    // 拼接url
                    url = url + '/' + params[key];
                }
            }
            return instance.post(url).catch(err => { console.log(err) });
        }
    } else if (!method || method == 'get') {
        if (type == 'resful' || !type) {
            // resful的形式
            if (params) {
                for (var key in params) {
                    // 拼接url
                    url = url + '/' + params[key];
                }
            }
            return instance.get(url).catch(err => { console.log(err) });
        } else if (type == 'params') {
            params = {
                params: params
            }
            return instance.get(url, params).catch((err) => {
                console.log(err)
            })
        }
    } else if (method && method == 'put') {
        if (params) {
            return instance.put(url, params).catch(err => { console.log(err) })
        } else {
            return instance.put(url).catch(err => { console.log(err) })
        }
    } else if (method && method == 'delete') {
        // resful的形式
        if (params) {
            for (var key in params) {
                // 拼接url
                url = url + '/' + params[key];
            }
        }
        return instance.delete(url).catch(err => { console.log(err) });
    }
}