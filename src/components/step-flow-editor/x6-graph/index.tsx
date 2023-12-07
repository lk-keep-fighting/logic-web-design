import { EllipsisOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PlayCircleTwoTone, SaveOutlined, SettingTwoTone } from '@ant-design/icons';
import { CellView, Edge, Graph, Node, Shape } from '@antv/x6';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Stencil } from '@antv/x6-plugin-stencil';
import { Scroller } from '@antv/x6-plugin-scroller'
import { Export } from '@antv/x6-plugin-export'
// import { loader } from '@monaco-editor/react';
import { Button, Col, Dropdown, Layout, MenuProps, Modal, Row, Space, message } from 'antd';
// import * as monaco from 'monaco-editor';
import React from 'react';
import { GraphToLogic } from '@/components/step-flow-core/lasl/parser/logic-parser';
import './index.css';
import LeftTool from '../left-toolset';
import RightToolset from '../right-toolset';
import { InitPanelData } from './settings/PanelSetting';
import { DefaultGraph, RegistShape } from './settings/InitGraph';
import { ConfigSchemaProvider } from './settings/DefaultFormExt';
import DagreGraph from './instance/dagre-graph';
import ParamSetting from '../component/param-setting';
import { dealGraphNodeWhenAddedFromPanel } from './helper/node-mapping/indext';
import { autoDagreLayout } from './layout/dagreLayout';
import { TypeAnnotationParser } from '../../step-flow-core/lasl/parser/type-annotation-parser';
import { Schema } from 'form-render';
import { Logic } from '@/components/step-flow-core/lasl/meta-data';
import { ButtonProps } from 'antd/lib/button';
import RunLogic from '../component/run-logic';
import { runLogicOnServer } from '@/services/logicSvc';
import CodeEditor from '../component/CodeEditor';
import dayjs from 'dayjs';
import { JsonView } from 'amis';


type EditorCtx = {
  logic: Logic,
}
const saveBtns = [
  // { key: 'saveToBrowser', label: '缓存到浏览器' },
  { key: 'saveToPng', label: '导出图片' },
  // { key: '-', label: '-' },
  // { key: 'loadFromBrowser', label: '从浏览器恢复' },
  { key: 'saveToClipboard', label: '复制到剪贴板' }
];

export const EditorContext = React.createContext<EditorCtx>({
  logic: new Logic('')
})

// 控制连接桩显示/隐藏
const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
  for (let i = 0, len = ports.length; i < len; i += 1) {
    ports[i].style.visibility = show ? 'visible' : 'hidden';
  }
};
type StateType = {
  editingNode?: Node;
  openEdgeEditor: boolean;
  editingEdge?: Edge;
  embeddingEnable: boolean;
  graph?: Graph;
  leftToolCollapsed: boolean;
  rightToolCollapsed: boolean;
  openFlowSetting: boolean;
  openRunLogic: boolean;
  editorCtx: EditorCtx;
  // flowRunner: FlowRunner;
  logs: any[];
  panel: {
    nodes: any[],
    groups: any[],
  };
};
interface EditorProps {
  name?: string;
  config?: Logic;
  customSharps?: any[];
  customGroups?: any[];
  customNodes?: any[];
  showLeft?: boolean;
  showRight?: boolean;
  btns: ButtonProps[],
  configSchemaProvider?: (type: string) => Promise<Schema>;
  onSave?: (logic: Logic) => void;
  // readyCallback?: (graph: Graph, flowRunner: FlowRunner) => void;
}
export default class X6Graph extends React.Component<EditorProps, StateType> {
  private container?: HTMLDivElement;
  private stencilContainer?: HTMLDivElement;
  constructor(props: EditorProps) {
    super(props);
    try {
      const { Nodes, Shapes, Groups } = InitPanelData(
        props.customNodes,
        props.customGroups,
        props.customSharps,
      );
      RegistShape(Shapes);
      this.state.leftToolCollapsed = !(props.showLeft ?? true);
      this.state.rightToolCollapsed = !(props.showRight ?? false);
      this.state.panel.nodes = Nodes;
      this.state.panel.groups = Groups;
      // this.state.flowRunner = new FlowRunner();

    } catch (error) {
      console.error('注册节点出错：');
      console.error(error);
    }
  }
  state: StateType = {
    editingNode: undefined,
    openEdgeEditor: false,
    embeddingEnable: false,
    editingEdge: undefined,
    leftToolCollapsed: false,
    rightToolCollapsed: true,
    openFlowSetting: false,
    openRunLogic: false,
    // flowRunner: new FlowRunner(),
    editorCtx: { logic: new Logic('1') },
    logs: [],
    panel: {
      nodes: [],
      groups: [],
    },
  };
  handleEdgeSubmit = (v: any) => {
    this.state.editingEdge?.setLabels(v);
  };
  componentDidUpdate(
    prevProps: Readonly<EditorProps>,
    prevState: Readonly<StateType>,
    snapshot?: any,
  ): void {
    if (this.props.config && this.state.editorCtx.logic.id != this.props.config.id) {
      this.state.editorCtx.logic = this.props.config;
      if (this.state.editorCtx?.logic?.visualConfig)
        this.state.graph?.fromJSON(this.state.editorCtx.logic?.visualConfig);
      this.setState({ editingNode: undefined });
    }
  }

  componentDidMount() {
    this.initGraph(this.container);
    this.updateLogicAndEditorCtx(this.state.editorCtx?.logic)
    //注册运行日志监听
    // this.state.flowRunner.on('log', (msg) => {
    //   this.state.logs.push(msg);
    //   this.setState({ logs: [...this.state.logs] });
    // });
    // loader.config({ monaco });
  }
  //初始化画布以及事件配置
  initGraph = (container?: HTMLDivElement) => {
    const graph = new Graph({
      container: container,
      embedding: {
        enabled: this.state.embeddingEnable,
        validate: (args: {
          child: Node,
          parent: Node,
          childView: CellView,
          parentView: CellView,
        }) => {
          //实现拖拽连接，设置自动顺序连接的节点
          args.child.setData({ hoverNode: args.parent })
          return true;
        }
      },
      mousewheel: {
        enabled: true,
        // zoomAtMousePosition: true,
        modifiers: 'ctrl',
        minScale: 0.5,
        maxScale: 3,
      },
      connecting: {
        router: 'manhattan',
        connector: {
          name: 'rounded',
          args: {
            radius: 15,
          },
        },
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        allowMulti: true,
        snap: {
          radius: 20,
        },
        createEdge() {
          return new Shape.Edge({
            tools: [
              {
                name: 'edge-editor',
                args: {
                  attrs: {
                    backgroundColor: '#fff',
                  },
                },
              },
              // {
              //   name: 'button',
              //   args: {
              //     markup: [
              //       {
              //         tagName: 'circle',
              //         selector: 'button',
              //         attrs: {
              //           r: 10,
              //           stroke: '#fe854f',
              //           strokeWidth: 2,
              //           fill: 'white',
              //           cursor: 'pointer',
              //         },
              //       },
              //       {
              //         tagName: 'text',
              //         textContent: '+',
              //         selector: 'icon',
              //         attrs: {
              //           fill: '#fe854f',
              //           fontSize: 15,
              //           textAnchor: 'middle',
              //           pointerEvents: 'none',
              //           y: '0.3em',
              //         },
              //       },
              //     ],
              //     distance: 40,
              //     onClick({ view }: { view: EdgeView }) {
              //       console.log(view)
              //       graph.removeEdge(view.cid);
              //       graph.addNode({
              //         shape: 'rect',
              //         label: 'node'
              //       })
              //       // Modal.info(view.sourc)
              //     },
              //   },
              // },
            ],
            zIndex: 0
          });
        },
        validateConnection({ targetMagnet }) {
          return !!targetMagnet;
        },
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#5F95FF',
              stroke: '#5F95FF',
            },
          },
        },
      },
      background: {
        color: '#F2F7FA',
      },
      grid: true,
      // panning: {
      //   enabled: true,
      // },
    });
    //对齐线
    graph
      .use(
        new Snapline({
          enabled: true,
          sharp: true,
        }),
      )
      .use(
        //撤销重做
        new History({
          enabled: true,
        }),
      ).use(
        //框选
        new Selection({
          enabled: true,
          multiple: true,
          strict: true,
          rubberband: true,
          movable: true,
          showNodeSelectionBox: true,
          pointerEvents: "none"
        }),
      )
      .use(new Scroller({
        enabled: true
      }))
      .use(new Keyboard())
      .use(new Clipboard())
      .use(new Export());

    graph.on('edge:dblclick', ({ cell }) => {
      // this.setState({ openEdgeEditor: true, editingEdge: cell })
    });

    graph.on('edge:mouseenter', ({ cell }) => {
      cell.addTools([
        {
          name: 'button-remove',
          args: { distance: -40 },
        },
        // {
        //     name: "source-arrowhead",
        //     args: {
        //         attrs: {
        //             fill: "red",
        //             visibility: "hidden"
        //         },
        //     },
        // },
        // {
        //     name: "target-arrowhead",
        //     args: {
        //         attrs: {
        //             fill: "red",
        //             visibility: "hidden"
        //         },
        //     },
        // },
      ])
      // const ports = this.container?.querySelectorAll(
      //   '.x6-port-body',
      // ) as NodeListOf<SVGElement>;
      // showPorts(ports, true);
    });

    graph.on('edge:mouseleave', ({ cell }) => {
      cell.removeTools();
      // const ports = this.container?.querySelectorAll(
      //   '.x6-port-body',
      // ) as NodeListOf<SVGElement>;
      // showPorts(ports, false);
    });
    graph.on('node:moved', ({ e, x, y, node, view }) => {
      const linkNode = node.data?.hoverNode;
      if (this.state.embeddingEnable && linkNode) {
        const ne = graph.createEdge({
          source: linkNode,
          sourcePort: linkNode.ports.items.find(i => i.group == 'bottom')?.id,
          target: node,
          targetPort: node.ports.items.find(i => i.group == 'top')?.id,
          zIndex: 0,
        })
        node.data.hoverNode = undefined;
        graph.addEdge(ne);
        this.autoLayout(graph);
      }
    })
    // graph.on('node:embedding', ({ e, x, y, node, view, currentParent, candidateParent }) => {
    //   console.log('embedding')
    //   // node.setData({ candidateParent })
    //   // console.log(node.data)
    //   // console.log(currentParent?.data)
    //   // console.log(candidateParent?.data)
    // })
    // graph.on('node:embedded', ({ e, x, y, node, view, previousParent, currentParent }) => {
    //   // console.log('embedded')
    // })
    graph.on('node:mouseenter', ({ cell }) => {
      if (cell.data?.config?.type != 'start') {
        cell.addTools([
          {
            name: 'button-remove',
            args: {
              x: '100%',
              y: 0,
              offset: { x: -10, y: 10 },
            },
          },
        ])
      }

      const ports = this.container?.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>;
      showPorts(ports, true);
    });

    graph.on('node:mouseleave', ({ cell }) => {
      cell.removeTools();
      const ports = this.container?.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>;
      showPorts(ports, false);
    });
    graph.on('node:click', ({ e, x, y, node, view }) => {
      node.removeTools();
      this.setState({ editingNode: node });
    });
    graph.on('node:added', ({ node, index, options }) => {
      dealGraphNodeWhenAddedFromPanel(graph, node);
    })
    graph.on('node:dblclick', ({ e, x, y, node, view }) => {
      // const newNode = graph.addNode({
      //   shape: node.shape,
      //   position: { x: x + 400, y: y },
      // });
      // graph.addEdge({
      //   source: node,
      //   target: newNode,
      // })
      this.setState({ rightToolCollapsed: false, editingNode: node })
    });

    // 绑定快捷键：复制粘贴
    graph.bindKey(['meta+c', 'ctrl+c'], () => {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.copy(cells);
      }
      return false;
    });
    graph.bindKey(['meta+x', 'ctrl+x'], () => {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.cut(cells);
      }
      return false;
    });
    graph.bindKey(['meta+v', 'ctrl+v'], () => {
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 });
        graph.cleanSelection();
        graph.select(cells);
      }
      return false;
    });
    //绑定撤销、重做
    graph.bindKey(['meta+z', 'ctrl+z'], () => {
      if (graph.canUndo()) {
        graph.undo();
      }
      return false;
    });
    graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
      if (graph.canRedo()) {
        graph.redo();
      }
      return false;
    });
    // select all
    // graph.bindKey(['meta+a', 'ctrl+a'], () => {
    //     const nodes = graph.getNodes()
    //     if (nodes) {
    //         graph.select(nodes)
    //     }
    // })

    // delete
    graph.bindKey('backspace', () => {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        if (cells.find(i => {
          if (i.data)
            return ['start'].indexOf(i.data.config?.type) > -1;
          else return false;
        })) {
          message.error('禁止删除开始节点！')
        } else {
          graph.removeCells(cells);
        }
      }
    });
    graph.on('blank:dblclick', ({ e, x, y }) => {
      console.log('blank:dbclick', x, y);
      this.autoLayout(graph)
    })

    // zoom
    graph.bindKey(['ctrl+1', 'meta+1'], () => {
      const zoom = graph.zoom();
      if (zoom < 1.5) {
        graph.zoom(0.1);
      }
    });
    graph.bindKey(['ctrl+2', 'meta+2'], () => {
      const zoom = graph.zoom();
      if (zoom > 0.5) {
        graph.zoom(-0.1);
      }
    });
    this.state.graph = graph;

    const groups = this.state.panel.groups;
    const stencil = new Stencil({
      title: '展开/收起',
      target: graph,
      search(cell, keyword) {
        const label: string = cell.getAttrByPath('text/text');
        return label?.indexOf(keyword) !== -1;
      },
      // placeholder: '通过图形',
      notFoundText: '未找到',
      collapsable: true,
      stencilGraphWidth: 250,
      groups: groups,
      layoutOptions: { rowHeight: 100 }
    });
    const groupedNodes: { [Key: string]: any[] } = {};
    this.state.panel.nodes.forEach((v) => {
      const n = graph.createNode(v);
      groups.forEach((g) => {
        if (v.groups.includes(g.name)) {
          if (!groupedNodes[g.name]) groupedNodes[g.name] = [n];
          else groupedNodes[g.name].push(n);
        }
      });
    });
    Object.keys(groupedNodes).forEach((o) => {
      stencil.load([...groupedNodes[o]], o);
    });
    this.stencilContainer?.appendChild(stencil.container);

    if (this.props.config) {
      this.state.editorCtx.logic = this.props.config;
      graph.fromJSON(this.state.editorCtx.logic.visualConfig);
    } else {
      DefaultGraph(graph);
      this.autoLayout(graph)
    }
    // graph.centerContent();

    // if (this.props.readyCallback)
    //   this.props.readyCallback(graph, this.state.flowRunner);
    return graph;
  };
  autoLayout = (graph: Graph) => {
    autoDagreLayout(graph);
  }
  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };
  refStencil = (container: HTMLDivElement) => {
    this.stencilContainer = container;
  };
  //处理表单提交
  handleSubmit = (v: any) => {
    //自动保存整个配置文件
    this.saveAndConvertGraphToDsl();
  };
  handleOnConfigChange = (v: string) => {
    try {
      const newFlow = JSON.parse(v);
      this.setState({ stepFlow: newFlow });
    } catch (error) {
      console.log(error);
    }
  };
  onSaveMenuClick: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case 'saveToBrowser':
        break;
      case 'loadFromBrowser':
        const localData = localStorage.getItem('logic-json');
        if (localData) {
          const flow: Logic = JSON.parse(localData);
          this.state.editorCtx.logic = flow;
          this.state.graph?.fromJSON(flow.visualConfig);
          this.saveAndConvertGraphToDsl();
        } else {
          message.info('浏览器无缓存数据');
        }
        break;
      case 'saveToClipboard':
        try {
          navigator.clipboard.writeText(JSON.stringify(this.state.editorCtx.logic));//复制到剪贴板
        } catch (error) {
          console.error(error)
        }
        break;
      case 'saveToPng':
        this.state.graph?.exportPNG(new Date().toLocaleDateString(), { backgroundColor: '#F2F7FA', padding: 10, quality: 1 });
        // this.state.graph?.exportPNG(new Date().toLocaleDateString(), { backgroundColor: '#F2F7FA', padding: 10, quality: 1 });
        break;
    }
  };
  /**
   * 增量更新逻辑配置
   * @param updatedFlowProps 追加更新的属性
   * @returns 
   */
  updateLogicAndEditorCtx = (updatedFlowProps: any) => {
    let newLogic: Logic = { ...this.state.editorCtx.logic, ...updatedFlowProps };
    newLogic.version = dayjs(Date.now()).format('YYYYMMDDHHmmss')
    this.setState({
      editorCtx: {
        ...this.state.editorCtx,
        logic: newLogic,
        // flowVar: newLogic.variables,//JSON.parse(newLogic.var),
        // flowInput: newLogic.params,//JSON.parse(newLogic.input),
        // flowReturn: newLogic.returns, //JSON.parse(newLogic.return),
        // flowEnv: newLogic.envs// JSON.parse(newLogic.env),
      }
    });
    return newLogic;
  }
  //保存到浏览器并转换dsl
  saveAndConvertGraphToDsl = () => {
    const data = this.state.graph?.toJSON();
    const logicFromGraph = this.convertGraphToDsl(data);//根据图转换的flow，只包含steps值
    if (logicFromGraph) {
      const newLogic = this.updateLogicAndEditorCtx({ items: logicFromGraph.items, visualConfig: logicFromGraph.visualConfig })
      if (this.props.config)
        newLogic.id = this.props.config?.id
      if (this.props.onSave) this.props.onSave(newLogic);//调用父级传入的回调保存配置
      const logicJson = JSON.stringify(newLogic);
      localStorage.setItem('logic-' + newLogic.name, logicJson);//缓存到浏览器
      // navigator.clipboard.writeText(logicJson);//复制到剪贴板
      // this.state.flowRunner.send('save', flowJson);//发送消息
      // this.autoLayout(this.state.graph)//自动布局
    }
  };
  //保存参数配置
  saveFlowSettingAndConvertGraphToDsl = (settingValues: any) => {
    const params = TypeAnnotationParser.getParamArrayByJson(JSON.parse(settingValues.params ?? "{}"));
    const returns = TypeAnnotationParser.getReturnArrayByJson(JSON.parse(settingValues.returns ?? "{}"));
    const variables = TypeAnnotationParser.getVariableArrayByJson(JSON.parse(settingValues.variables ?? "{}"));
    const envs = TypeAnnotationParser.getEnvsArrayByJson(JSON.parse(settingValues.envs ?? "{}"));

    const newLogic = this.updateLogicAndEditorCtx({ params, returns, variables, envs })
    const logicJson = JSON.stringify(newLogic);
    localStorage.setItem('logic-json-' + newLogic.id, logicJson);//缓存到浏览器
    // navigator.clipboard.writeText(logicJson);//复制到剪贴板
    // this.state.flowRunner.send('save', flowJson);//发送消息
    // this.autoLayout(this.state.graph)//自动布局
  };
  convertGraphToDsl = (graphJson: any) => {
    const _flow = GraphToLogic(this.props.config?.id, graphJson.cells);
    if (_flow) _flow.visualConfig = graphJson;
    return _flow;
  };
  setFlowSetting = (open: boolean) => {
    this.setState({ openFlowSetting: open })
  }
  render() {
    const {
      editingNode,
      leftToolCollapsed,
      rightToolCollapsed,
      editorCtx,
      embeddingEnable,
      graph,
      openFlowSetting,
      openRunLogic,
    } = this.state;
    const { logic } = editorCtx;
    console.log('editorCtx', editorCtx);
    return (
      <EditorContext.Provider value={editorCtx}>
        <Layout style={{ height: '100vh', width: '100%', margin: 0 }}>
          <Layout.Sider
            theme="light"
            collapsed={leftToolCollapsed}
            collapsedWidth={0}
            width={300}
          >
            <LeftTool
              refStencil={this.refStencil}
              graph={this.state.graph}
              logic={logic}
              onConfigChange={this.handleOnConfigChange}
            />
          </Layout.Sider>
          <Layout style={{ height: '100%' }}>
            <Layout.Header style={{ padding: 0, backgroundColor: 'white' }}>
              <Space direction="horizontal">
                <Button
                  type="text"
                  icon={
                    leftToolCollapsed ? (
                      <MenuUnfoldOutlined />
                    ) : (
                      <MenuFoldOutlined />
                    )
                  }
                  onClick={() => {
                    this.setState({ leftToolCollapsed: !leftToolCollapsed });
                  }}
                  style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                  }}
                />
                <Dropdown.Button
                  style={{ float: 'inline-start' }}
                  menu={{
                    items: saveBtns, onClick: this.onSaveMenuClick
                  }}
                  buttonsRender={(menu) => {
                    return [
                      <Button type='primary' icon={<SaveOutlined />}
                        // style={{ width: '100px' }}
                        onClick={this.saveAndConvertGraphToDsl} >保存</Button>,
                      <Button type='primary' icon={<EllipsisOutlined />} />
                    ]
                  }}
                // onClick={this.saveAndConvertGraphToDsl}
                >
                  保存
                </Dropdown.Button >
                <ParamSetting open={openFlowSetting}
                  values={{
                    ...logic
                  }}
                  setOpen={this.setFlowSetting}
                  onSubmit={this.saveFlowSettingAndConvertGraphToDsl}
                >
                  <Button
                    onClick={() => this.setFlowSetting(true)}
                    icon={<SettingTwoTone />}
                  >配置参数</Button>
                </ParamSetting>
                {/* <Button
                  type='dashed'
                  icon={<RocketOutlined />}
                  onClick={() => {
                    this.autoLayout(this.state.graph)
                  }}
                ></Button> */}
                {this.props.btns?.map(b => <Button {...b} />)}
                <RunLogic open={openRunLogic}
                  setOpen={(open) => this.setState({ openRunLogic: open })}
                  values={{ params: logic?.params }}
                  onSubmit={(values, model) => {
                    this.setState({ openRunLogic: false })
                    if (logic) {
                      const { params, bizId, headers, bizStartCode } = values;
                      runLogicOnServer(logic.id, JSON.parse(params), bizId, bizStartCode, model, JSON.parse(headers)).then(res => {
                        if (res.data.code == 0) {
                          Modal.success({
                            title: '执行成功',
                            width: '1000px',
                            closable: true,
                            content: <div>
                              <Row>
                                <Col>
                                  <Row>
                                    <Col span={24}>
                                      <h4>{res.data.msg}</h4>
                                      <JsonView src={res.data ?? {}} collapsed={1} />
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </div>,
                          })
                        } else {
                          Modal.error({
                            title: <span>{res.data.msg}</span>,
                            width: '1200px',
                            closable: true,
                            content: <div>
                              <Row>
                                <Col>
                                  <Row>
                                    <Col span={12}>
                                      <h4>错误详细:</h4>
                                      <JsonView src={res.data.error ?? {}} collapsed={1} />
                                      {/* {JSON.stringify(res.error)} */}
                                    </Col>
                                    <Col span={12}>
                                      <h4>返回数据:</h4>
                                      <CodeEditor language='json' value={JSON.stringify(res.data)} width={500} />
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </div>,
                          })
                        }
                      }).catch(err => {
                        const res = err.response.data;
                        Modal.error({
                          title: <span>{res.msg}</span>,
                          width: '1200px',
                          closable: true,
                          content: <div>
                            <Row>
                              <Col>
                                <Row>
                                  <Col span={12}>
                                    <h4>错误详细:</h4>
                                    <JsonView src={res.error} collapsed={1} />
                                    {/* {JSON.stringify(res.error)} */}
                                  </Col>
                                  <Col span={12}>
                                    <h4>返回数据:</h4>
                                    <CodeEditor language='json' value={JSON.stringify(res.data)} width={500} />
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </div>,
                        })
                      });
                      this.state.logs.push({
                        data: new Date().toLocaleTimeString(),
                      });
                    }
                  }}>
                  <Button
                    type="default"
                    onClick={() => {
                      this.setState({ openRunLogic: true })
                    }}
                    icon={<PlayCircleTwoTone />}
                  >
                    调试
                  </Button>
                </RunLogic>
                <span>当前版本:{logic.version}</span>
              </Space>

              {/* <Button
              type="default"
              onClick={() => {
                this.setState({ logs: [] });
              }}
              style={{
                marginLeft: '10px',
              }}
            >
              清空日志
            </Button> */}
              <Space style={{
                float: 'right',
                right: '16px',
              }}>
                {/* <span>
                  拖拽连线
                  <Switch
                    checked={embeddingEnable}
                    onChange={(v) => {
                      this.setState({ embeddingEnable: v })
                    }}
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                  />
                </span> */}
                <Button
                  type="text"
                  icon={
                    rightToolCollapsed ? (
                      <MenuFoldOutlined />
                    ) : (
                      <MenuUnfoldOutlined />
                    )
                  }
                  onClick={() => {
                    this.setState({ rightToolCollapsed: !rightToolCollapsed });
                  }}
                  style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                  }}
                />
              </Space>


            </Layout.Header>
            <Layout.Content className="app-content" >
              <DagreGraph
                ref={this.refContainer}
              />
            </Layout.Content>
          </Layout>
          <Layout.Sider
            theme="light"
            collapsed={rightToolCollapsed}
            collapsedWidth={0}
            width={600} >
            <Button
              type="text"
              onClick={() => {
                this.setState({ rightToolCollapsed: !rightToolCollapsed });
              }}
              style={{
                float: 'right',
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            >
              x
            </Button>
            <RightToolset
              onClear={() => this.setState({ logs: [] })}
              editNode={editingNode}
              onSubmit={this.handleSubmit}
              logs={this.state.logs}
              configSchemaProvider={this.props.configSchemaProvider ?? ConfigSchemaProvider}
            />
          </Layout.Sider>
        </Layout >
      </EditorContext.Provider >
    );
  }
}
