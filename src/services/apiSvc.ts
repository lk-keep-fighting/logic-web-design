import axios from "axios";
import { post } from "./http";

/**
 * 获取逻辑对象
 * @param id 逻辑编号
 * @returns 
 */
export async function getApi(id: string) {
    return axios.post(`/api/form/apis/query`, { ids: [id] }).then(res => {
        const jsonStr = res.data.result.items[0].configJson;
        return JSON.parse(jsonStr);
    })
}
export async function addApi(id?: string, name?: string): Promise<string> {
    return axios.post(`/api/form/apis/add`, { id, name }).then(res => {
        const newId = res.data.result;
        return newId;
    })
}
export async function deleteApi(id?: string): Promise<Boolean> {
    return axios.delete(`/api/form/apis/delete/${id}`).then(res => {
        return res.data.result;
    })
}

/**
 * 查询逻辑列表
 * @param page 页码
 * @param pageSize 页大小
 * @returns 
 */
export async function queryApis(page: number = 1, pageSize: number = 10) {
    return axios.post(`/api/form/apis/query`, { page, pageSize }).then(res => res.data)
}
