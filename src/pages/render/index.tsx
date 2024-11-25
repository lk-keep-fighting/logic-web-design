import { useEffect, useState } from "react"
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';
import { useParams } from "umi";
import PageRenderById from "@/components/ui-render/page-render/render-by-page-id";
import { getEnvJson } from "@/services/runtimeSvc";
import { GlobalData } from "@/global";

const Render = (props) => {
    const [urlPrefix, setUrlPrefix] = useState<string>();
    const [envs, setEnvs] = useState<{}>();
    const { pageId } = useParams()
    useEffect(() => {
        if (pageId)
            getEnvJson().then(data => {
                setUrlPrefix(GlobalData.getApiUrlPrefix())
                setEnvs(JSON.parse(GlobalData.getEnv()))
            })
    }, [pageId])
    return <PageRenderById urlPrefix={urlPrefix} pageId={pageId} data={{ envs: envs }} />
}
export default Render;