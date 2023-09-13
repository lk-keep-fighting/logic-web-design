import axios from "axios";
import { post } from "./http";

/**
 * 在服务端像函数一样运行，入参、出参
 * @param id 执行的逻辑编号
 * @param params 逻辑入参
 * @returns 
 */
export async function runLogicOnServerLikeFn(id: string, params: any) {
    return post(`/api/runtime/logic/v1/run-fn/${id}`,
        params,
        { headers: { 'Content-Type': 'application/json' } })
}
/**
 * 像api一样运行，返回包裹在data中，通过success判断状态
 * @param id 执行的逻辑编号
 * @param params 逻辑入参
 * @returns 
 */
export async function runLogicOnServerLikeApi(id: string, params: any) {
    return post(`/api/runtime/logic/v1/run-api/${id}`,
        params,
        { headers: { 'Content-Type': 'application/json' } })
}
/**
 * 获取逻辑对象
 * @param id 逻辑编号
 * @returns 
 */
export async function getLogic(id: string) {
    return axios.post(`/api/form/logic/query`, { ids: [id] }).then(res => {
        const jsonStr = res.data.result.items[0].configJson;
        return JSON.parse(jsonStr);
    })
}
export async function addLogic(data: any): Promise<string> {
    return axios.post(`/api/form/logic/add`, data).then(res => {
        const newId = res.data.result;
        return newId;
    })
}
export async function deleteLogic(id?: string): Promise<Boolean> {
    return axios.delete(`/api/form/logic/delete/${id}`).then(res => {
        return res.data.result;
    })
}

/**
 * 查询逻辑列表
 * @param page 页码
 * @param pageSize 页大小
 * @returns 
 */
export async function queryLogics(page: number = 1, pageSize: number = 10) {
    return axios.post(`/api/form/logic/query`, { page, pageSize }).then(res => res.data)
}
