import { Logic } from "@/components/step-flow-core/lasl/meta-data";
import { X6Graph } from "@/components/mes-logic-editor";
import { Button, Divider, Layout, Select, Space, Spin, Typography, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "umi";
import { getLogicConfig, saveLogic } from "@/services/ideSvc";
import axios from "axios";
import { TokenUtil } from "@/utils/tokenUtil";
import { InitPanelData } from "@/components/mes-logic-editor/x6-graph/settings/PanelSetting";
import { Graph, Shape } from "@antv/x6";
import { MenuFoldOutlined, MenuUnfoldOutlined, RedoOutlined, SaveOutlined, UndoOutlined } from "@ant-design/icons";
import { ReDoIcon, UnDoIcon } from "amis-ui";
import { getPanelData } from "./services/panelSvc";
import { MESConvert } from "./convert/mesDslConvert";
import { MesService } from "./services/mesSvc";
import { ProcessInput } from "./services/dtos/processInput";
import LogicNodeConfig from "@/components/logic-editor/LogicNodeConfig";
import { getPresetNode } from "@/components/logic-editor/PresetNodes";

//http://localhost:4051/#/assets/logic/process/i/gy2/edit?prodCode=CPBM-23MFU2&prodName=%E5%B9%B3%E6%9D%BF%E7%BA%B8U2&matCode=QUF237&version=v1.2
const { Nodes, Shapes, Groups } = InitPanelData();
const mesService = new MesService();
const LogicEditor = () => {
    const [dsl, setDsl] = useState<ProcessInput>({});
    const [graphJson, setGraphJson] = useState({});
    const [showLeft, setShowLeft] = useState(true);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useSearchParams();
    const [lineStyle, setLineStyle] = useState<'1' | '2'>('1')
    const [graph, setGraph] = useState<Graph>();
    const [panleNodes, setPanelNodes] = useState([]);
    function handleSave(graph: Graph) {
        dsl.graphData = JSON.stringify(graph.toJSON());
        let newDsl = new MESConvert().graphToMesDsl(graph, dsl)
        setDsl(newDsl)
        setLoading(true)
        mesService.updateRouteProcessDesign(newDsl).then(res => {
            console.log('保存接口返回')
            const json = JSON.parse(res.data)
            if (json.code == '500')
                message.error(json.message)
            else
                message.success('保存成功');
            setLoading(false)
        }).catch(err => {
            message.error(err);
            setLoading(false);
        });
    }
    useEffect(() => {
        setLoading(true);
        mesService.getRouteProcessDesign(search.get('prodCode'), search.get('version'))
            .then(res => {
                let process = JSON.parse(res.data);
                if (process.result) {
                    setDsl(process.result);
                    setGraphJson(process.result.graphData ? JSON.parse(process.result.graphData) : {});
                }
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                console.log('err')
                console.log(err)
            })
        let cusNodes = []
        let startNode: LogicNodeConfig = getPresetNode('circle');
        startNode?.setConfigSchemel('start')
        startNode?.setConfigData({ name: 'start' })
        startNode?.setLabel('start');
        startNode.setGroups(['def']);
        cusNodes.push(startNode);
        let endNode = getPresetNode('circle');
        endNode?.setConfigSchemel('end')
        startNode?.setConfigData({ name: 'end' })
        endNode?.setLabel('end');
        endNode?.setGroups(['def']);
        cusNodes.push(endNode);

        getPanelData().then(data => {
            console.log('拉取大类数据')
            console.log(data)
            data.data.forEach(item => {
                let node;
                switch (item.key) {
                    case 'PROCESS_GROUP':
                        node = getPresetNode('circle');
                        node.setConfigSchemel('process')
                        break;
                    case 'CHECK_GROUP':
                        node = getPresetNode('rhombus')
                        node.setConfigSchemel('process')
                        break;
                    case 'WAIT_GROUP':
                        node = getPresetNode('triangle')
                        node.setConfigSchemel('process')
                        break;
                        break;
                    case 'PICK_GROUP':
                        node = getPresetNode('triangle2')
                        node.setConfigSchemel('process')
                        break;
                    default:
                        node = getPresetNode('ExtSharp');
                        node.setConfigSchemel('process')
                        break;
                }
                node?.setConfigData(item);
                node.setLabel(item.text);
                node.setGroups(['process']);
                let copy = node;
                cusNodes.push(copy)
            })
            let groupNode = getPresetNode('group');
            groupNode?.setLabel('工序组')
            groupNode?.setConfigSchemel('process-group');
            groupNode.setGroups(['process']);
            cusNodes.push(groupNode)
            console.log('cusNodes')
            console.log(cusNodes)
            setPanelNodes(cusNodes);
        })
    }, [])
    const createEdge = useCallback(() => {
        return new Shape.Edge({
            attrs: {
                line: {
                    targetMarker: 'classic',
                    stroke: lineStyle == '1' ? '#000000' : '#FF9900',
                    // stroke: '#f5222d',
                },
            },
            tools: [
                {
                    name: 'edge-editor',
                    args: {
                        attrs: {
                            backgroundColor: '#fff',
                        },
                    },
                },
            ],
            zIndex: 0,
            data: {
                type: lineStyle
            }
        });
    }, [lineStyle]);
    const { Text } = Typography;
    const HeaderInfo = () => {
        return <Space style={{ height: '50px', marginLeft: '20px' }}>
            <Typography>产品编码</Typography>
            <Text underline>{search?.get('prodCode')}</Text>
            <Divider type='vertical' />
            <Typography>产品名称</Typography>
            <Text underline >{search?.get('prodName')}</Text>
            <Divider type='vertical' />
            <Typography>客户料号</Typography>
            <Text underline>{search.get('cusCode')}</Text>
            <Divider type='vertical' />
            <Typography>版本号</Typography>
            <Text underline>{search.get('version')}</Text>
        </Space>;
    }
    return (
        <div>
            <HeaderInfo></HeaderInfo>
            <Spin spinning={loading}>
                <X6Graph
                    panelData={{
                        Nodes: [...panleNodes],
                        Shapes,
                        Groups: [{
                            name: 'def',
                            title: '默认节点',
                            graphHeight: 100,
                        },
                        {
                            name: 'process',
                            title: '工序',
                            graphHeight: 400,
                        }]
                    }}
                    showLeft={showLeft}
                    graphIns={graph}
                    // lineStyle={{ color: lineColor }}
                    toolElements={[
                        <Button
                            type="text"
                            icon={showLeft
                                ? (
                                    <MenuFoldOutlined />
                                ) : (
                                    <MenuUnfoldOutlined />
                                )
                            }
                            onClick={() => {
                                setShowLeft(!showLeft)
                            }}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />,
                        <Button icon={<SaveOutlined />} type='primary' onClick={() => {
                            handleSave(graph)
                        }}>保存</Button>,
                        <span>连接线类型：
                            <Select style={{ width: '100px' }} value={lineStyle} onSelect={(v) => {
                                setLineStyle(v)
                            }}>
                                <Select.Option key={'1'}><span style={{
                                    textDecoration: 'underline',
                                    textDecorationThickness: 3,
                                    textDecorationColor: '#000000'
                                }}>加工线</span>
                                </Select.Option>
                                <Select.Option key={'2'}><span style={{
                                    textDecoration: 'underline',
                                    textDecorationThickness: 3,
                                    textDecorationColor: '#FF9900'
                                }}>返工线</span>
                                </Select.Option>
                            </Select></span>,
                        <Button icon={<UnDoIcon />} onClick={() => {
                            debugger;
                            if (graph && graph.canUndo()) {
                                graph.undo();
                            }
                        }}>撤销</Button>,
                        <Button icon={<ReDoIcon />} onClick={() => {
                            debugger;
                            if (graph && graph.canRedo()) {
                                graph.undo();
                            }
                        }}>重做</Button>,
                        <Button onClick={() => {
                            axios.post('/api/mes/asm-system/bbs/v1/common/accounts/employee/access-token', {
                                "loginName": "admin",
                                "password": "1234@qwer"
                            }).then(res => {
                                debugger
                                TokenUtil.setTokenToLocal(res.data.data.accessToken);
                                message.success(res.data.data.accessToken)
                            }).catch(err => message.error(err.toString()))
                        }}
                        >获取权限</Button>
                    ]}
                    graphJson={graphJson}
                    // config={config}
                    createEdge={createEdge}
                    onSave={handleSave}
                    onGraphInsChange={v => setGraph(v)}
                />
            </Spin>
        </div >
    );
};

export default LogicEditor;
