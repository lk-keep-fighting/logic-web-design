import { Logic } from "@/components/step-flow-core/lasl/meta-data";
import { getRemoteLogicByBak, getRemoteLogicLogsById } from "@/services/ideSvc";
import { CheckCircleTwoTone, FrownOutlined } from "@ant-design/icons";
import { Divider, Space, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
// import * as monaco from 'monaco-editor';
// import { loader } from '@monaco-editor/react';
import { useParams } from "umi";
import DebugLogicLog from "../../debugLogicLog";

function refreshWebTitle(dsl: Logic) {
    window.document.title = "-[" + dsl.name + "]日志";
}
const LogicLogDebug = () => {
    const { id, runtime } = useParams();
    const [config, setConfig] = useState<Logic>();
    const [loading, setLoading] = useState(false);
    const [debugLog, setDebugLog] = useState({})
    useEffect(() => {
        setLoading(true);
        if (debugLog)
            getRemoteLogicByBak(runtime, debugLog.logicId, debugLog.version).then(res => {
                const { configJson } = res;
                setConfig(configJson)
                setLoading(false);
                refreshWebTitle(configJson)
            }).catch(err => {
                setLoading(false);
                console.log('err')
                console.log(err)
            })
    }, [debugLog])
    useEffect(() => {
        if (id)
            getRemoteLogicLogsById(runtime, id).then(res => {
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
                        <Divider type='vertical' />,
                        <span>是否完成：{debugLog?.isOver ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <FrownOutlined twoToneColor='red' />}</span>,
                        <Divider type='vertical' />,
                        <span>待执行：{debugLog?.nextName}</span>,
                        <Divider type='vertical' />,
                        <Space>业务标识：{debugLog?.bizId}<Typography.Text copyable={{ tooltips: ['点击复制', '复制成功!'], text: debugLog?.bizId }} /></Space>,
                        <Divider type='vertical' />,
                        <span style={{ color: 'red' }}>执行版本：</span>,
                        <span>{debugLog?.version}<Typography.Text copyable={{ tooltips: ['点击复制', '复制成功!'], text: debugLog?.version }} /></span>,
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
            </Spin >
        </div >
    );
};

export default LogicLogDebug;
