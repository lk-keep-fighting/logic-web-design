import { message } from "antd";
import axios, { AxiosRequestConfig } from "axios";

// //处理axios返回常见的状态码
// axios.interceptors.response.use(
//     (res) => {
//         switch (res.status) {
//             case 401:
//                 message.error("未登录，请重新登录")
//                 break;
//             case 504:
//                 message.error("服务器异常，请稍后再试")
//                 break;
//             default:
//                 break;
//         }
//         return res.data
//     }
// )
export function get(url: string, options: AxiosRequestConfig) {
    return axios.get(url, options)
}

export function put(url: string, data: any, options: AxiosRequestConfig) {
    return axios.put(url, data, options)
}

export function delete_(url: string, options: AxiosRequestConfig) {
    return axios.delete(url, options)
}

export function post(url: string, data?: any, options?: AxiosRequestConfig) {
    return axios.post(url, data, options)
}