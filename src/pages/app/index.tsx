import { useParams } from "@/.umi/exports";
import PageRender from "@/components/page-render"
import PageRenderById from "@/components/page-render/render-by-page-id";
import { Schema } from "amis";
import { useState } from "react";

const App = (props) => {
    const [config, setConfig] = useState<Schema>({ type: 'page' });
    const { pageId } = useParams()
    return <PageRenderById pageId={pageId || ''} data={props} />
}
export default App;