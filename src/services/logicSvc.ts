import { del, get, post } from "../utils/http";

/**
 * 像api一样运行，返回包裹在data中，通过success判断状态
 * @param id 执行的逻辑编号
 * @param params 逻辑入参
 * @returns 
 */
export async function runLogicOnServer(id: string, params: any, bizId: string, bizStartCode: string, model: string, headers?: any) {
    let url = '';
    switch (model) {
        case "biz":
            if (bizStartCode) url = `/api/runtime/logic/v1/biz/${id}/${bizStartCode}/${bizId}?debug=true`;
            else url = `/api/runtime/logic/v1/run-biz/${id}/${bizId}?debug=true`;
            break;
        default:
            url = `/api/runtime/logic/v1/run-api/${id}?debug=true`;
            break;
    }

    return post(url,
        params,
        { headers: { 'Content-Type': 'application/json', ...headers } })
}

/**
 * 通过业务标识与逻辑编号找到逻辑实例
 * @param id 
 * @returns 
 */
export async function getLogicInstanceWithBizId(logicId: string, bizId?: string) {
    return post(`/api/form/logic_instance/query`, {
        filters: [
            { dataIndex: 'logicId', values: [logicId], type: '=' },
            { dataIndex: 'bizId', values: [bizId], type: '=' }
        ]
    }).then(res => {
        const ins = res.data.result.items[0];
        return ins;
    })
}
export async function getLogicInstanceWithId(id: string) {
    return get(`/api/ide/logic-instance/${id}`).then(res => {
        const ins = res.data.data;
        return ins;
    })
}

export async function addLogic(data: any): Promise<string> {
    return post(`/api/form/logic/add`, data).then(res => {
        const newId = res.data.result;
        return newId;
    })
}
export async function deleteLogic(id?: string): Promise<Boolean> {
    return del(`/api/form/logic/delete/${id}`).then(res => {
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
    return post(`/api/form/logic/query`, { page, pageSize }).then(res => res.data)
}
