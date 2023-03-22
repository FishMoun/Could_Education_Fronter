import axios from 'axios';
import qs from 'qs'
import store from '/src/store/index.js'
//封装好的axios方法
export function request(url,//请求地址
    params, //参数
    method,//请求方法
    type, //请求类型（params，resful，paramsSerializer）
    header, //请求头（）
    serviceURL//请求的服务类型
) {
    if (serviceURL === undefined)
        serviceURL = '/cloudspace'
    //创建axios实例
    const instance = axios.create({
        baseURL: serviceURL,
        timeout: 2000,
        withCredentials: true,
    })

    // axios request拦截器
    instance.interceptors.request.use(
        config => {
            //访问除了用户中心以外的服务携带accesstoken
            // if (store.state.access_token && serviceURL !== "/ucenter")
            //     config.headers.Authorization = "bearer" + " " + store.state.access_token
            return config
        },
        err => { return Promise.reject(err) }
    )
    // aixos response拦截器
    instance.interceptors.response.use(
        res => { return res },
        err => { return Promise.reject(err) }
    )
    //具体操作
    if (method && method == 'post') {
        if (type && type == "params") {
            if (params) {
                if (header == 'json') {

                    return instance.request({
                        url,
                        data: params,
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                    }).catch(err => { console.log(err) })
                }
            }
            else {
                return instance.post(url).catch(err => { console.log(err) })
            }
        }
        else if (type == 'paramsSerializer') {
            return instance.request({
                url,
                data: qs.stringify(params, { arrayFormat: 'repeat' }),
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
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
            return instance.get(url, params).catch(err => { console.log(err) })
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