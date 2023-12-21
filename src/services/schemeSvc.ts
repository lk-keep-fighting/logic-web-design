import axios from "axios";

export async function getPageJson(pageId: string): Promise<any> {
    return (await axios.get(`/setting/pages/${pageId}.json`)).data
}
export async function getFormJson(formId: string): Promise<any> {
    return (await axios.get(`/setting/forms/${formId}.json`)).data
}
export async function getSchemeJson(render: string, schemeId: string): Promise<any> {
    return (await axios.get(`/setting/${render}s/${schemeId}.json`)).data
}
