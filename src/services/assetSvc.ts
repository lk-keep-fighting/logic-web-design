import { get, post } from "../utils/http";
export default class AssetSvc {
    public static async getAssetFromDb(type: 'app' | 'page' | 'form' | string, code: string): Promise<any> {
        var res = (await get(`/api/ide/settings/asset/${type}/${code}`)).data;
        return JSON.parse(res.data.config);
    }
    public static async saveAssetToDb(type: 'app' | 'page' | 'form' | string, code: string, config: any): Promise<any> {
        return post(`/api/ide/settings/asset/${type}/${code}`, config);
    }
    public static async getRemoteAssetFromDb(remoteRuntime: string, type: 'app' | 'page' | 'form' | string, code: string): Promise<any> {
        var res = (await get(`/api/ide/papi/${remoteRuntime}/api/ide/settings/asset/${type}/${code}`)).data;
        return JSON.parse(res.data.config);
    }
    public static async saveRemoteAssetToDb(remoteRuntime: string, type: 'app' | 'page' | 'form' | string, code: string, config: any): Promise<any> {
        return post(`/api/ide/papi/${remoteRuntime}/api/ide/settings/asset/${type}/${code}`, config);
    }
}
