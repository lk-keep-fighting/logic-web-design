import PageRender from "@/components/page-render"
import { Schema } from "amis";
import axios from "axios"
import { useEffect, useState } from "react"
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';
import { getPageJson } from "@/services/pageSvr";
import { useParams } from "umi";

const Render = () => {
    const [config, setConfig] = useState<Schema>({ type: 'page' });
    const { pageId } = useParams()
    useEffect(() => {
        if (pageId)
            getPageJson(pageId).then(res => {
                setConfig(res)
            })
    }, [pageId])
    return <PageRender config={config} />
}
export default Render;