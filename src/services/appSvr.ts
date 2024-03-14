import axios from "axios";
import { MenuProps } from "antd";
import { GlobalData } from "@/global";
import AssetSvc from "./assetSvc";
export type IApp = {
    id: string
    title: string
    menus: MenuProps[]
}
export type ISystem = {
    id: string
    apps: IApp[]
    title: string
}
export default class AppSvc {
    public async initApp(): Promise<IApp> {
        return (await axios.get('/setting/app.json')).data;
    }
    public async getAppJson(appId: string): Promise<IApp> {
        if (GlobalData.getModel() == 'db') {
            return AssetSvc.getAssetFromDb('app', appId)
        } else
            return (await axios.get(`/setting/apps/${appId}.json`)).data;
    }
    public async getIndexJson(): Promise<ISystem> {
        if (GlobalData.getModel() == 'db') {
            return AssetSvc.getAssetFromDb('app', 'index')
        }
        else
            return (await axios.get('/setting/apps/index.json')).data;

    }
    public async getSettingIndexJson(): Promise<typeof GlobalData> {
        // var res = (await axios.get('/setting/index.json')).data;
        var res = (await axios.get('/api/runtime/env')).data;
        GlobalData.setModel(res.data.UI_CONFIG_MODEL);
        return GlobalData;
    }
}
