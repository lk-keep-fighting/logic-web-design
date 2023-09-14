import PageRender from "@/components/page-render"
import { Schema } from "amis";
import axios from "axios"
import { useEffect, useState } from "react"
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';

const Render = () => {
    const [config, setConfig] = useState<Schema>({ type: 'page' });
    useEffect(() => {
        axios.get('/setting/config/pages/logic-api.json').then(res => {
            setConfig(res.data)
        })
    }, [])
    return <PageRender config={config} />
}
export default Render;