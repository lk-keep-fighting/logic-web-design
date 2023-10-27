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
export async function runLogicOnServerLikeApi(id: string, params: any, bizId: string) {
    let url;
    if (bizId) {
        url = `/api/runtime/logic/v1/runBiz/${id}/${bizId}?debug=true`;
    } else {
        url = `/api/runtime/logic/v1/run-api/${id}?debug=true`;
    }
    return post(url,
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
/**
 * 通过逻辑编号与版本号获取逻辑配置
 * @param id 编号
 * @param version 版本号
 * @returns 
 */
export async function getLogicJsonByBak(id: string, version: string) {
    return axios.post(`/api/form/logic_bak/query`, {
        filters: [
            { dataIndex: 'id', values: [id], type: 'and' },
            { dataIndex: 'version', values: [version], type: 'and' }
        ]
    }).then(res => {
        const jsonStr = res.data.result.items[0].configJson;
        return JSON.parse(jsonStr);
    })
}
/**
 * 通过业务标识与逻辑编号找到逻辑实例
 * @param id 
 * @returns 
 */
export async function getLogicInstanceWithBizId(logicId: string, bizId?: string) {
    return axios.post(`/api/form/logic_instance/query`, {
        filters: [
            { dataIndex: 'logicId', values: [logicId], type: 'and' },
            { dataIndex: 'bizId', values: [bizId], type: 'and' }
        ]
    }).then(res => {
        const ins = res.data.result.items[0];
        return ins;
    })
}
export async function getLogicInstanceWithId(id: string) {
    return axios.get(`/api/form/logic_instance/get/${id}`).then(res => {
        const ins = res.data.result;
        return ins;
    })
}
/**
 * 通过业务标识与逻辑编号找到逻辑实例
 * @param id 
 * @returns 
 */
export async function getLogicLogsByLogicIns(logicIns: any) {
    return axios.post(`/api/form/logic_log/query`, {
        filters: [
            { dataIndex: 'logicId', values: [logicIns.ogicId], type: 'and' },
            { dataIndex: 'bizId', values: [logicIns.bizId], type: 'and' }
        ],
        orderBy: [
            {
                "dataIndex": "serverTime",
            }
        ]
    }).then(res => {
        const logs = res.data.result.items;
        if (logs) {
            logs.map(v => {
                if (v.itemLogs)
                    v.itemLogs = JSON.parse(v.itemLogs);
            })
        }
        return logs;
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
