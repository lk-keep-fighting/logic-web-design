import axios from "axios";
import { MenuProps } from "antd";
interface IApp {
    id: string
    title: string
    menus: MenuProps[]
}
export async function initApp(): Promise<IApp> {
    return (await axios.get('/setting/app.json')).data;
}