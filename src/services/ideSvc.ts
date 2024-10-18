import { get, post, put } from "@/utils/http";
import dayjs from "dayjs";

export async function publishLogicFromDevToTest(id: string) {
    return post(`/api/ide/pub/logic/dev-to-test${id}`);
}

export async function getLogic(id: string) {
    return get(`/api/ide/logic/${id}`).then(res => {
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
export async function getLogicInstanceById(id: string) {
    return get(`/api/ide/logic-instance/${id}`).then(res => {
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
                "dataIndex": "id",
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
/**
 * 通过逻辑编号与版本号获取逻辑配置
 * @param id 编号
 * @param version 版本号
 * @returns 
 */
export async function getLogicJsonByBak(id: string, version: string) {
    return post(`/api/ide/logic-baks`, {
        filters: [
            { dataIndex: 'id', values: [id], type: '=' },
            { dataIndex: 'version', values: [version], type: '=' }
        ]
    }).then(res => {
        const jsonStr = res.data.data.records[0].configJson;
        const json = JSON.parse(jsonStr);
        return json
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
        const jsonStr = logic.configJson;
        logic.configJson = JSON.parse(jsonStr);
        logic.configJson.id = logic.id;
        logic.configJson.name = logic.name;
        return logic
    })
}