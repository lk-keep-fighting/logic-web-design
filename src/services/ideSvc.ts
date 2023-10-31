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