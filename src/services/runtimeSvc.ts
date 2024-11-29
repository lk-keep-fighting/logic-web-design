import { GlobalData } from "@/global";
import { get, post } from "../utils/http";
export class RuntimeSvc {
    static async getEnvJson() {
        return get('/api/runtime/env').then(res => res.data.data)
            .then(envs => {
                GlobalData.setModel(envs.UI_CONFIG_MODEL);
                GlobalData.setEnv(JSON.stringify(envs))
                GlobalData.setApiUrlPrefix(envs.API_GATEWAY_PREFIX)
                GlobalData.setReryApi(envs.CUSTOM_RETRY_URL)
                GlobalData.setReryApi(envs.CUSTOM_RETRY_URL)
                return envs;
            })
    }
    static async getRemoteRuntimeConfig() {
        return post('/api/ide/remote-runtimes').then(res => res.data)
            .then(res => {
                console.log('remote runtimes:', res.data)
                GlobalData.setRemoteRuntimes(JSON.stringify(res.data))
                return res;
            })
    }
}
