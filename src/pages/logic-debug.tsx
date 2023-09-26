import { Logic } from "@/components/step-flow-core/lasl/meta-data";
import { DebugLogic } from "@/components/step-flow-editor";
import { getLogic, getLogicInstanceWithBizId, getLogicLogsWithBizId } from "@/services/logicSvc";
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
    const handleSave = useCallback((logic: Logic) => {
        logic.id = id;
        setLoading(true);
        setConfig(logic)
        axios.put(`/api/form/logic/edit/${logic.id}`, { configJson: JSON.stringify(logic) }).then(res => {
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
        getLogic(id).then(res => {
            const configJson = res;
            configJson.id = id;//默认使用当前id作为配置id，用于复用配置时简化更新操作
            setConfig(configJson)
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log('err')
            console.log(err)
        })
        getLogicInstanceWithBizId(id, searchParams.get('bizId')).then(res => {
            if (res) {
                setLogicIns(res);
            }
        })
        getLogicLogsWithBizId(id, searchParams.get('bizId')).then(res => {
            if (res) {
                setDebugLogs(res)
            }
        })
    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <DebugLogic
                    btns={[
                        <span>是否完成：{logicIns?.isOver ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <FrownOutlined twoToneColor='red' />}<Divider type='vertical' /></span>,
                        <Button onClick={() => {
                            getLogicInstanceWithBizId(id, searchParams.get('bizId')).then(res => {
                                if (res) {
                                    setLogicIns(res);
                                    console.log('logicIns')
                                    console.log(logicIns)
                                }
                            })
                        }}>
                            <SyncOutlined />
                            刷新状态
                        </Button>,
                        <Button onClick={() => {
                            getLogicLogsWithBizId(id, searchParams.get('bizId')).then(res => {
                                if (res) {
                                    setDebugLogs(res)
                                }
                            })
                        }}>
                            <ProfileOutlined />
                            刷新日志
                        </Button>
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
