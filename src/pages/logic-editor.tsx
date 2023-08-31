import { Logic } from "@/components/step-flow-core/lasl/meta-data";
import { X6Graph } from "@/components/step-flow-editor";
import { Spin, message } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "umi";

const formProvider = async (type: string) => {
    const res = await axios.get(`/setting/node-form/${type}.json`);
    console.log(res.data);
    return res.data;
}


const LogicEditor = () => {
    const { id } = useParams();
    const [config, setConfig] = useState<Logic>();
    const [loading, setLoading] = useState(false);
    const handleSave = useCallback((logic: Logic) => {
        logic.id = id;
        setLoading(true);
        setConfig(logic)
        axios.put(`/api/form/logic/edit/${logic.id}`, { configJson: JSON.stringify(logic) }).then(res => {
            setLoading(false)
            // setConfig(logic)
            message.success('保存成功')
        }).catch(err => {
            setLoading(false)
            console.log('err')
            console.log(err)
            message.error('保存失败')
        })
    }, [])
    useEffect(() => {
        setLoading(true);
        axios.post(`/api/form/logic/query`, { ids: [id] }).then(res => {
            console.log('res.data')
            const { data } = res;
            const configJson = JSON.parse(data.result.items[0].configJson);
            configJson.id = id;//默认使用当前id作为配置id，用于复用配置时简化更新操作
            setConfig(configJson)
            setLoading(false);
            console.log(res.data)
        }).catch(err => {
            setLoading(false);
            console.log('err')
            console.log(err)
        })
    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <X6Graph
                    config={config}
                    onSave={handleSave}
                    configSchemaProvider={formProvider}
                />
            </Spin>
        </div>
    );
};

export default LogicEditor;
