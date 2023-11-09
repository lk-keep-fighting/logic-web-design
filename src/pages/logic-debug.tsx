import { Logic } from "@/components/step-flow-core/lasl/meta-data";
import { DebugLogic } from "@/components/step-flow-editor";
import { getLogicInstanceById, getLogicLogsByLogicIns, getLogicJsonByBak } from "@/services/ideSvc";
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

const LogicDebug = () => {
    const { id } = useParams();
    const [config, setConfig] = useState<Logic>();
    const [loading, setLoading] = useState(false);
    const [debugLogs, setDebugLogs] = useState([])
    const [logicIns, setLogicIns] = useState();
    useEffect(() => {
        setLoading(true);
        if (id)
            getLogicInstanceById(id).then(res => {
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
                            setLoading(true)
                            getLogicInstanceById(id).then(insRes => {
                                if (insRes) {
                                    setLogicIns(insRes);
                                    getLogicLogsByLogicIns(insRes).then(logsRes => {
                                        if (logsRes) {
                                            setDebugLogs(logsRes)
                                        }
                                        setLoading(false)
                                    })
                                }
                                setLoading(false);
                            })

                        }}>
                            <SyncOutlined />
                            刷新
                        </Button>,
                        // <Button onClick={() => {
                        //     getLogicLogsByLogicIns(logicIns).then(res => {
                        //         if (res) {
                        //             setDebugLogs(res)
                        //         }
                        //     })
                        // }}>
                        //     <ProfileOutlined />
                        //     刷新日志
                        // </Button>,
                        // <span >实例逻辑名称：{config?.name}</span>,
                        <span style={{ color: 'red' }}>执行版本：{logicIns?.version}</span>
                    ]}
                    nextId={logicIns?.nextId}
                    config={config}
                    logicIns={logicIns}
                    configSchemaProvider={formProvider}
                    itemLogSchemaProvider={logFormProvider}
                    debugLogs={debugLogs}
                />
            </Spin>
        </div>
    );
};

export default LogicDebug;
