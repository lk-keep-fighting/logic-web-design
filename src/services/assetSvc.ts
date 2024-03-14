import axios from "axios";
export default class AssetSvc {
    public static async getAssetFromDb(type: 'app' | 'page' | 'form' | string, code: string): Promise<any> {
        var res = (await axios.get(`/api/ide/settings/asset/${type}/${code}`)).data;
        return JSON.parse(res.data.config);
    }
    public static async saveAssetToDb(type: 'app' | 'page' | 'form' | string, code: string, config: any): Promise<any> {
        return axios.post(`/api/ide/settings/asset/${type}/${code}`, config);
    }
}
