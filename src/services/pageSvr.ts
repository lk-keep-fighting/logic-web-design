import axios from "axios";

export async function getPageJson(pageId: string): Promise<any> {
    return (await axios.get(`/setting/pages/${pageId}.json`)).data
}