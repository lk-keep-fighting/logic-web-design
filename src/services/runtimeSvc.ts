import { GlobalData } from "@/global";
import { get } from "../utils/http";

export async function getEnvJson() {
    return get('/api/runtime/env').then(res => res.data.data)
        .then(envs => {
            GlobalData.setModel(envs.UI_CONFIG_MODEL);
            GlobalData.setEnv(JSON.stringify(envs))
            GlobalData.setApiUrlPrefix(envs.API_GATEWAY_PREFIX)
            GlobalData.setReryApi(envs.CUSTOM_RETRY_URL)
            return envs;
        })
}