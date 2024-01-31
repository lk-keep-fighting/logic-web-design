import { LogicFlowEditor } from "@/components/logic-editor";
import { Button, Modal, Spin, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "umi";
import { Graph, Shape } from "@antv/x6";
import { MenuFoldOutlined, MenuUnfoldOutlined, PlayCircleTwoTone, SaveOutlined, SettingTwoTone } from "@ant-design/icons";
import { getPanelData } from "./services/panelSvc";
import { BizDslConvert } from "./convert/dslConvert";
import { appendStartNode } from "@/components/logic-editor/settings/GraphDataHelper";
import { PresetShapes } from "@/components/logic-editor/shapes/PresetShapes";
import { getLogicConfig, saveLogic } from "@/services/ideSvc";
import { Logic } from "@/components/step-flow-core/lasl/meta-data";
import { RegistShape } from "./settings/InitGraph";
import { autoDagreLayout } from "./layout/dagreLayout";
import ParamSetting from "./components/param-setting";
import { TypeAnnotationParser } from "@/components/step-flow-core/lasl/parser/type-annotation-parser";
import dayjs from "dayjs";
import { LogicEditorCtx } from "@/components/logic-editor/types/LogicEditorCtx";
import RunLogic from "./components/run-logic";
import { runLogicOnServer } from "@/services/logicSvc";
import PageRenderById from "@/components/page-render/render-by-page-id";

//http://localhost:4051/#/assets/logic/process/i/gy2/edit?prodCode=CPBM-23MFU2&prodName=%E5%B9%B3%E6%9D%BF%E7%BA%B8U2&matCode=QUF237&version=v1.2
const BizLogicEditor = () => {
    const [dsl, setDsl] = useState<Logic>({});
    const [editorCtx, setEditorCtx] = useState<LogicEditorCtx>({});
    const [graphJson, setGraphJson] = useState({});
    const [showLeft, setShowLeft] = useState(true);
    const [loading, setLoading] = useState(false);
    const [lineStyle, setLineStyle] = useState<'1' | '2'>('1')
    const [graph, setGraph] = useState<Graph>();
    const [panleNodes, setPanelNodes] = useState([]);
    const [openParamsSetting, setParmamsSetting] = useState(false);
    const [openRunLogic, setOpenRunLogic] = useState(false);
    const [jsTipMap, setJsTipMap] = useState(new Map<string, object>)
    const { id } = useParams();
    var dslConvert = new BizDslConvert();
    function handleSave() {
        setLoading(true);
        let newDsl: Logic = dslConvert.graphToLogicItems(graph, dsl);
        newDsl.version = newVersion();
        setDsl(newDsl)
        saveDslToServer(newDsl)
    }
    function newVersion() {
        return dayjs(Date.now()).format('YYYYMMDDHHmmss');
    }
    function saveDslToServer(newDsl: Logic) {
        saveLogic(id, newDsl.version, JSON.stringify(newDsl)).then(res => {
            setLoading(false)
            message.success('保存成功')
            console.log('save logic')
            console.log(newDsl)
        }).catch(err => {
            setLoading(false)
            console.log('err')
            console.log(err)
            message.error('保存失败')
        })
    }

    //保存参数配置
    function saveFlowSettingAndConvertGraphToDsl(settingValues: any) {
        let jsTips: object = {};
        jsTips['_par'] = settingValues.params;
        jsTips['_var'] = settingValues.variables;
        jsTips['_env'] = settingValues.envs;
        setEditorCtx({ jsTips: { ...jsTips } })
        const params = TypeAnnotationParser.getParamArrayByJson(JSON.parse(settingValues.params ?? "{}"));
        const returns = TypeAnnotationParser.getReturnArrayByJson(JSON.parse(settingValues.returns ?? "{}"));
        const variables = TypeAnnotationParser.getVariableArrayByJson(JSON.parse(settingValues.variables ?? "{}"));
        const envs = TypeAnnotationParser.getEnvsArrayByJson(JSON.parse(settingValues.envs ?? "{}"));

        let newDsl: Logic = { ...dsl, params, returns, variables, envs };
        newDsl.version = newVersion();
        setDsl(newDsl)
        saveDslToServer(newDsl)
    };
    function updateEditorCtx(dsl: Logic) {
        let jsTips: object = {};
        jsTips['_par'] = JSON.stringify(TypeAnnotationParser.getJsonByParams(dsl.params));
        jsTips['_var'] = JSON.stringify(TypeAnnotationParser.getJsonByParams(dsl.variables));
        jsTips['_env'] = JSON.stringify(TypeAnnotationParser.getJsonByParams(dsl.envs));
        setEditorCtx({ jsTips: { ...jsTips } })
        setLoading(false);
    }

    useEffect(() => {
        RegistShape([PresetShapes.get('ExtSharp')]);
        setLoading(true);
        getLogicConfig(id).then(res => {
            const configJson = res;
            configJson.id = id;//默认使用当前id作为配置id，用于复用配置时简化更新操作
            setDsl(configJson)
            setGraphJson(configJson?.visualConfig)
            updateEditorCtx(configJson);
        }).catch(err => {
            setLoading(false);
            console.log('err')
            console.log(err)
        })
        getPanelData().then(data => {
            setPanelNodes(data.Nodes);
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
            // tools: [
            //     {
            //         name: 'edge-editor',
            //         args: {
            //             attrs: {
            //                 backgroundColor: '#fff',
            //             },
            //         },
            //     },
            // ],
            zIndex: 0,
            data: {
                type: lineStyle
            }
        });
    }, [lineStyle]);
    return (
        <div>
            <Spin spinning={loading}>
                <LogicFlowEditor
                    editorCtx={editorCtx}
                    panelData={{
                        Nodes: [...panleNodes],
                        Shapes: [PresetShapes.get('ExtSharp')],
                        Groups: [{
                            name: 'global',
                            title: '全局节点',
                            graphHeight: 110,
                        },
                        {
                            name: 'ctrl',
                            title: '逻辑控制',
                            graphHeight: 220,
                        },
                        {
                            name: 'biz',
                            title: '业务调用',
                            graphHeight: 220,
                        },]
                    }}
                    showLeft={showLeft}
                    graphIns={graph}
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
                        <Button icon={<SaveOutlined />} type='primary' onClick={() => handleSave()}>保存</Button>,
                        <ParamSetting open={openParamsSetting}
                            values={{
                                ...dsl
                            }}
                            setOpen={() => {
                                setParmamsSetting(!openParamsSetting)
                            }}
                            onSubmit={saveFlowSettingAndConvertGraphToDsl}
                        >
                            <Button
                                onClick={() => setParmamsSetting(true)}
                                icon={<SettingTwoTone />}
                            >配置参数</Button>
                        </ParamSetting>,
                        <RunLogic open={openRunLogic}
                            setOpen={() => setOpenRunLogic(!openRunLogic)}
                            values={{ params: dsl?.params }}
                            onSubmit={(values, model) => {
                                setOpenRunLogic(false)
                                if (dsl) {
                                    const { params, bizId, headers, bizStartCode } = values;
                                    runLogicOnServer(dsl.id, JSON.parse(params), bizId, bizStartCode, model, JSON.parse(headers)).then(res => {
                                        if (res.data.code == 0) {
                                            Modal.success({
                                                title: '执行成功',
                                                width: '1000px',
                                                closable: true,
                                                content: <div>
                                                    <PageRenderById pageId='debug-info' data={res.data} />
                                                </div>,
                                            })
                                        } else {
                                            Modal.error({
                                                title: <span>{res.data.msg}</span>,
                                                width: '1200px',
                                                closable: true,
                                                content: <div>
                                                    <PageRenderById pageId='debug-info' data={res.data} />
                                                </div>,
                                            })
                                        }
                                    }).catch(err => {
                                        const res = err.response.data;
                                        Modal.error({
                                            title: <span>{res.msg}</span>,
                                            width: '1200px',
                                            closable: true,
                                        })
                                    });
                                }
                            }}>
                            <Button
                                type="default"
                                onClick={() => {
                                    setOpenRunLogic(true)
                                }}
                                icon={<PlayCircleTwoTone />}
                            >
                                调试
                            </Button>
                        </RunLogic>,
                        <span>当前版本:{dsl.version}</span>
                        // <Button icon={<UnDoIcon />} onClick={() => {
                        //     debugger;
                        //     if (graph && graph.canUndo()) {
                        //         graph.undo();
                        //     }
                        // }}>撤销</Button>,
                        // <Button icon={<ReDoIcon />} onClick={() => {
                        //     debugger;
                        //     if (graph && graph.canRedo()) {
                        //         graph.undo();
                        //     }
                        // }}>重做</Button>,
                    ]}
                    graphJson={graphJson}
                    onGraphJsonEmpty={appendStartNode}
                    createEdge={createEdge}
                    edgeTools={['button-remove', 'vertices', 'segments']}
                    onSave={() => handleSave()}
                    jsTipMap={jsTipMap}
                    autoLayout={(g) => autoDagreLayout(g)}
                    onGraphInsChange={v => setGraph(v)}
                />
            </Spin>
        </div >
    );
};

export default BizLogicEditor;
