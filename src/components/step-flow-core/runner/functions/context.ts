import axios, { Axios } from 'axios'
/**
 * 函数上下文
 */
export default class FnContext {
    [key: string]: any;
    _par: Object;
    _ret: Object;
    _var: Object;
    _env: Object;
    _lastRet: any;
    // _axios: Axios;
    constructor(paramJson: Object = {},
        returnJson: Object = {},
        varJson: Object = {},
        envJson: Object = {},
    ) {
        this._par = paramJson;
        this._ret = returnJson;
        this._var = varJson;
        this._env = envJson;
        // this._axios = new Axios();
    }
}