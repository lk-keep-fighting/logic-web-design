import axios from "axios";
import { MenuProps } from "antd";
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
        return (await axios.get(`/setting/apps/${appId}.json`)).data;
    }
    public async getIndexJson(): Promise<ISystem> {
        return (await axios.get('/setting/apps/index.json')).data;
    }
}
