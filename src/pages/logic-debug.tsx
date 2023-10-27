import { Logic } from "@/components/step-flow-core/lasl/meta-data";
import { DebugLogic } from "@/components/step-flow-editor";
import { getLogic, getLogicInstanceWithBizId, getLogicInstanceWithId, getLogicJsonByBak, getLogicLogsByLogicIns } from "@/services/logicSvc";
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

const LogicDebug = () => {
    const { id } = useParams();
    const [config, setConfig] = useState<Logic>();
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [debugLogs, setDebugLogs] = useState([])
    const [logicIns, setLogicIns] = useState();
    useEffect(() => {
        setLoading(true);
        if (id)
            getLogicInstanceWithId(id).then(res => {
                if (res) {
                    setLogicIns(res);
                    setLoading(true);
                    getLogicJsonByBak(res.logicId, res.version).then(res => {
                        const configJson = res;
                        configJson.id = id;//默认使用当前id作为配置id，用于复用配置时简化更新操作
                        setConfig(configJson)
                        setLoading(false);
                    }).catch(err => {
                        setLoading(false);
                        console.log('err')
                        console.log(err)
                    })
                }
            })
    }, [id])
    useEffect(() => {
        if (logicIns)
            getLogicLogsByLogicIns(logicIns).then(res => {
                if (res) {
                    setDebugLogs(res)
                }
            })
    }, [logicIns])
    return (
        <div>
            <Spin spinning={loading}>
                <DebugLogic
                    btns={[
                        <span>是否完成：{logicIns?.isOver ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <FrownOutlined twoToneColor='red' />}<Divider type='vertical' /></span>,
                        <Button onClick={() => {
                            getLogicInstanceWithId(id).then(res => {
                                if (res) {
                                    setLogicIns(res);
                                }
                            })
                        }}>
                            <SyncOutlined />
                            刷新状态
                        </Button>,
                        <Button onClick={() => {
                            getLogicLogsByLogicIns(logicIns).then(res => {
                                if (res) {
                                    setDebugLogs(res)
                                }
                            })
                        }}>
                            <ProfileOutlined />
                            刷新日志
                        </Button>,
                        <span style={{ color: 'red' }}>逻辑版本：{logicIns?.version}</span>
                    ]}
                    nextId={logicIns?.nextId}
                    config={config}
                    configSchemaProvider={formProvider}
                    itemLogSchemaProvider={logFormProvider}
                    debugLogs={debugLogs}
                />
            </Spin>
        </div>
    );
};

export default LogicDebug;
