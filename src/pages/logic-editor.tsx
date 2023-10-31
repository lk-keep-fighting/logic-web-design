import { Logic } from "@/components/step-flow-core/lasl/meta-data";
import { X6Graph } from "@/components/step-flow-editor";
import { getLogic } from "@/services/logicSvc";
import { Spin, message } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "umi";
import dayjs, { Dayjs } from 'dayjs';
import { getLogicConfig, saveLogic } from "@/services/ideSvc";

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
        saveLogic(logic.id, logic.version, JSON.stringify(logic)).then(res => {
            setLoading(false)
            message.success('保存成功')
            console.log('save logic')
            console.log(logic)
        }).catch(err => {
            setLoading(false)
            console.log('err')
            console.log(err)
            message.error('保存失败')
        })
    }, [])
    useEffect(() => {
        setLoading(true);
        getLogicConfig(id).then(res => {
            const configJson = res;
            configJson.id = id;//默认使用当前id作为配置id，用于复用配置时简化更新操作
            setConfig(configJson)
            setLoading(false);
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
