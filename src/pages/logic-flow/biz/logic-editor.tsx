import { LogicFlowEditor } from "@/components/logic-editor";
import { Button, Modal, Space, Spin, message, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "umi";
import { Graph, Shape } from "@antv/x6";
import { LayoutTwoTone, MenuFoldOutlined, MenuUnfoldOutlined, PlayCircleTwoTone, RocketOutlined, RocketTwoTone, SaveOutlined, SettingTwoTone } from "@ant-design/icons";
import { getPanelData } from "./services/panelSvc";
import { BizDslConvert } from "./convert/dslConvert";
import { appendStartNode } from "@/components/logic-editor/settings/GraphDataHelper";
import { PresetShapes } from "@/components/logic-editor/shapes/PresetShapes";
import { getLogic, getLogicConfig, saveLogic } from "@/services/ideSvc";
import { Logic } from "@/components/step-flow-core/lasl/meta-data";
import { RegistShape } from "./settings/InitGraph";
import { autoDagreLayout } from "./layout/dagreLayout";
import ParamSetting from "./components/param-setting";
import { TypeAnnotationParser } from "@/components/step-flow-core/lasl/parser/type-annotation-parser";
import dayjs from "dayjs";
import { LogicEditorCtx } from "@/components/logic-editor/types/LogicEditorCtx";
import RunLogic from "./components/run-logic";
import { runLogicOnServer } from "@/services/logicSvc";
import PageRenderById from "@/components/ui-render/page-render/render-by-page-id";
import { getEnvJson } from "@/services/runtimeSvc";

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
    const [customGroups, setCustomGroups] = useState([]);
    const [openParamsSetting, setParmamsSetting] = useState(false);
    const [openRunLogic, setOpenRunLogic] = useState(false);
    const [jsTipMap, setJsTipMap] = useState(new Map<string, object>)
    const { id } = useParams();
    var dslConvert = new BizDslConvert();
    function refreshWebTitle(dsl: Logic) {
        window.document.title = "[" + dsl.name + ']:' + dsl.version;
    }
    function handleSave() {
        setLoading(true);
        let newDsl: Logic = dslConvert.graphToLogicItems(graph, dsl);
        newDsl.version = newVersion();
        setDsl(newDsl)
        saveDslToServer(newDsl)
        refreshWebTitle(newDsl)
    }
    function newVersion() {
        return dayjs(Date.now()).format('YYYYMMDDHHmmss');
    }
    function saveDslToServer(newDsl: Logic) {
        saveLogic(id, newDsl.version, JSON.stringify(newDsl)).then(res => {
            setLoading(false)
            console.log('save logic')
            console.log(newDsl)
            if (res.status == 200) {
                message.success('保存成功')
                console.log('save logic success')
            } else {
                message.error('保存失败：' + res.statusText)
                console.error('save logic error')
            }

        }).catch(err => {
            setLoading(false)
            console.log('err')
            console.log(err)
            message.error('保存失败')
        })
    }
    useEffect((() => {
        setEditorCtx({ jsTips: { ...jsTipMap } })
    }), [jsTipMap])
    //保存参数配置
    function saveFlowSettingAndConvertGraphToDsl(settingValues: any) {
        let jsTips: object = {};
        jsTips['_par'] = settingValues.params;
        jsTips['_var'] = settingValues.variables;
        // jsTips['_env'] = settingValues.envs;
        setJsTipMap({ ...jsTipMap, ...jsTips })
        const params = TypeAnnotationParser.getParamArrayByJson(JSON.parse(settingValues.params ?? "{}"));
        const returns = TypeAnnotationParser.getReturnArrayByJson(JSON.parse(settingValues.returns ?? "{}"));
        const variables = TypeAnnotationParser.getVariableArrayByJson(JSON.parse(settingValues.variables ?? "{}"));
        const envs = TypeAnnotationParser.getEnvsArrayByJson(JSON.parse(settingValues.envs ?? "{}"));

        let newDsl: Logic = { ...dsl, params, returns, variables, envs, log: settingValues.log };
        newDsl.version = newVersion();
        setDsl(newDsl)
        saveDslToServer(newDsl)
    };
    async function updateEditorCtx(dsl: Logic) {
        let jsTips: object = {};
        jsTips['_par'] = JSON.stringify(TypeAnnotationParser.getJsonByParams(dsl.params));
        jsTips['_var'] = JSON.stringify(TypeAnnotationParser.getJsonByParams(dsl.variables));
        let runtimeEnvs = await getEnvJson();
        jsTips['_env'] = JSON.stringify(runtimeEnvs)//JSON.stringify(TypeAnnotationParser.getJsonByParams(dsl.envs));
        jsTips['_lastRet'] = '{}';
        jsTips['_last'] = JSON.stringify({ success: true, msg: '' });
        setJsTipMap(jsTips)
        // setEditorCtx({ jsTips: { ...jsTips } })
        setLoading(false);
    }

    useEffect(() => {
        RegistShape([...PresetShapes.values()]);
        setLoading(true);
        getLogic(id).then(res => {
            const { name, configJson } = res;
            configJson.id = id;//默认使用当前id作为配置id，用于复用配置时简化更新操作
            configJson.name = name;//默认使用当前id作为配置id，用于复用配置时简化更新操作
            setDsl(configJson)
            setGraphJson(configJson?.visualConfig)
            updateEditorCtx(configJson);
            refreshWebTitle(configJson)
        }).catch(err => {
            setLoading(false);
            console.log('err')
            console.log(err)
        })
        getPanelData().then(data => {
            setCustomGroups(data.Groups);
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
                        // Shapes: [...PresetShapes.values()],
                        Groups: [
                            {
                                name: 'ctrl',
                                title: '逻辑控制',
                                graphHeight: 360
                            },
                            // {
                            //     name: 'biz',
                            //     title: '业务调用',
                            //     graphHeight: 220,
                            // },
                            ...customGroups
                        ],
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
                                icon={<SettingTwoTone style={{ color: '#1677ff' }} />}
                            >参数</Button>
                        </ParamSetting>,
                        <RunLogic open={openRunLogic}
                            setOpen={() => setOpenRunLogic(!openRunLogic)}
                            values={{ params: dsl?.params }}
                            onSubmit={(values, model) => {
                                setOpenRunLogic(false)
                                if (dsl) {
                                    const { params, bizId, headers, bizStartCode } = values;
                                    setLoading(true);
                                    runLogicOnServer(id, JSON.parse(params), bizId, bizStartCode, model, JSON.parse(headers)).then(res => {
                                        if (res.data.code == 0) {
                                            setLoading(false);
                                            Modal.success({
                                                title: '执行成功',
                                                width: '1000px',
                                                closable: true,
                                                content: <div>
                                                    <PageRenderById pageId='debug-info' data={res.data} />
                                                </div>,
                                            })
                                        } else {
                                            setLoading(false);
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
                                        setLoading(false);
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
                                // type="primary"
                                onClick={() => {
                                    setOpenRunLogic(true)
                                }}
                                icon={<PlayCircleTwoTone style={{ color: '#1677ff' }} />}
                            >
                                调试
                            </Button>
                        </RunLogic>,
                        <Button
                            icon={<RocketTwoTone style={{ color: '#1677ff' }} />}
                            onClick={() => { autoDagreLayout(graph) }}
                        >布局</Button>,
                        <Typography.Text strong style={{ fontSize: '18px' }}>[{dsl.name}]</Typography.Text>,
                        <Typography.Text>版本:{dsl.version}</Typography.Text>
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
            </Spin >
        </div >
    );
};

export default BizLogicEditor;
