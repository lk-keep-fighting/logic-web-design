import PageRender from "@/components/page-render"
import { Schema } from "amis";
import axios from "axios"
import { useEffect, useState } from "react"
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';
import { getPageJson } from "@/services/schemeSvc";
import { useParams } from "umi";
import PageRenderById from "@/components/page-render/render-by-page-id";

const Render = (props) => {
    const [config, setConfig] = useState<Schema>({ type: 'page' });
    const { pageId } = useParams()
    useEffect(() => {
        if (pageId)
            getPageJson(pageId).then(res => {
                setConfig(res)
            })
    }, [pageId])
    // return <PageRenderById config={config} />
    return <PageRenderById pageId={pageId} data={props} />
}
export default Render;