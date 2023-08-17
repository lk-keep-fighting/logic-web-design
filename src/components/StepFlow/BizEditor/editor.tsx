import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Edge, EdgeView, Graph, Node, Shape } from '@antv/x6';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Stencil } from '@antv/x6-plugin-stencil';
import { loader } from '@monaco-editor/react';
import { Button, Layout, Modal, message } from 'antd';
import * as monaco from 'monaco-editor';
import React from 'react';
import { StepFlow } from '../core/definition/StepFlow';
import { FlowRunner } from '../runtime/index';
import { GraphToStepFlow } from '../core/dsl-convert/index';
import './editor.css';
import LeftTool from '../left-toolset';
import RightToolset from '../right-toolset';
import { InitPanelData } from './settings/PanelSetting';
import { RegistShape } from './settings/InitGraph';
import { ports } from './settings/Consts';
import { DagreLayout } from '@antv/layout';

type EditorCtx = {
  stepFlow: StepFlow,
  jsProvider?: any,
  flowVar?: Map<string, any>,
  flowInput?: Map<string, any>,
}
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
  editorCtx: EditorCtx
  flowRunner: FlowRunner;
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
  readyCallback?: (graph: Graph, flowRunner: FlowRunner) => void;
}
export default class Editor extends React.Component<EditorProps> {
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
    stepFlow: { steps: [] },
    flowRunner: new FlowRunner(),
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
    //注册运行日志监听
    this.state.flowRunner.on('log', (msg) => {
      this.state.logs.push(msg);
      this.setState({ logs: [...this.state.logs] });
    });
    loader.config({ monaco });
  }
  //初始化画布以及事件配置
  initGraph = (container?: HTMLDivElement) => {
    const graph = new Graph({
      container: container,
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
            radius: 8,
          },
        },
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        snap: {
          radius: 20,
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#A2B1C3',
                strokeWidth: 2,
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8,
                },
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
            zIndex: 50,
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
      panning: {
        enabled: true,
      },
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
      )
      .use(new Keyboard())
      .use(new Clipboard())
      .use(
        //框选
        new Selection({
          enabled: true,
        }),
      );

    graph.on('edge:dblclick', ({ cell }) => {
      // this.setState({ openEdgeEditor: true, editingEdge: cell })
    });

    graph.on('edge:mouseenter', ({ cell }) => {
      // cell.addTools([
      //     {
      //         name: "source-arrowhead",
      //         args: {
      //             attrs: {
      //                 fill: "red",
      //                 visibility: "hidden"
      //             },
      //         },
      //     },
      //     {
      //         name: "target-arrowhead",
      //         args: {
      //             attrs: {
      //                 fill: "red",
      //                 visibility: "hidden"
      //             },
      //         },
      //     },
      // ])
      const ports = this.container?.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>;
      showPorts(ports, true);
    });

    graph.on('edge:mouseleave', ({ cell }) => {
      // cell.removeTools();
      const ports = this.container?.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>;
      showPorts(ports, false);
    });
    graph.on('node:mouseenter', () => {
      const ports = this.container?.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>;
      showPorts(ports, true);
    });
    graph.on('node:click', ({ e, x, y, node, view }) => {
      this.setState({ editingNode: node });
    });
    graph.on('node:added', ({ node, index, options }) => {
      const data = node.getData();
      console.log('node added', node, index, options);
      console.log('node data', data);
      if (node.shape == 'ExtSharp') {
        switch (data.config.type) {
          case 'string':
            const strNode = graph.createNode({
              shape: 'string',
              position: node.position(),
              width: 120,
              height: 50,
              ports,
              data: node.data
            })
            graph.removeNode(node);
            graph.addNode(strNode);
            break;
          case 'num':
            const numNode = graph.createNode({
              shape: 'num',
              position: node.position(),
              width: 120,
              height: 50,
              ports,
              data: node.data
            })
            graph.removeNode(node);
            graph.addNode(numNode);
            break;
          case 'assignment':
            const assignmentNode = graph.createNode({
              shape: 'assignment',
              position: node.position(),
              width: 220,
              height: 50,
              ports,
              data: node.data
            })
            graph.removeNode(node);
            graph.addNode(assignmentNode);
            break;
          default:
            break;
        }

      }
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
      // this.setState({ rightToolCollapsed: false, editingNode: node })
    });

    graph.on('node:mouseleave', () => {
      const ports = this.container?.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>;
      showPorts(ports, false);
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
        graph.removeCells(cells);
      }
    });

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
      // const layoutJson = gridLayout.layout(this.state.stepFlow.visualConfig);
      // graph.fromJSON(layoutJson)
      graph.fromJSON(this.state.stepFlow.visualConfig);
    } else {
      const defGraph = {
        "cells": [
          {
            "position": {
              "x": 430,
              "y": 90
            },
            "size": {
              "width": 50,
              "height": 50
            },
            "attrs": {
              "text": {
                "fontSize": 12,
                "text": "start"
              }
            },
            "visible": true,
            "shape": "circle",
            "id": "db9759b5-13af-4956-89e3-54ae3b233208",
            "data": {
              "config": {
                "type": "start",
                "parameter": "{\r\n    \r\n}",
                "data": "{\r\n    \r\n}"
              }
            },
            "ports": {
              "groups": {
                "top": {
                  "position": "top",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "right": {
                  "position": "right",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "bottom": {
                  "position": "bottom",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "left": {
                  "position": "left",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                }
              },
              "items": [
                {
                  "group": "top",
                  "id": "2b2f4a95-8bf3-449f-aaaf-a75e911a329d"
                },
                {
                  "group": "right",
                  "id": "e59eaf1f-e988-456a-9875-442d9b929090"
                },
                {
                  "group": "bottom",
                  "id": "36a3968f-c25e-4a12-a28c-703a3ede1da7"
                },
                {
                  "group": "left",
                  "id": "9f5a3a60-11dd-40db-bd70-14bbed03b28f"
                }
              ]
            },
            "zIndex": 1
          },
          {
            "position": {
              "x": 430,
              "y": 411
            },
            "size": {
              "width": 50,
              "height": 50
            },
            "attrs": {
              "text": {
                "text": "end"
              },
              "body": {
                "fill": "#d9d9d9"
              }
            },
            "visible": true,
            "shape": "circle",
            "id": "31409c72-b23b-48e8-bff8-92fb65b50c2a",
            "data": {
              "config": {
                "type": "end"
              }
            },
            "ports": {
              "groups": {
                "top": {
                  "position": "top",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "right": {
                  "position": "right",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "bottom": {
                  "position": "bottom",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                },
                "left": {
                  "position": "left",
                  "attrs": {
                    "circle": {
                      "r": 4,
                      "magnet": true,
                      "stroke": "#5F95FF",
                      "strokeWidth": 1,
                      "fill": "#fff",
                      "style": {
                        "visibility": "hidden"
                      }
                    }
                  }
                }
              },
              "items": [
                {
                  "group": "top",
                  "id": "f6ed92b1-1ddb-490c-b0a5-5c06cceba5c8"
                },
                {
                  "group": "right",
                  "id": "2a4c49f2-f5f3-4b23-bc59-0981a9b82a8f"
                },
                {
                  "group": "bottom",
                  "id": "8e9f8edd-a0da-4706-9e91-57983af4928b"
                },
                {
                  "group": "left",
                  "id": "f7a34ae9-c439-4c99-bec3-4dd7683161a8"
                }
              ]
            },
            "zIndex": 2
          },
          // {
          //   "shape": "edge",
          //   "attrs": {
          //     "line": {
          //       "stroke": "#A2B1C3",
          //       "targetMarker": {
          //         "name": "block",
          //         "width": 12,
          //         "height": 8
          //       }
          //     }
          //   },
          //   "id": "5eb3abe3-9d9c-4ed5-8edd-2ff20dedd5b9",
          //   "zIndex": 50,
          //   "tools": {
          //     "items": [
          //       {
          //         "name": "edge-editor",
          //         "args": {
          //           "attrs": {
          //             "backgroundColor": "#fff"
          //           }
          //         }
          //       }
          //     ]
          //   },
          //   // "labels": [
          //   //   {
          //   //     "position": {
          //   //       "distance": 120
          //   //     },
          //   //     "attrs": {
          //   //       "label": {
          //   //         "text": "+"
          //   //       }
          //   //     }
          //   //   }
          //   // ],
          //   "source": {
          //     "cell": "db9759b5-13af-4956-89e3-54ae3b233208",
          //     "port": "36a3968f-c25e-4a12-a28c-703a3ede1da7"
          //   },
          //   "target": {
          //     "cell": "31409c72-b23b-48e8-bff8-92fb65b50c2a",
          //     "port": "f6ed92b1-1ddb-490c-b0a5-5c06cceba5c8"
          //   }
          // }
        ]
      };
      graph.fromJSON(defGraph);
    }
    // graph.centerContent();

    if (this.props.readyCallback)
      this.props.readyCallback(graph, this.state.flowRunner);
    return graph;
  };

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };
  refStencil = (container: HTMLDivElement) => {
    this.stencilContainer = container;
  };
  //处理表单提交
  handleSubmit = (v: any) => {
    this.saveAndConvertGraphToDsl();
    let startStep = this.state.stepFlow?.steps.find(v => v.type == 'start');
    if (startStep) {//如果存在开始节点读取全局变量
      console.log('startStep', startStep);
      this.setState(
        {
          editorCtx: {
            ...this.state.editorCtx,
            flowVar: JSON.parse(startStep.data),
            flowInput: JSON.parse(startStep.parameter || ''),
          },
        }
      );
    }
    console.log(v);
    console.log('node-submit--', v,);
  };
  handleOnConfigChange = (v: string) => {
    try {
      const newFlow = JSON.parse(v);
      this.setState({ stepFlow: newFlow });
    } catch (error) {
      console.log(error);
    }
  };
  //保存到浏览器并转换dsl
  saveAndConvertGraphToDsl = () => {
    const data = this.state.graph?.toJSON();
    localStorage.setItem('step-flow-data', JSON.stringify(data));
    const flow = this.convertGraphToDsl(data);
    this.state.flowRunner.send('save', JSON.stringify(flow));
    this.state.stepFlow = flow || { steps: [] };
    this.setState({ stepFlow: flow });
    navigator.clipboard.writeText(JSON.stringify(flow));
  };
  convertGraphToDsl = (graphJson: any) => {
    const _flow = GraphToStepFlow(graphJson.cells);
    if (_flow) _flow.visualConfig = graphJson;
    return _flow;
  };
  render() {
    const {
      editingNode,
      leftToolCollapsed,
      rightToolCollapsed,
      stepFlow,
      editorCtx,
      graph,
    } = this.state;
    console.log('editorCtx', editorCtx);
    return (
      <Layout style={{ height: '100vh', width: '100%' }}>
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
            <Button
              type="primary"
              onClick={() => {
                this.saveAndConvertGraphToDsl();
              }}
              style={{}}
            >
              保存&转换
            </Button>
            <Button
              type="primary"
              onClick={() => {
                const localData = localStorage.getItem('step-flow-data');
                if (localData) {
                  this.state.graph?.fromJSON(JSON.parse(localData));
                  this.saveAndConvertGraphToDsl();
                } else {
                  message.info('浏览器无缓存数据');
                }
              }}
              style={{
                marginLeft: '10px',
              }}
            >
              从浏览器恢复
            </Button>
            {/* 
            <Button
              type="primary"
              onClick={() => {
                const data = this.state.stepFlow?.visualConfig;
                this.state.graph?.fromJSON(data);
                this.saveAndConvertGraphToDsl();
              }}
              style={{
                marginLeft: '10px',
              }}
            >
              从DSL加载
            </Button> */}
            <Button
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
            </Button>
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
          <Layout.Content
            className="app-content"
            ref={this.refContainer}
          ></Layout.Content>
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
          <EditorContext.Provider value={editorCtx}>
            <RightToolset
              onClear={() => this.setState({ logs: [] })}
              editNode={editingNode}
              onSubmit={this.handleSubmit}
              logs={this.state.logs}
              configSchemaProvider={this.props.configSchemaProvider}
            />
          </EditorContext.Provider>
        </Layout.Sider>
      </Layout>
    );
  }
}
