import axios from "axios";

export async function runLogicOnServer(id: string, params: any) {
    return axios.post(`/api/runtime/logic/run/${id}`, params)
}