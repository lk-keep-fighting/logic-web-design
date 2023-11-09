import { Logic } from "@/components/step-flow-core/lasl/meta-data";
import LogicViewer from "@/components/step-flow-editor/x6-graph/view/logicViewer";
import { getLogicInstanceById, getLogicLogsByLogicIns, getLogicJsonByBak, getLogicByBak } from "@/services/ideSvc";
import { } from "@/services/logicSvc";
import { CheckCircleTwoTone, FrownOutlined, PlayCircleFilled, PlayCircleTwoTone, ProfileOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Divider, Spin, message } from "antd";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "umi";

const formProvider = async (type: string) => {
    const res = await axios.get(`/setting/node-form/${type}.json`);
    console.log(res.data);
    return res.data;
}
const logFormProvider = async (type: string) => {
    const res = await axios.get(`/setting/node-log/${type}.json`).catch(err => err);
    console.log(res.data);
    if (res.data)
        return res.data;
    else {
        return (await axios.get(`/setting/node-log/_def.json`)).data;
    }
}

const LogicViewerPage = () => {
    const { id, version } = useParams();
    const [logicData, setLogicData] = useState<any>();
    // const [config, setConfig] = useState<Logic>();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        if (id)
            getLogicByBak(id, version).then(res => {
                const logicData = res;
                logicData.configJson.id = id;//默认使用当前id作为配置id，用于复用配置时简化更新操作
                setLogicData(logicData)
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                console.log('err')
                console.log(err)
            })
    }, [id])
    return (
        <div>
            <Spin spinning={loading}>
                <LogicViewer
                    btns={[
                        <span style={{ marginLeft: '25px', color: 'red' }}>逻辑版本：{version}</span>,
                        <span style={{ marginLeft: '10px' }}>更新时间：{logicData?.updateTime}</span>,
                        <span style={{ marginLeft: '10px' }}>名称：{logicData?.name}</span>,
                    ]}
                    nextId={''}
                    config={logicData?.configJson}
                    configSchemaProvider={formProvider}
                    itemLogSchemaProvider={logFormProvider}
                />
            </Spin>
        </div>
    );
};

export default LogicViewerPage;
