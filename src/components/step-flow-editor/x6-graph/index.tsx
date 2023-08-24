import { BarsOutlined, EllipsisOutlined, MenuFoldOutlined, MenuUnfoldOutlined, RocketOutlined, SaveOutlined, SettingOutlined } from '@ant-design/icons';
import { CellView, Dom, Edge, EdgeView, Graph, Node, Shape } from '@antv/x6';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Stencil } from '@antv/x6-plugin-stencil';
import { Scroller } from '@antv/x6-plugin-scroller'
import { Export } from '@antv/x6-plugin-export'
import { loader } from '@monaco-editor/react';
import { Button, Dropdown, Layout, MenuProps, Modal, Space, message } from 'antd';
import * as monaco from 'monaco-editor';
import React from 'react';
import { StepFlow } from '../../step-flow-core/types';
import { GraphToStepFlow } from '@/components/step-flow-core/lasl/parser/step-flow-parser';
import './index.css';
import LeftTool from '../left-toolset';
import RightToolset from '../right-toolset';
import { InitPanelData } from './settings/PanelSetting';
import { DefaultGraph, RegistShape } from './settings/InitGraph';
import { ports } from './settings/Consts';
import { DagreLayout } from '@antv/layout';
import { ConfigSchemaProvider } from './settings/DefaultFormExt';
import DagreGraph from './instance/dagre-graph';
import FlowSetting from './settings/flow-setting';
import { dealGraphNodeWhenAddedFromPanel } from './helper/node-mapping/indext';
import { autoDagreLayout } from './layout/dagreLayout';
import { TypeAnnotationParser } from '../../step-flow-core/lasl/parser/type-annotation-parser';


type EditorCtx = {
  stepFlow: StepFlow,
  flowVar?: Object,
  flowInput?: Object,
  flowReturn?: Object,
  flowEnv?: Object,
}
const saveBtns = [
  // { key: 'saveToBrowser', label: '缓存到浏览器' },
  { key: 'saveToPng', label: '导出图片' },
  { key: '-', label: '------------' },
  { key: 'loadFromBrowser', label: '从浏览器恢复' },
  // { key: 'saveToClipboard', label: '复制到剪贴板' }
];

export const EditorContext = React.createContext<EditorCtx>({
  stepFlow: { steps: [] }
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
  graph?: Graph;
  leftToolCollapsed: boolean;
  rightToolCollapsed: boolean;
  stepFlow: StepFlow;
  openFlowSetting: boolean;
  editorCtx: EditorCtx
  // flowRunner: FlowRunner;
  logs: any[];
  panel: {
    nodes: any[];
    groups: any[];
  };
};
interface EditorProps {
  name?: string;
  config?: StepFlow;
  customSharps?: any[];
  customGroups?: any[];
  customNodes?: any[];
  showLeft?: boolean;
  showRight?: boolean;
  configSchemaProvider?: (type: string) => any;
  // readyCallback?: (graph: Graph, flowRunner: FlowRunner) => void;
}
export default class X6Graph extends React.Component<EditorProps> {
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
    editingEdge: undefined,
    leftToolCollapsed: false,
    rightToolCollapsed: true,
    stepFlow: {
      steps: [],
      input: "{\r\t \r\n}",
      var: "{\r\t \r\n}",
      return: "{\r\t \r\n}",
      env: "{\r\t \"host\":\"\"\r\n}",
    },
    openFlowSetting: false,
    // flowRunner: new FlowRunner(),
    editorCtx: { stepFlow: { steps: [] } },
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
    if (this.props.config && this.props.config != this.state.stepFlow) {
      this.state.stepFlow = this.props.config;
      this.state.graph?.fromJSON(this.state.stepFlow?.visualConfig);
      this.setState({ editingNode: undefined });
    }
  }

  componentDidMount() {
    this.initGraph(this.container);
    this.updateFlowAndEditorCtx(this.state.stepFlow)
    //注册运行日志监听
    // this.state.flowRunner.on('log', (msg) => {
    //   this.state.logs.push(msg);
    //   this.setState({ logs: [...this.state.logs] });
    // });
    loader.config({ monaco });
  }
  //初始化画布以及事件配置
  initGraph = (container?: HTMLDivElement) => {
    const graph = new Graph({
      container: container,
      embedding: {
        enabled: true,
        validate: (args: {
          child: Node,
          parent: Node,
          childView: CellView,
          parentView: CellView,
        }) => {
          console.log('validate')
          console.log(args)
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
      if (linkNode) {
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
      this.state.stepFlow = this.props.config;
      graph.fromJSON(this.state.stepFlow.visualConfig);
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
        const localData = localStorage.getItem('step-flow-json');
        if (localData) {
          const flow: StepFlow = JSON.parse(localData);
          this.state.stepFlow = flow;
          this.state.graph?.fromJSON(flow.visualConfig);
          this.saveAndConvertGraphToDsl();
        } else {
          message.info('浏览器无缓存数据');
        }
        break;
      case 'saveToClipboard':

        break;
      case 'saveToPng':
        this.state.graph?.exportPNG(new Date().toLocaleDateString());
        // this.state.graph?.exportPNG(new Date().toLocaleDateString(), { backgroundColor: '#F2F7FA', padding: 10, quality: 1 });
        break;
    }
  };
  updateFlowAndEditorCtx = (updatedFlowProps: StepFlow) => {
    const newFlow = { ...this.state.stepFlow, ...updatedFlowProps };
    this.setState({
      stepFlow: newFlow,
      editorCtx: {
        ...this.state.editorCtx,
        flowVar: JSON.parse(newFlow.var),
        flowInput: JSON.parse(newFlow.input),
        flowReturn: JSON.parse(newFlow.return),
        flowEnv: JSON.parse(newFlow.env),
      }
    });
    return newFlow;
  }
  //保存到浏览器并转换dsl
  saveAndConvertGraphToDsl = () => {
    const data = this.state.graph?.toJSON();
    const graphFlow = this.convertGraphToDsl(data);//根据图转换的flow，只包含steps值
    if (graphFlow) {
      const newFlow = this.updateFlowAndEditorCtx(graphFlow)
      const flowJson = JSON.stringify(newFlow);
      localStorage.setItem('step-flow-json', flowJson);//缓存到浏览器
      navigator.clipboard.writeText(flowJson);//复制到剪贴板
      // this.state.flowRunner.send('save', flowJson);//发送消息
      this.autoLayout(this.state.graph)//自动布局
    }
  };
  //保存参数配置
  saveFlowSettingAndConvertGraphToDsl = (settingValues) => {
    const input = JSON.parse(settingValues.input);
    console.log('input')
    console.log(input)
    Object.keys(input).forEach((key) => {
      console.log(TypeAnnotationParser.guessByValue(input[key]));
    })
    const newFlow = { ...this.state.stepFlow, ...settingValues };
    const flowJson = JSON.stringify(newFlow);
    this.updateFlowAndEditorCtx(settingValues)
    localStorage.setItem('step-flow-json', flowJson);//缓存到浏览器
    navigator.clipboard.writeText(flowJson);//复制到剪贴板
    // this.state.flowRunner.send('save', flowJson);//发送消息
    this.autoLayout(this.state.graph)//自动布局
  };
  convertGraphToDsl = (graphJson: any) => {
    const _flow = GraphToStepFlow(graphJson.cells);
    if (_flow) _flow.visualConfig = graphJson;
    return _flow;
  };
  setFlowSetting = (open) => {
    this.setState({ openFlowSetting: open })
  }
  render() {
    const {
      editingNode,
      leftToolCollapsed,
      rightToolCollapsed,
      stepFlow,
      editorCtx,
      graph,
      openFlowSetting
    } = this.state;
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
              stepFlow={stepFlow}
              onConfigChange={this.handleOnConfigChange}
            />
          </Layout.Sider>
          <Layout style={{ height: '100%' }}>
            <Layout.Header style={{ padding: 0, backgroundColor: 'white' }}>
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
              <Space direction="horizontal">
                <Dropdown.Button
                  style={{ float: 'inline-start' }}
                  menu={{
                    items: saveBtns, onClick: this.onSaveMenuClick
                  }}
                  buttonsRender={(menu) => {
                    return [
                      <Button type='primary' icon={<SaveOutlined />}
                        style={{ width: '100px' }}
                        onClick={this.saveAndConvertGraphToDsl} >保存</Button>,
                      <Button type='primary' icon={<EllipsisOutlined />} />
                    ]
                  }}
                  onClick={this.saveAndConvertGraphToDsl}
                >
                  保存
                </Dropdown.Button >
                <FlowSetting open={openFlowSetting}
                  values={{
                    ...stepFlow
                  }}
                  setOpen={this.setFlowSetting}
                  onSubmit={this.saveFlowSettingAndConvertGraphToDsl}
                >
                  <Button
                    onClick={() => this.setFlowSetting(true)}
                    icon={<BarsOutlined />}
                  >入出参</Button>
                </FlowSetting>
                <Button
                  type='dashed'
                  icon={<RocketOutlined />}
                  onClick={() => {
                    this.autoLayout(this.state.graph)
                  }}
                ></Button>
              </Space >
              {/* <Button
              type="default"
              onClick={() => {
                if (this.state.stepFlow) {
                  this.state.flowRunner.init(this.state.stepFlow);
                  this.state.logs.push({
                    data: new Date().toLocaleTimeString(),
                  });
                  this.state.flowRunner.invoke({}, (res: any) =>
                    message.info('执行成功，返回值\n' + JSON.stringify(res)),
                  );
                }
              }}
              style={{
                marginLeft: '10px',
              }}
            >
              在浏览器运行
            </Button> */}
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
                  float: 'right',
                  right: '16px',
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />

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
              configSchemaProvider={ConfigSchemaProvider}
            />
          </Layout.Sider>
        </Layout >
      </EditorContext.Provider>
    );
  }
}
