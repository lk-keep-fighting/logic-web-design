import { MenuProps } from "antd";
import { GlobalData } from "@/global";
import AssetSvc from "./assetSvc";
import { get } from "../utils/http";
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
    runtime: string;
    constructor(_runtime: string) {
        this.runtime = _runtime
    }
    public isValidRuntime(): boolean {
        return this.runtime != undefined && this.runtime != '' && this.runtime != null;
    }
    public async initApp(): Promise<IApp> {
        return (await get('/setting/app.json')).data;
    }
    public async getAppJson(appId: string): Promise<IApp> {
        return (await get(`/logic/setting/apps/${appId}.json`)).data;
    }
    public async getIndexJson(): Promise<ISystem> {
        return (await get('/logic/setting/apps/index.json')).data;
    }
}
