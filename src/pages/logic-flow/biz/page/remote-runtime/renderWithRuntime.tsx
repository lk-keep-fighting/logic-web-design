import PageRenderById from "@/components/ui-render/page-render/render-by-page-id";
import { useParams } from "umi";

const Runtime = (props) => {
    const { pageId, runtime } = useParams()
    return <PageRenderById pageId={pageId || ''} data={{ ...props, runtime: runtime }} />
}
export default Runtime;