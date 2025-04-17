import { get, post, put } from "@/utils/http";
import { message } from "antd";
import dayjs from "dayjs";

export async function getLogic(id: string) {
    return get(`/api/ide/logic/${id}`).then(res => {
        const data = res.data?.data;
        if (data.configJson)
            data.configJson = JSON.parse(data.configJson);
        return data;
    });
}

export async function getRemoteLogic(runtime: string, id: string) {
    return get(`/api/ide/papi/${runtime}/api/ide/logic/${id}`).then(res => {
        const data = res.data?.data;
        data.configJson = JSON.parse(data.configJson);
        return data;
    });
}

export async function getLogicConfig(id: string) {
    return get(`/api/ide/logic/${id}/config`).then(res => res.data?.data);
}
export async function saveLogic(id: string, version: string, config: string) {
    return put(`/api/ide/logic/edit/${id}`, { version, configJson: config, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
}
export async function saveRemoteLogic(runtime: string, id: string, version: string, config: string) {
    return put(`/api/ide/papi/${runtime}/api/ide/logic/edit/${id}`, { version, configJson: config, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
}
export async function getLogicInstanceByBizId(logicId: string, bizId: string) {
    return get(`/api/ide/logic-instance/${logicId}/${bizId}`).then(res => {
        const ins = res.data.data;
        return ins;
    })
}
export async function getLogicInstanceById(id: string) {
    return get(`/api/ide/logic-instance/${id}`).then(res => {
        const ins = res.data.data;
        return ins;
    })
}
export async function getRemoteLogicInstanceById(runtime: string, id: string) {
    return get(`/api/ide/papi/${runtime}/api/ide/logic-instance/${id}`).then(res => {
        const ins = res.data.data;
        return ins;
    })
}
/**
 * 通过业务标识与逻辑编号找到逻辑实例
 * @param id 
 * @returns 
 */
export async function getLogicLogsByLogicIns(logicIns: any) {
    return post(`/api/ide/logic-logs`, {
        filters: [
            { dataIndex: 'logicId', values: [logicIns.logicId], type: '=' },
            { dataIndex: 'bizId', values: [logicIns.bizId], type: '=' }
        ],
        pageSize: 1000,
        orderBy: [
            {
                "dataIndex": "serverTime",
                "desc": true
            }
        ]
    }).then(res => {
        const logs = res.data.data.records;
        if (logs) {
            logs.map(v => {
                if (v.itemLogs)
                    v.itemLogs = JSON.parse(v.itemLogs);
            })
        }
        return logs;
    })
}
export async function getRemoteLogicLogsByLogicIns(runtime: string, logicIns: any) {
    return post(`/api/ide/papi/${runtime}/api/ide/logic-logs`, {
        filters: [
            { dataIndex: 'logicId', values: [logicIns.logicId], type: '=' },
            { dataIndex: 'bizId', values: [logicIns.bizId], type: '=' }
        ],
        pageSize: 1000,
        orderBy: [
            {
                "dataIndex": "serverTime",
                "desc": true
            }
        ]
    }).then(res => {
        const logs = res.data.data.records;
        if (logs) {
            logs.map(v => {
                if (v.itemLogs)
                    v.itemLogs = JSON.parse(v.itemLogs);
            })
        }
        return logs;
    })
}
export async function getLogicLogsById(logicLogId: any) {
    return post(`/api/ide/logic-logs`, {
        filters: [
            { dataIndex: 'id', values: [logicLogId], type: '=' }
        ],
        pageSize: 1000
    }).then(res => {
        const logs = res.data.data.records;
        if (logs && logs.length > 0) {
            if (logs[0].itemLogs)
                logs[0].itemLogs = JSON.parse(logs[0].itemLogs);
        }
        return logs[0];
    })
}
export async function getRemoteLogicLogsById(runtime: string, logicLogId: any) {
    return post(`/api/ide/papi/${runtime}/api/ide/logic-logs`, {
        filters: [
            { dataIndex: 'id', values: [logicLogId], type: '=' }
        ],
        pageSize: 1000
    }).then(res => {
        const logs = res.data.data.records;
        if (logs && logs.length > 0) {
            if (logs[0].itemLogs)
                logs[0].itemLogs = JSON.parse(logs[0].itemLogs);
        }
        return logs[0];
    })
}

/**
 * 通过逻辑编号与版本号获取逻辑配置
 * @param id 编号
 * @param version 版本号
 * @returns 
 */
export async function getLogicByBak(id: string, version: string) {
    return post(`/api/ide/logic-baks`, {
        filters: [
            { dataIndex: 'id', values: [id], type: '=' },
            { dataIndex: 'version', values: [version], type: '=' }
        ]
    }).then(res => {
        let logic = res.data.data.records[0];
        if (logic) {
            const jsonStr = logic.configJson;
            logic.configJson = JSON.parse(jsonStr);
            logic.configJson.id = logic.id;
            logic.configJson.name = logic.name;
        } else {
            message.error('对应的逻辑版本配置不存在！', 3)
        }
        return logic
    }).catch(err => {
        console.log(err);
    })
}
export async function getRemoteLogicByBak(runtime: string, id: string, version: string) {
    return post(`/api/ide/papi/${runtime}/api/ide/logic-baks`, {
        filters: [
            { dataIndex: 'id', values: [id], type: '=' },
            { dataIndex: 'version', values: [version], type: '=' }
        ]
    }).then(res => {
        let logic = res.data.data.records[0];
        const jsonStr = logic.configJson;
        logic.configJson = JSON.parse(jsonStr);
        logic.configJson.id = logic.id;
        logic.configJson.name = logic.name;
        return logic
    })
}

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

export async function runRemoteLogicOnServer(runtime: string, id: string, params: any, bizId: string, bizStartCode: string, model: string, headers?: any) {
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
    url = `/api/ide/papi/${runtime}` + url;
    return post(url,
        params,
        { headers: { 'Content-Type': 'application/json', ...headers } })
}