import PageRenderById from "@/components/page-render/render-by-page-id"
import AppSvc, { ISystem } from "@/services/appSvr"
import { useEffect, useState } from "react"

const Main = (props) => {
    const [systemInfo, setSystemInfo] = useState<ISystem>({})
    useEffect(() => {
        new AppSvc().getIndexJson().then(sys => {
            setSystemInfo(sys);
        })
    }, [])
    return <PageRenderById pageId="index" data={systemInfo} />
}
export default Main;