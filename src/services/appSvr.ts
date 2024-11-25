import { MenuProps } from "antd";
import { GlobalData } from "@/global";
import AssetSvc from "./assetSvc";
import { get } from "../utils/http";
import { getEnvJson } from "./runtimeSvc";
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
        return (await get('/setting/app.json')).data;
    }
    public async getAppJson(appId: string): Promise<IApp> {
        if (GlobalData.getModel() == 'db') {
            return AssetSvc.getAssetFromDb('app', appId)
        } else
            return (await get(`/logic/setting/apps/${appId}.json`)).data;
    }
    public async getIndexJson(): Promise<ISystem> {
        if (GlobalData.getModel() == 'db') {
            return AssetSvc.getAssetFromDb('app', 'index')
        }
        else
            return (await get('/logic/setting/apps/index.json')).data;

    }
    public async getSettingIndexJson(): Promise<typeof GlobalData> {
        await getEnvJson();
        return GlobalData;
    }
}
