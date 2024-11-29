import { LogicFlowEditor } from "@/components/logic-editor";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "umi";
import { Graph } from "@antv/x6";
import { PresetShapes } from "@/components/logic-editor/shapes/PresetShapes";
import { getRemoteLogicByBak } from "@/services/ideSvc";
import { RegistShape } from "../../../settings/InitGraph";

const BizLogicView = () => {
    const [logicData, setLogicData] = useState({});
    const [graphJson, setGraphJson] = useState({});
    const [loading, setLoading] = useState(false);
    const [graph, setGraph] = useState<Graph>();
    const { id, version, runtime } = useParams();
    useEffect(() => {
        RegistShape([...PresetShapes.values()]);
    }, [])
    useEffect(() => {
        setLoading(true);
        if (id)
            getRemoteLogicByBak(runtime, id, version).then(res => {
                setLogicData(res)
                setGraphJson(res.configJson.visualConfig)
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
                <LogicFlowEditor
                    showLeft={false}
                    graphIns={graph}
                    isStatic={true}
                    // lineStyle={{ color: lineColor }}
                    toolElements={[
                        <span style={{ marginLeft: '25px', color: 'red' }}>逻辑版本：{version}</span>,
                        <span style={{ marginLeft: '10px' }}>更新时间：{logicData?.updateTime}</span>,
                        <span style={{ marginLeft: '10px' }}>名称：{logicData?.name}</span>,
                    ]}
                    graphJson={graphJson}

                // createEdge={createEdge}
                // onGraphInsChange={v => setGraph(v)}
                />
            </Spin>
        </div >
    );
};

export default BizLogicView;
