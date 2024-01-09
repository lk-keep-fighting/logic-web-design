import FormRenderById from "@/components/form-render/render-by-form-id";
import { useParams } from "umi";

const FormRenderByIdPage = () => {
    window.enableAMISDebug = true;
    const { id } = useParams();
    if (id)
        return <FormRenderById formId={id} onSubmit={() => {
            console.log('提交到父级')
        }} />
    else return ''
}
export default FormRenderByIdPage;