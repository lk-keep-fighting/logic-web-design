import { Logic } from "@/components/step-flow-core/lasl/meta-data";
import { getLogicLogsById, tryGetLogicConfigByAllWays } from "@/services/ideSvc";
import { BulbOutlined, CheckCircleTwoTone, FrownOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Divider, Space, Spin, Typography, Flex, message } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "umi";
import DebugLogicLog from "./logic-flow/biz/components/debugLogicLog";
import AIDebugLog from "./logic-flow/biz/components/ai-debug-log";

function refreshWebTitle(dsl: Logic) {
    window.document.title = "-[" + dsl.name + "]日志";
}
const LogicLogDebug = () => {
    const { id } = useParams();
    const [config, setConfig] = useState<Logic>();
    const [loading, setLoading] = useState(false);
    const [debugLog, setDebugLog] = useState({})
    const [showAI, setShowAI] = useState(false);
    useEffect(() => {
        setLoading(true);
        if (debugLog.logicId && config == undefined)
            tryGetLogicConfigByAllWays(debugLog.logicId, debugLog.version).then(res => {
                if (res) {
                    const configJson = res;
                    refreshWebTitle(configJson)
                    setConfig(configJson)
                } else {
                    message.error('对应的逻辑版本配置不存在！', 3)
                }
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                console.log('err')
                console.log(err)
            })
    }, [debugLog])
    useEffect(() => {
        if (id)
            getLogicLogsById(id).then(res => {
                debugger;
                if (res) {
                    setDebugLog(res)
                }
            })
    }, [id])
    return (
        <div>
            <Spin spinning={loading}>
                <DebugLogicLog
                    btns={[
                        <Divider type='vertical' />,

                        <Button type='primary' icon={<BulbOutlined />} onClick={() => {
                            setShowAI(true);
                        }} >AI分析</Button>,
                        <Divider type='vertical' />,
                        <Space>{config?.name}[{debugLog?.logicId}<Typography.Text copyable={{ tooltips: ['复制编号', '复制成功!'], text: debugLog?.logicId }} />]</Space>,
                        <Divider type='vertical' />,
                        <Space>业务标识：{debugLog?.bizId}<Typography.Text copyable={{ tooltips: ['点击复制', '复制成功!'], text: debugLog?.bizId }} /></Space>,
                        <Divider type='vertical' />,
                        <span>是否完成：{debugLog?.isOver ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <FrownOutlined twoToneColor='red' />}</span>,
                        <Divider type='vertical' />,
                        <span>待执行：{debugLog?.nextName}</span>,
                        <Divider type='vertical' />,
                        <span style={{ color: 'red' }}>执行版本：</span>,
                        <span>{debugLog?.version}<Typography.Text copyable={{ tooltips: ['点击复制', '复制成功!'], text: debugLog?.version }} /></span>,
                        <Divider type='vertical' />,
                        <Button type='link' href={`/logic/index.html/#/assets/logic/i/${debugLog.logicId}/edit`} target='_blank'>跳转设计</Button>,
                        <Divider type='vertical' />,
                        <Button type='link' href={`/logic/index.html/#/debug/logic/instance/${debugLog.logicId}/${debugLog.bizId}`} target='_blank'>跳转实例</Button>,
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
                    nextId={debugLog?.nextId}
                    config={config}
                    logicLog={debugLog}
                />
                <AIDebugLog show={showAI} logicLog={debugLog} onClose={() => setShowAI(false)} />
            </Spin >
        </div >
    );
};

export default LogicLogDebug;
