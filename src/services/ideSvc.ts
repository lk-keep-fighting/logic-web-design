import axios from "axios";
import dayjs from "dayjs";

export async function publishLogicFromDevToTest(id: string) {
    return axios.post(`/api/ide/pub/logic/dev-to-test${id}`);
}

export async function getLogic(id: string) {
    return axios.get(`/api/ide/logic/${id}`);
}

export async function getLogicConfig(id: string) {
    return axios.get(`/api/ide/logic/${id}/config`).then(res => res.data?.data);
}
export async function saveLogic(id: string, version: string, config: string) {
    return axios.put(`/api/ide/logic/edit/${id}`, { version, configJson: config, updateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') });
}
export async function getLogicInstanceById(id: string) {
    return axios.get(`/api/ide/logic-instance/${id}`).then(res => {
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
    return axios.post(`/api/ide/logic-logs`, {
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
/**
 * 通过逻辑编号与版本号获取逻辑配置
 * @param id 编号
 * @param version 版本号
 * @returns 
 */
export async function getLogicJsonByBak(id: string, version: string) {
    return axios.post(`/api/ide/logic-baks`, {
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
    return axios.post(`/api/ide/logic-baks`, {
        filters: [
            { dataIndex: 'id', values: [id], type: '=' },
            { dataIndex: 'version', values: [version], type: '=' }
        ]
    }).then(res => {
        let logic = res.data.data.records[0];
        const jsonStr = logic.configJson;
        logic.configJson = JSON.parse(jsonStr);
        return logic
    })
}