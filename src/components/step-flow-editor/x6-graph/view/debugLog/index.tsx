import { MenuFoldOutlined, MenuUnfoldOutlined, PlayCircleTwoTone } from '@ant-design/icons';
import { CellView, Edge, Graph, Node, Shape } from '@antv/x6';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Stencil } from '@antv/x6-plugin-stencil';
import { Scroller } from '@antv/x6-plugin-scroller'
import { Export } from '@antv/x6-plugin-export'
import { loader } from '@monaco-editor/react';
import { Button, Layout, List, Space } from 'antd';
import * as monaco from 'monaco-editor';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import './index.css';
import { InitPanelData } from '@/components/step-flow-editor/x6-graph/settings/PanelSetting';
import { DefaultGraph, RegistShape } from '@/components/step-flow-editor/x6-graph/settings/InitGraph';
import DagreGraph from '@/components/step-flow-editor/x6-graph/instance/dagre-graph';
import { autoDagreLayout } from '@/components/step-flow-editor/x6-graph/layout/dagreLayout';
import { Schema } from 'form-render';
import { Logic, LogicItem } from '@/components/step-flow-core/lasl/meta-data';
import { ButtonProps } from 'antd/lib/button';

type EditorCtx = {
  logic: Logic,
}
export const EditorContext = React.createContext<EditorCtx>({
  logic: new Logic('')
})

// 控制连接桩显示/隐藏
type StateType = {
  editingNode?: Node;
  openEdgeEditor: boolean;
  editingEdge?: Edge;
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
interface ItemLog {
  name: string, paramsJson: object, config: LogicItem
}
interface Log {
  success: boolean
  serverTime: string
  message: string
  debug: {
    itemLogs: ItemLog[],
    paramsJson: object
    success: boolean
  }
}
interface DebugProps {
  name?: string;
  config?: Logic;
  nextId?: string,
  btns?: ReactNode[],
  debugLogs?: Log[],
  configSchemaProvider?: (type: string) => Promise<Schema>;
}

const DebugLog = (props: DebugProps) => {
  const [graph, setGraph] = useState<Graph>();
  const [logic, setLogic] = useState<Logic>();
  const [leftToolCollapsed, setLeftToolCollapsed] = useState(true)
  const [rightToolCollapsed, setRightToolCollapsed] = useState(true)
  const [curItemLog, setCurItemLog] = useState<ItemLog>()
  const [curLogIndex, setCurLogIndex] = useState(0)
  const [curItemLogIndex, setCurItemLogIndex] = useState(0)
  const refContainer = useRef();
  useEffect(() => {
    console.log('play curItemLog', curItemLog)
    // graph?.getNodes().find(n => n.id == curItemLog?.config?.id)?.attr('body/fill', 'green')
  }, [curItemLog])
  useEffect(() => {
    graph?.getNodes().find(n => n.id == props.nextId)?.attr('body/fill', 'red')
  }, [props.nextId])
  useEffect(() => {
    graph?.getNodes().find(n => n.id == props.nextId)?.attr('body/fill', 'red')
  }, [graph])
  useEffect(() => {
    if (props.config) {
      setLogic(props.config)
    }
  }, [props.config])
  useEffect(() => {
    console.log('props.debugLogs', props.debugLogs)
    if (props.debugLogs?.length > 0) {
      setInterval(replayLogs, 2000);
    }
  }, [curItemLogIndex, props.debugLogs])
  useEffect(() => {
    if (!logic) return;
    try {
      const { Shapes } = InitPanelData();
      RegistShape(Shapes);

    } catch (error) {
      console.error('注册节点出错：');
      console.error(error);
    }
    const graph = new Graph({
      container: refContainer.current,
      embedding: {
        enabled: true,
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

    graph.on('edge:dblclick', () => {
    });

    graph.on('edge:mouseenter', () => {
    });

    graph.on('edge:mouseleave', () => {
    });
    graph.on('node:moved', () => {

    })
    graph.on('node:mouseenter', () => {
    });

    graph.on('node:mouseleave', () => {
    });
    graph.on('node:click', ({ node }) => {
    });
    graph.on('node:added', () => {
    })
    graph.on('node:dblclick', ({ node }) => {
      setRightToolCollapsed(false)
    });

    graph.on('blank:dblclick', ({ x, y }) => {
    })
    console.log('logic')
    console.log(logic)
    graph.fromJSON(logic.visualConfig);
    autoDagreLayout(graph);
    setGraph(graph);
  }, [logic])
  const replayLogs = () => {
    console.log('curItemLogIndex,', curItemLogIndex)
    if (props.debugLogs) {
      setCurItemLog(props.debugLogs[curLogIndex].debug.itemLogs[curItemLogIndex]);
      if (curItemLogIndex == props.debugLogs[curLogIndex].debug.itemLogs.length - 1 && curLogIndex < props.debugLogs.length - 1) {
        setCurItemLogIndex(0);
        setCurLogIndex(curLogIndex + 1);
      }
      if (curItemLogIndex < props.debugLogs[curLogIndex].debug.itemLogs.length) {
        console.log('curItemLogIndex,', curItemLogIndex)
        setCurItemLogIndex(curItemLogIndex + 1);
      }
    }
  }
  return <Layout style={{ height: '100vh', width: '100%', margin: 0 }}>
    <Layout.Sider
      theme="light"
      collapsed={leftToolCollapsed}
      collapsedWidth={0}
      width={300}
    >
      <List
        itemLayout="horizontal"
        dataSource={props.debugLogs}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              title={item.success + ':' + item.serverTime}
              description={item.message}
            />
          </List.Item>
        )}
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
            setLeftToolCollapsed(!leftToolCollapsed);
          }}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
        <Space direction="horizontal">
          <Button icon={<PlayCircleTwoTone />} onClick={() => {
            setInterval(() => {
              replayLogs();
            }, 1000)
          }}></Button>
          {props.btns?.map(b => b)}
          {/* <Button onClick={() => {
            // this.state.graph?.getNodes()[2].attr('body/fill', 'red');
          }}></Button> */}
        </Space>
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
            setRightToolCollapsed(!rightToolCollapsed);
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
          ref={refContainer}
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
          setRightToolCollapsed(!rightToolCollapsed)
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
      {/* <RightToolset
      onClear={() => this.setState({ logs: [] })}
      editNode={editingNode}
      onSubmit={() => { }}
      logs={this.state.logs}
      configSchemaProvider={this.props.configSchemaProvider ?? ConfigSchemaProvider}
    /> */}
    </Layout.Sider>
  </Layout >
}
export default DebugLog;
// class DebugLoigc extends React.Component<DebugProps, StateType> {
//   private container?: HTMLDivElement;
//   constructor(props: DebugProps) {
//     super(props);
//     try {
//       const { Shapes } = InitPanelData(
//         props.customNodes,
//         props.customGroups,
//         props.customSharps,
//       );
//       RegistShape(Shapes);

//     } catch (error) {
//       console.error('注册节点出错：');
//       console.error(error);
//     }
//   }
//   state: StateType = {
//     editingNode: undefined,
//     openEdgeEditor: false,
//     editingEdge: undefined,
//     leftToolCollapsed: true,
//     rightToolCollapsed: true,
//     openFlowSetting: false,
//     openRunLogic: false,
//     // flowRunner: new FlowRunner(),
//     editorCtx: { logic: new Logic('1') },
//     logs: [],
//     panel: {
//       nodes: [],
//       groups: [],
//     },
//   };
//   handleEdgeSubmit = (v: any) => {
//     this.state.editingEdge?.setLabels(v);
//   };
//   componentDidUpdate(
//     prevProps: Readonly<DebugProps>,
//     prevState: Readonly<StateType>,
//     snapshot?: any,
//   ): void {
//     if (this.props.config && this.state.editorCtx.logic.id != this.props.config.id) {
//       this.state.editorCtx.logic = this.props.config;
//       if (this.state.editorCtx?.logic?.visualConfig)
//         this.state.graph?.fromJSON(this.state.editorCtx.logic?.visualConfig);
//       this.setState({ editingNode: undefined });
//     }
//   }

//   componentDidMount() {
//     this.initGraph(this.container);
//     //注册运行日志监听
//     // this.state.flowRunner.on('log', (msg) => {
//     //   this.state.logs.push(msg);
//     //   this.setState({ logs: [...this.state.logs] });
//     // });
//     loader.config({ monaco });
//   }
//   //初始化画布以及事件配置
//   initGraph = (container?: HTMLDivElement) => {
//     const graph = new Graph({
//       container: container,
//       embedding: {
//         enabled: true,
//         validate: (args: {
//           child: Node,
//           parent: Node,
//           childView: CellView,
//           parentView: CellView,
//         }) => {
//           //实现拖拽连接，设置自动顺序连接的节点
//           args.child.setData({ hoverNode: args.parent })
//           return true;
//         }
//       },
//       mousewheel: {
//         enabled: true,
//         // zoomAtMousePosition: true,
//         modifiers: 'ctrl',
//         minScale: 0.5,
//         maxScale: 3,
//       },
//       connecting: {
//         router: 'manhattan',
//         connector: {
//           name: 'rounded',
//           args: {
//             radius: 15,
//           },
//         },
//         anchor: 'center',
//         connectionPoint: 'anchor',
//         allowBlank: false,
//         allowMulti: true,
//         snap: {
//           radius: 20,
//         },
//         createEdge() {
//           return new Shape.Edge({
//             tools: [
//               {
//                 name: 'edge-editor',
//                 args: {
//                   attrs: {
//                     backgroundColor: '#fff',
//                   },
//                 },
//               },
//             ],
//             zIndex: 0
//           });
//         },
//         validateConnection({ targetMagnet }) {
//           return !!targetMagnet;
//         },
//       },
//       highlighting: {
//         magnetAdsorbed: {
//           name: 'stroke',
//           args: {
//             attrs: {
//               fill: '#5F95FF',
//               stroke: '#5F95FF',
//             },
//           },
//         },
//       },
//       background: {
//         color: '#F2F7FA',
//       },
//       grid: true,
//       // panning: {
//       //   enabled: true,
//       // },
//     });
//     //对齐线
//     graph
//       .use(
//         new Snapline({
//           enabled: true,
//           sharp: true,
//         }),
//       )
//       .use(
//         //撤销重做
//         new History({
//           enabled: true,
//         }),
//       ).use(
//         //框选
//         new Selection({
//           enabled: true,
//           multiple: true,
//           strict: true,
//           rubberband: true,
//           movable: true,
//           showNodeSelectionBox: true,
//           pointerEvents: "none"
//         }),
//       )
//       .use(new Scroller({
//         enabled: true
//       }))
//       .use(new Keyboard())
//       .use(new Clipboard())
//       .use(new Export());

//     graph.on('edge:dblclick', () => {
//     });

//     graph.on('edge:mouseenter', () => {
//     });

//     graph.on('edge:mouseleave', () => {
//     });
//     graph.on('node:moved', () => {

//     })
//     graph.on('node:mouseenter', () => {
//     });

//     graph.on('node:mouseleave', () => {
//     });
//     graph.on('node:click', ({ node }) => {
//       this.setState({ editingNode: node });
//     });
//     graph.on('node:added', () => {
//     })
//     graph.on('node:dblclick', ({ node }) => {
//       this.setState({ rightToolCollapsed: false, editingNode: node })
//     });

//     graph.on('blank:dblclick', ({ x, y }) => {
//       console.log('blank:dbclick', x, y);
//       this.autoLayout(graph)
//     })

//     // zoom
//     graph.bindKey(['ctrl+1', 'meta+1'], () => {
//       const zoom = graph.zoom();
//       if (zoom < 1.5) {
//         graph.zoom(0.1);
//       }
//     });
//     graph.bindKey(['ctrl+2', 'meta+2'], () => {
//       const zoom = graph.zoom();
//       if (zoom > 0.5) {
//         graph.zoom(-0.1);
//       }
//     });
//     this.state.graph = graph;

//     if (this.props.config) {
//       this.state.editorCtx.logic = this.props.config;
//       graph.fromJSON(this.state.editorCtx.logic.visualConfig);
//     } else {
//       DefaultGraph(graph);
//       this.autoLayout(graph)
//     }
//     return graph;
//   };
//   autoLayout = (graph: Graph) => {
//     autoDagreLayout(graph);
//   }
//   refContainer = (container: HTMLDivElement) => {
//     this.container = container;
//   };

//   setFlowSetting = (open: boolean) => {
//     this.setState({ openFlowSetting: open })
//   }
//   render() {
//     const {
//       leftToolCollapsed,
//       rightToolCollapsed,
//       editorCtx,
//     } = this.state;
//     return (
//       <EditorContext.Provider value={editorCtx}>
//         <Layout style={{ height: '100vh', width: '100%', margin: 0 }}>
//           <Layout.Sider
//             theme="light"
//             collapsed={leftToolCollapsed}
//             collapsedWidth={0}
//             width={300}
//           >
//           </Layout.Sider>
//           <Layout style={{ height: '100%' }}>
//             <Layout.Header style={{ padding: 0, backgroundColor: 'white' }}>
//               <Button
//                 type="text"
//                 icon={
//                   leftToolCollapsed ? (
//                     <MenuUnfoldOutlined />
//                   ) : (
//                     <MenuFoldOutlined />
//                   )
//                 }
//                 onClick={() => {
//                   this.setState({ leftToolCollapsed: !leftToolCollapsed });
//                 }}
//                 style={{
//                   fontSize: '16px',
//                   width: 64,
//                   height: 64,
//                 }}
//               />
//               <Space direction="horizontal">
//                 <Button onClick={() => {
//                   this.state.graph?.getNodes()[2].attr('body/fill', 'red');
//                 }}></Button>
//               </Space>
//               {this.props.btns?.map(b => <Button {...b} />)}
//               <Button
//                 type="text"
//                 icon={
//                   rightToolCollapsed ? (
//                     <MenuFoldOutlined />
//                   ) : (
//                     <MenuUnfoldOutlined />
//                   )
//                 }
//                 onClick={() => {
//                   this.setState({ rightToolCollapsed: !rightToolCollapsed });
//                 }}
//                 style={{
//                   float: 'right',
//                   right: '16px',
//                   fontSize: '16px',
//                   width: 64,
//                   height: 64,
//                 }}
//               />

//             </Layout.Header>
//             <Layout.Content className="app-content" >
//               <DagreGraph
//                 ref={this.refContainer}
//               />
//             </Layout.Content>
//           </Layout>
//           <Layout.Sider
//             theme="light"
//             collapsed={rightToolCollapsed}
//             collapsedWidth={0}
//             width={600} >
//             <Button
//               type="text"
//               onClick={() => {
//                 this.setState({ rightToolCollapsed: !rightToolCollapsed });
//               }}
//               style={{
//                 float: 'right',
//                 fontSize: '16px',
//                 width: 64,
//                 height: 64,
//               }}
//             >
//               x
//             </Button>
//             {/* <RightToolset
//               onClear={() => this.setState({ logs: [] })}
//               editNode={editingNode}
//               onSubmit={() => { }}
//               logs={this.state.logs}
//               configSchemaProvider={this.props.configSchemaProvider ?? ConfigSchemaProvider}
//             /> */}
//           </Layout.Sider>
//         </Layout >
//       </EditorContext.Provider>
//     );
//   }
// }
