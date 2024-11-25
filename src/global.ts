import { localUtil } from "./utils/localUtil"

export var GlobalData = {
    setModel: (v: string) => {
        localUtil.setKey('model', v)
    },
    getModel: () => {
        return localUtil.getKey('model')
    },
    setEnv: (v: string) => {
        localUtil.setKey('env', v)
    },
    getEnv: () => {
        return localUtil.getKey('env')
    },
    setApiUrlPrefix: (v: string) => {
        localUtil.setKey('apiUrlPrefix', v)
    },
    getApiUrlPrefix: () => {
        return localUtil.getKey('apiUrlPrefix')
    },
    setReryApi: (v: string) => {
        if (v && v.length > 0) {
            localUtil.setKey('retryApi', v)
        } else
            localUtil.setKey('retryApi', '/api/runtime/logic/v1/retry-error-biz')
    },
    getReryApi: () => {
        return localUtil.getKey('retryApi')
    },

}