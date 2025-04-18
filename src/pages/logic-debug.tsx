import { Logic } from "@/components/step-flow-core/lasl/meta-data";
import DebugLogic from "@/pages/logic-flow/biz/components/debugLog";
import { getLogicInstanceById, getLogicLogsByLogicIns, getLogicByBak, getLogicInstanceByBizId } from "@/services/ideSvc";
import { CheckCircleTwoTone, EditOutlined, ForkOutlined, FrownOutlined, LineOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Divider, Space, Spin, Typography, Flex, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "umi";

function refreshWebTitle(dsl: Logic, logicIns) {
    window.document.title = ">[" + dsl?.name + "]实例:" + logicIns?.bizId;
}
const LogicDebug = () => {
    const { id, logicId, bizId } = useParams();
    const [config, setConfig] = useState<Logic>();
    const [logicName, setLogicName] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [debugLogs, setDebugLogs] = useState([])
    const [logicIns, setLogicIns] = useState();
    useEffect(() => {
        message.config({
            top: 200
        })
    }, [])
    useEffect(() => {
        setLoading(true);
        if (id)
            getLogicInstanceById(id).then(res => {
                if (res) {
                    const ins = res;
                    setLogicIns(res);
                    setLoading(true);
                    getLogicByBak(res.logicId, res.version).then(res => {
                        if (res) {
                            const { configJson, name } = res;
                            setLogicName(name)
                            setConfig(configJson)
                            refreshWebTitle(configJson, ins)
                        } else {
                            message.error('对应的逻辑版本配置不存在！', 3)
                        }
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
        setLoading(true);
        if (logicId && bizId)
            getLogicInstanceByBizId(logicId, bizId).then(res => {
                if (res) {
                    const ins = res;
                    setLogicIns(res);
                    setLoading(true);
                    getLogicByBak(res.logicId, res.version).then(res => {
                        const { configJson, name } = res;
                        setLogicName(name)
                        setConfig(configJson)
                        refreshWebTitle(configJson, ins)
                        setLoading(false);
                    }).catch(err => {
                        setLoading(false);
                        console.log('err')
                        console.log(err)
                    })
                }
            })
    }, [bizId, logicId])
    useEffect(() => {
        if (logicIns) {
            getLogicLogsByLogicIns(logicIns).then(res => {
                if (res) {
                    setDebugLogs(res)
                }
            })
        }
    }, [logicIns])
    return (
        <div>
            <Spin spinning={loading}>
                <DebugLogic
                    btns={[
                        <Divider type='vertical' />,
                        <Button type='primary' onClick={() => {
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
                            刷新记录
                        </Button>,
                        <Divider type='vertical' />,
                        <Button type='primary' href={`/logic/index.html/#/assets/logic/i/${logicIns?.logicId}/edit`} target='_blank'>
                            <EditOutlined />
                            跳转设计</Button>,
                        <Divider type='vertical' />,
                        <span>是否完成：{logicIns?.isOver ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <LineOutlined twoToneColor='#52c41a' />}</span>,
                        <Divider type='vertical' />,
                        <span>待执行：{logicIns?.nextName}</span>,
                        <Divider type='vertical' />,
                        <Space>业务标识：{logicIns?.bizId}<Typography.Text copyable={{ tooltips: ['复制标识', '复制成功!'], text: logicIns?.bizId }} /></Space>,
                        <Divider type='vertical' />,
                        <Space>{logicName}[{logicIns?.logicId}<Typography.Text copyable={{ tooltips: ['复制编号', '复制成功!'], text: logicIns?.logicId }} />]</Space>,
                        <Divider type='vertical' />,
                        <span style={{ color: 'red' }}>执行版本：</span>,
                        <span>{logicIns?.version}<Typography.Text copyable={{ tooltips: ['复制版本号', '复制成功!'], text: logicIns?.version }} /></span>,
                    ]}
                    nextId={logicIns?.nextId}
                    config={config}
                    logicIns={logicIns}
                    debugLogs={debugLogs}
                />
            </Spin >
        </div >
    );
};

export default LogicDebug;
