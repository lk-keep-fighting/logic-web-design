import axios from "axios";

export async function getEnvJson() {
    return axios.get('/api/runtime/env').then(res => res.data.data)
}