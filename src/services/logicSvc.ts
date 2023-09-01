import axios from "axios";
import { post } from "./http";

/**
 * 在服务端运行逻辑
 * @param id 执行的逻辑编号
 * @param params 逻辑入参
 * @returns 
 */
export async function runLogicOnServer(id: string, params: any) {
    return post(`/api/runtime/logic/run/${id}`, params)
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
/**
 * 查询逻辑列表
 * @param page 页码
 * @param pageSize 页大小
 * @returns 
 */
export async function queryLogics(page: number = 1, pageSize: number = 10) {
    return axios.post(`/api/form/logic/query}`, { page, pageSize }).then(res=>res.data.result)
}
