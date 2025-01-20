import { Logic } from "@/components/step-flow-core/lasl/meta-data";
import DebugLogic from "@/pages/logic-flow/biz/page/debugLog";
import { getLogicInstanceById, getLogicLogsByLogicIns, getLogicByBak } from "@/services/ideSvc";
import { CheckCircleTwoTone, EditOutlined, ForkOutlined, FrownOutlined, LineOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Divider, Space, Spin, Typography, Flex } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "umi";

function refreshWebTitle(dsl: Logic, logicIns) {
    window.document.title = ">[" + dsl?.name + "]实例:" + logicIns?.bizId;
}
const LogicDebug = () => {
    const { id } = useParams();
    const [config, setConfig] = useState<Logic>();
    const [logicName, setLogicName] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [debugLogs, setDebugLogs] = useState([])
    const [logicIns, setLogicIns] = useState();
    // useEffect(() => {
    //     loader.config({ monaco });
    // }, [])
    useEffect(() => {
        setLoading(true);
        if (id)
            getLogicInstanceById(id).then(res => {
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
    }, [id])
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
                        <Button type='primary' href={`/#/assets/logic/i/${logicIns?.logicId}/edit`} target='_blank'>
                            <EditOutlined />
                            跳转设计</Button>,
                        <Divider type='vertical' />,
                        <span>是否完成：{logicIns?.isOver ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <LineOutlined twoToneColor='#52c41a' />}</span>,
                        <Divider type='vertical' />,
                        <span>待执行：{logicIns?.nextName}</span>,
                        <Divider type='vertical' />,
                        <Space>业务标识：{logicIns?.bizId}<Typography.Text copyable={{ tooltips: ['复制标识', '复制成功!'], text: logicIns?.bizId }} /></Space>,
                        <Divider type='vertical' />,
                        <Space>{logicName}</Space>, <Typography.Text copyable={{ tooltips: ['复制编号', '复制成功!'], text: logicIns?.logicId }} />,
                        <Divider type='vertical' />,
                        <span style={{ color: 'red' }}>执行版本：</span>,
                        <span>{logicIns?.version}<Typography.Text copyable={{ tooltips: ['复制版本号', '复制成功!'], text: logicIns?.version }} /></span>,

                        // <Typography.Paragraph copyable={{ tooltips: ['点击复制', '复制成功!'], text: logicIns?.bizId }} >业务标识：{logicIns?.bizId}</Typography.Paragraph>,
                        // <Typography.Paragraph style={{ color: 'red' }}>执行版本:</Typography.Paragraph>,
                        // <Typography.Paragraph copyable={{ tooltips: ['点击复制', '复制成功!'] }} >{logicIns?.version}</Typography.Paragraph>,
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
