import { localUtil } from "./utils/localUtil"

export var GlobalData = {
    setModel: (v: string) => {
        localUtil.setKey('model', v)
    },
    getModel: () => {
        return localUtil.getKey('model')
    }
}