import { LogicFlowEditor } from "@/components/logic-editor";
import { Divider, Space, Spin, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "umi";
import { Graph, Shape } from "@antv/x6";
import { getPanelData } from "./services/panelSvc";
import { StoreService } from "./services/storeSvc";
import { ProcessInput } from "./services/dtos/processInput";
import LogicNodeConfig from "@/components/logic-editor/types/LogicNodeConfig";
import { getPresetNode } from "@/components/logic-editor/nodes/PresetNodes";
import { RegistShape } from "./settings/InitGraph";
import { PresetShapes } from "@/components/logic-editor/shapes/PresetShapes";
import { getLogicByBak, getLogicJsonByBak } from "@/services/ideSvc";

//http://localhost:4051/#/assets/logic/process/i/gy2/edit?prodCode=CPBM-23MFU2&prodName=%E5%B9%B3%E6%9D%BF%E7%BA%B8U2&matCode=QUF237&version=v1.2
const mesService = new StoreService();
const BizLogicView = () => {
    const [logicData, setLogicData] = useState({});
    const [graphJson, setGraphJson] = useState({});
    const [loading, setLoading] = useState(false);
    const [graph, setGraph] = useState<Graph>();
    const { id, version } = useParams();
    useEffect(() => {
        RegistShape([...PresetShapes.values()]);
    }, [])
    useEffect(() => {
        setLoading(true);
        if (id)
            getLogicByBak(id, version).then(res => {
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
