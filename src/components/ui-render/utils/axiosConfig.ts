import { Axios } from "axios";

export async function axiosSet(axios: Axios) {
    axios.interceptors.response.use(response => {
        console.log('axios response')
        console.log(response)
        if (response && response.data) {
            console.log('--请求未报错，适配status=0');
            if (!response.data.error) response.data.error = { code: 0 };//修复amis会自动取error.code作为status
            // response.data.status = 0;
            if (response.data.code == 500) response.data.error = { code: 500, message: response.data.msg }
            //适配表格数据源
            if (response.data.data && response.data.data.records) response.data.data.items = response.data.data.records;
            return response
        } else {
            // 数据为空
            console.log('--返回数据为空，判断为异常');
            console.log(response.data);
            return Promise.reject(new Error(response.data.message))
        }
    }, error => {
        console.log('捕捉axios error')
        console.log(error);
        if (error.response && error.response.data) {
            // 数据正常，进行的逻辑功能
            const rep = error.response;
            console.log('--data有返回值，判定为业务异常，继续返回response,适配status=500！');
            if (error.response.data.error?.code == 0) error.response.data.error.code = 500
            console.log(rep);
            // 对响应错误做点什么
            return rep;
        }
        // 对响应错误做点什么
        return Promise.reject(error)
    })
}