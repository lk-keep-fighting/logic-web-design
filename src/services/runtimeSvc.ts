import { get } from "../utils/http";

export async function getEnvJson() {
    return get('/api/runtime/env').then(res => res.data.data)
}