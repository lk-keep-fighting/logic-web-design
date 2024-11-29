import PageRenderById from "@/components/ui-render/page-render/render-by-page-id"
import { ISystem } from "@/services/appSvr"
import { RuntimeSvc } from "@/services/runtimeSvc"
import { useEffect, useState } from "react"

const RemoteRuntimes = (props) => {
    const [systemInfo, setSystemInfo] = useState<ISystem>({})
    return < PageRenderById pageId="remote-runtimes-main" data={systemInfo} />
}
export default RemoteRuntimes;