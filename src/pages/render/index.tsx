import { useEffect, useState } from "react"
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';
import { useParams } from "umi";
import PageRenderById from "@/components/ui-render/page-render/render-by-page-id";
import { getEnvJson } from "@/services/runtimeSvc";
import { GlobalData } from "@/global";

const Render = (props) => {
    const { pageId } = useParams()
    return <PageRenderById pageId={pageId}/>
}
export default Render;