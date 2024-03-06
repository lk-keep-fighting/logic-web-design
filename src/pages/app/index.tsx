import { useParams } from "@/.umi/exports";
import PageRender from "@/components/ui-render/page-render"
import PageRenderById from "@/components/ui-render/page-render/render-by-page-id";
import { Schema } from "amis";
import { useState } from "react";

const App = (props) => {
    const [config, setConfig] = useState<Schema>({ type: 'page' });
    const { pageId } = useParams()
    return <PageRenderById pageId={pageId || ''} data={props} />
}
export default App;