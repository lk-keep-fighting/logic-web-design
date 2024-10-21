import { GlobalData } from "@/global";
import AssetSvc from "./assetSvc";
import { get } from "../utils/http";

export async function getPageJson(pageId: string): Promise<any> {
    debugger;
    if (GlobalData.getModel() == 'db') {
        return AssetSvc.getAssetFromDb('page', pageId)
    } else
        return (await get(`/logic/setting/pages/${pageId}.json`)).data
}
export async function getFormJson(formId: string): Promise<any> {
    if (GlobalData.getModel() == 'db') {
        return AssetSvc.getAssetFromDb('form', formId)
    } else
        return (await get(`/logic/setting/forms/${formId}.json`)).data
}
export async function getSchemeJson(render: string, schemeId: string): Promise<any> {
    if (GlobalData.getModel() == 'db') {
        return AssetSvc.getAssetFromDb(render, schemeId);
    } else
        return (await get(`/logic/setting/${render}s/${schemeId}.json`)).data
}
export async function saveSchemeJson(render: string, schemeId: string, config: any): Promise<any> {
    if (GlobalData.getModel() == 'db') {
        return AssetSvc.saveAssetToDb(render, schemeId, config);
    }
}
