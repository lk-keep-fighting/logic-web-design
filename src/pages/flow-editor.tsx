import { X6Graph } from "@/components/step-flow-editor";
import axios from "axios";

const formProvider = async (type: string) => {
    const res = await axios.get(`/setting/node-form/${type}.json`);
    console.log(res.data);
    return res.data;
}
const FlowEditor = () => {
    return (
        <div>
            <X6Graph
             configSchemaProvider={formProvider}
            />
        </div>
    );
};

export default FlowEditor;
