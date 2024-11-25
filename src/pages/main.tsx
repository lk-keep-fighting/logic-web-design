import PageRenderById from "@/components/ui-render/page-render/render-by-page-id"
import AppSvc, { ISystem } from "@/services/appSvr"
import { useEffect, useState } from "react"

const Main = (props) => {
    const [systemInfo, setSystemInfo] = useState<ISystem>({})
    useEffect(() => {
        var appSvc = new AppSvc();
        appSvc.getSettingIndexJson().then(res => {
            appSvc.getIndexJson().then(sys => {
                setSystemInfo(sys);
            })
        })

    }, [])
    return <PageRenderById pageId="index" data={systemInfo} />
}
export default Main;