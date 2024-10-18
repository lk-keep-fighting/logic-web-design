import { del, post } from "../utils/http";

/**
 * 获取逻辑对象
 * @param id 逻辑编号
 * @returns 
 */
export async function getSwagger(id: string) {
    return post(`/api/form/swagger/query`, { ids: [id] }).then(res => {
        return res.data.result.items[0];
    })
}
export async function addSwagger(id?: string, name?: string): Promise<string> {
    return post(`/api/form/swagger/add`, { id, name }).then(res => {
        const newId = res.data.result;
        return newId;
    })
}
export async function deleteSwagger(id?: string): Promise<Boolean> {
    return del(`/api/form/swagger/delete/${id}`).then(res => {
        return res.data.result;
    })
}

/**
 * 查询逻辑列表
 * @param page 页码
 * @param pageSize 页大小
 * @returns 
 */
export async function querySwaggers(page: number = 1, pageSize: number = 10) {
    return post(`/api/form/swagger/query`, { page, pageSize }).then(res => res.data)
}
