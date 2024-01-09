import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { EllipsisOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SaveOutlined } from '@ant-design/icons';
import { Edge, Graph, Node, Shape } from '@antv/x6';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Stencil } from '@antv/x6-plugin-stencil';
import { Scroller } from '@antv/x6-plugin-scroller'
import { Export } from '@antv/x6-plugin-export'
import { Button, Dropdown, Layout, MenuProps, Select, Space, message } from 'antd';
import { GraphToProcessLogic } from '@/components/step-flow-core/lasl/parser/logic-parser';
import './index.css';
import RightToolset from '../right-toolset';
import { DefaultGraph, RegistShape } from './settings/InitGraph';
import DagreGraph from './instance/dagre-graph';
import { dealGraphNodeWhenAddedFromPanel } from './helper/node-mapping/indext';
import { autoDagreLayout } from './layout/dagreLayout';
import { TypeAnnotationParser } from '../../step-flow-core/lasl/parser/type-annotation-parser';
import { Schema } from 'form-render';
import { Logic } from '@/components/step-flow-core/lasl/meta-data';
import { ButtonProps } from 'antd/lib/button';
import dayjs from 'dayjs';
import { Transform } from '@antv/x6-plugin-transform';
import { LogicNodeConfig } from './settings/PresetNodes';
import { ProcessInput } from '@/pages/process-logic/services/dtos/processInput';


class EditorCtx {
  logic?: ProcessInput
}
const saveBtns = [
  // { key: 'saveToBrowser', label: '缓存到浏览器' },
  { key: 'saveToPng', label: '导出图片' },
  // { key: '-', label: '-' },
  // { key: 'loadFromBrowser', label: '从浏览器恢复' },
  // { key: 'saveToClipboard', label: '复制到剪贴板' }
];

export const EditorContext = React.createContext<EditorCtx>({
  logic: new Logic('')
})


class StateType {
  constructor() {
    this.editorCtx = new EditorCtx();
    this.panel = {
      nodes: [],
      groups: []
    };
  }
  editingNode?: Node;
  openEdgeEditor: boolean | undefined;
  editingEdge?: Edge;
  embeddingEnable: boolean | undefined;
  graph?: Graph;
  leftToolCollapsed: boolean | undefined;
  rightToolCollapsed: boolean | undefined;
  editorCtx: EditorCtx;
  logs: any[] | undefined;
  panel: {
    nodes: LogicNodeConfig[],
    groups: []
  };
};
class EditorProps {
  constructor() {
    this.toolElements = []
    this.panelData = {
      Nodes: [], Shapes: [], Groups: []
    }
    this.showLeft = true;
    this.showRight = false;
    this.lineStyle = {
      color: 'black'
    }
  }
  graphIns: Graph | undefined;
  onGraphInsChange: ((graph: Graph) => void) | undefined;
  name?: string;
  showLeft?: boolean;
  showRight?: boolean;
  toolElements: ReactElement[];
  panelData: {
    Nodes: LogicNodeConfig[],
    Shapes: any[],
    Groups: Stencil.Group[]
  };
  graphJson?: Object;
  // lineStyle: { color: 'black' | 'red'; };
  createEdge?: () => Edge;
  configSchemaProvider?: (type: string) => Promise<Schema>;
  onSave?: (graph: Graph) => void;
  // readyCallback?: (graph: Graph, flowRunner: FlowRunner) => void;
}
// 控制连接桩显示/隐藏
const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
  for (let i = 0, len = ports.length; i < len; i += 1) {
    ports[i].style.visibility = show ? 'visible' : 'hidden';
  }
};
const MESLogicEditor = (props: EditorProps) => {
  const [editingNode, setEditingNode] = useState();
  const [leftToolCollapsed, setLeftToolCollapsed] = useState<boolean>(!props.showLeft);
  const [rightToolCollapsed, setRightToolCollapsed] = useState<boolean>(!props.showRight);
  const [panel, setPanel] = useState<EditorProps['panelData']>(props.panelData);
  const [editorCtx, setEditorCtx] = useState<EditorCtx>(new EditorCtx());
  const [refStencil, setRefStencil] = useState<HTMLDivElement>();
  const [refContainer, setRefContainer] = useState<HTMLDivElement>();
  const [graph, setGraph] = useState<Graph>(props.graphIns);
  const [lineColor, setLineColor] = useState('black');
  const [stencilIns, setStencilIns] = useState<Stencil>();
  useEffect(() => {
    try {
      RegistShape(props.panelData.Shapes);
    } catch (error) {
      console.error('注册节点出错：');
      console.error(error);
    }
  }, [])
  useEffect(() => {
    if (graph)
      graph.options.connecting.createEdge = props.createEdge;
  }, [props.createEdge])
  useEffect(() => {
    if (props.lineStyle && props.lineStyle.color) {
      setLineColor(props.lineStyle.color as string)
    }
  }, [props.lineStyle])
  useEffect(() => {
    if (refContainer) {
      initGraph(refContainer);
    }
  }, [refContainer])

  useEffect(() => {
    if (graph && props.graphJson) {
      try {
        graph.fromJSON(props.graphJson)
      } catch (error) {
        message.error('图数据有误，已忽略');
        console.log(props.graphJson)
      }
    }
  }, [props.graphJson])

  function initGraph(container?: HTMLDivElement) {
    console.log('initGraph');
    if (!container) return;
    let graph = props.graphIns;
    if (!graph) {
      graph = new Graph({
        container: container,
        embedding: {
          enabled: true,
          findParent({ node }) {
            const bbox = node.getBBox()
            return this.getNodes().filter((node) => {
              const data = node.getData<any>()
              if (data && data.parent) {
                const targetBBox = node.getBBox()
                return bbox.isIntersectWithRect(targetBBox)
              }
              return false
            })
          },
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
          createEdge: props.createEdge,
          validateConnection({ targetMagnet }) {
            return !!targetMagnet;
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
    }
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
      .use(new Export())
      .use(new Transform({
        resizing: {
          enabled: true,
          minWidth: 50,
          maxWidth: 0,
          minHeight: 50,
          maxHeight: 0,
          orthogonal: false,
          restrict: false,
          preserveAspectRatio: false,
        },
      }),);
    graph.on('edge:dblclick', ({ cell }) => {
      // this.setState({ openEdgeEditor: true, editingEdge: cell })
    });
    graph.on('edge:change:router',
      (args: {
        cell: Cell
        edge: Edge
        current?: number // 当前值
        previous?: number // 改变之前的值
        options: any // 透传的 options
      }) => {
        console.log('edge:change:router')
      },
    )

    graph.on('edge:mouseenter', ({ cell }) => {
      cell.addTools([
        // {
        //   name: 'button-remove',
        //   args: { distance: -40 },
        // },
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
      // cell.removeTools();
      // const ports = this.container?.querySelectorAll(
      //   '.x6-port-body',
      // ) as NodeListOf<SVGElement>;
      // showPorts(ports, false);
    });

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

      const ports = refContainer?.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>;
      showPorts(ports, true);
    });

    graph.on('node:mouseleave', ({ cell }) => {
      cell.removeTools();
      const ports = refContainer?.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>;
      showPorts(ports, false);
    });
    graph.on('node:click', ({ e, x, y, node, view }) => {
      node.removeTools();
      setEditingNode(node);
    });
    graph.on('node:added', ({ node, index, options }) => {
      dealGraphNodeWhenAddedFromPanel(graph, node);
    })
    graph.on('node:dblclick', ({ e, x, y, node, view }) => {
      setRightToolCollapsed(false);
      setEditingNode(node);
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
    setGraph(graph);

    const groups = panel.Groups;
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
    // const groupedNodes: { [Key: string]: any[] } = {};
    // panel.Nodes.forEach((v) => {
    //   const n = graph.createNode(v.config);
    //   groups.forEach((g) => {
    //     if (v.groups.includes(g.name)) {
    //       if (!groupedNodes[g.name]) groupedNodes[g.name] = [n];
    //       else groupedNodes[g.name].push(n);
    //     }
    //   });
    // });
    // Object.keys(groupedNodes).forEach((o) => {
    //   stencil.load([...groupedNodes[o]], o);
    // });
    refStencil?.appendChild(stencil.container);
    setStencilIns(stencil)
    if (props.config) {
      setEditorCtx({
        ...editorCtx,
        logic: props.config
      });
      graph.fromJSON(editorCtx.logic.visualConfig);
    } else {
      DefaultGraph(graph);
    }
    if (props.onGraphInsChange)
      props.onGraphInsChange(graph)
    return graph;
  };
  useEffect(() => {
    if (stencilIns && props.panelData.Nodes) {
      const groupedNodes: { [Key: string]: any[] } = {};
      props.panelData.Nodes.forEach((v) => {
        const n = graph.createNode(v.nodeConfig);
        props.panelData.Groups.forEach((g) => {
          if (v.groups.includes(g.name)) {
            if (!groupedNodes[g.name]) groupedNodes[g.name] = [n];
            else groupedNodes[g.name].push(n);
          }
        });
      });
      Object.keys(groupedNodes).forEach((o) => {
        stencilIns.load([...groupedNodes[o]], o);
      });
    }

  }, [stencilIns, props.panelData.Nodes])

  //   /**
  //  * 增量更新逻辑配置
  //  * @param updatedFlowProps 追加更新的属性
  //  * @returns 
  //  */
  //   function updateLogicAndEditorCtx(updatedFlowProps: any) {
  //     let newLogic: Logic = { ...editorCtx.logic, ...updatedFlowProps };
  //     newLogic.version = dayjs(Date.now()).format('YYYYMMDDHHmmss')
  //     setEditorCtx({
  //       ...editorCtx,
  //       logic: newLogic
  //     })
  //     return newLogic;
  //   }
  //保存到浏览器并转换dsl
  function handleSave() {
    if (props.onSave) props.onSave(graph);//调用父级传入的回调保存配置
    // this.autoLayout(this.state.graph)//自动布局
  }
  return (
    <EditorContext.Provider value={editorCtx}>
      <Layout style={{ height: '100vh', width: '100%', margin: 0 }}>
        <Layout.Sider
          theme="light"
          collapsed={leftToolCollapsed}
          collapsedWidth={0}
          width={250}
          ref={v => setRefStencil(v)}
        >
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
                  setLeftToolCollapsed(!leftToolCollapsed);
                }}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
              {/* <Dropdown.Button
                style={{ float: 'inline-start' }}
                menu={{
                  items: saveBtns, onClick: onSaveMenuClick
                }}
                buttonsRender={(menu) => {
                  return [
                    <Button type='primary' icon={<SaveOutlined />}
                      // style={{ width: '100px' }}
                      onClick={saveAndConvertGraphToDsl} >保存</Button>,
                    <Button type='primary' icon={<EllipsisOutlined />} />
                  ]
                }}
              >
                保存
              </Dropdown.Button > */}
              {props.toolElements?.map(b => b)}
            </Space>
            <Space style={{
              float: 'right',
              right: '16px',
            }}>
            </Space>
          </Layout.Header>
          <Layout.Content className="app-content" >
            <DagreGraph ref={v => setRefContainer(v)} />
          </Layout.Content>
        </Layout>
        <Layout.Sider
          theme="light"
          collapsed={rightToolCollapsed}
          collapsedWidth={0}
          width={600} >
          <RightToolset
            editNode={editingNode}
            onSubmit={handleSave}
            onClose={() => { setRightToolCollapsed(true); }}
            isCollapsed={rightToolCollapsed}
          />
        </Layout.Sider>
      </Layout >
    </EditorContext.Provider >
  );
}
export default MESLogicEditor;
// export class X6Graph extends React.Component<EditorProps, StateType> {
//   private container?: HTMLDivElement;
//   private stencilContainer?: HTMLDivElement;
//   state: StateType;
//   constructor(props: EditorProps) {
//     super(props);
//     this.state = new StateType();
//     try {
//       RegistShape(props.panelData.Shapes);
//       this.state.leftToolCollapsed = !props.showLeft;
//       this.state.rightToolCollapsed = !props.showRight;
//       this.state.panel = {
//         nodes: props.panelData.Nodes,
//         groups: props.panelData.Groups
//       };

//     } catch (error) {
//       console.error('注册节点出错：');
//       console.error(error);
//     }
//   }
//   handleEdgeSubmit = (v: any) => {
//     this.state.editingEdge?.setLabels(v);
//   };
//   componentDidUpdate(
//     prevProps: Readonly<EditorProps>,
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
//     this.updateLogicAndEditorCtx(this.state.editorCtx?.logic)
//   }
//   //初始化画布以及事件配置
//   initGraph = (container?: HTMLDivElement) => {
//     console.log('init graph')
//     const that = this;
//     let graph = this.props.graphIns;
//     if (!graph) {
//       graph = new Graph({
//         container: container,
//         embedding: {
//           enabled: true,
//           findParent({ node }) {
//             const bbox = node.getBBox()
//             return this.getNodes().filter((node) => {
//               const data = node.getData<any>()
//               if (data && data.parent) {
//                 const targetBBox = node.getBBox()
//                 return bbox.isIntersectWithRect(targetBBox)
//               }
//               return false
//             })
//           },
//         },
//         mousewheel: {
//           enabled: true,
//           // zoomAtMousePosition: true,
//           modifiers: 'ctrl',
//           minScale: 0.5,
//           maxScale: 3,
//         },
//         connecting: {
//           router: 'manhattan',
//           connector: {
//             name: 'rounded',
//             args: {
//               radius: 15,
//             },
//           },
//           anchor: 'center',
//           connectionPoint: 'anchor',
//           allowBlank: false,
//           allowMulti: true,
//           snap: {
//             radius: 20,
//           },
//           createEdge() {
//             return new Shape.Edge({
//               attrs: {
//                 line: {
//                   targetMarker: 'classic',
//                   stroke: that.props?.lineStyle.color,
//                   // stroke: '#f5222d',
//                 },
//               },
//               tools: [
//                 {
//                   name: 'edge-editor',
//                   args: {
//                     attrs: {
//                       backgroundColor: '#fff',
//                     },
//                   },
//                 },
//                 // {
//                 //   name: 'button',
//                 //   args: {
//                 //     markup: [
//                 //       {
//                 //         tagName: 'circle',
//                 //         selector: 'button',
//                 //         attrs: {
//                 //           r: 10,
//                 //           stroke: '#fe854f',
//                 //           strokeWidth: 2,
//                 //           fill: 'white',
//                 //           cursor: 'pointer',
//                 //         },
//                 //       },
//                 //       {
//                 //         tagName: 'text',
//                 //         textContent: '+',
//                 //         selector: 'icon',
//                 //         attrs: {
//                 //           fill: '#fe854f',
//                 //           fontSize: 15,
//                 //           textAnchor: 'middle',
//                 //           pointerEvents: 'none',
//                 //           y: '0.3em',
//                 //         },
//                 //       },
//                 //     ],
//                 //     distance: 40,
//                 //     onClick({ view }: { view: EdgeView }) {
//                 //       console.log(view)
//                 //       graph.removeEdge(view.cid);
//                 //       graph.addNode({
//                 //         shape: 'rect',
//                 //         label: 'node'
//                 //       })
//                 //       // Modal.info(view.sourc)
//                 //     },
//                 //   },
//                 // },
//               ],
//               zIndex: 0
//             });
//           },
//           validateConnection({ targetMagnet }) {
//             return !!targetMagnet;
//           },
//         },
//         background: {
//           color: '#F2F7FA',
//         },
//         grid: true,
//         // panning: {
//         //   enabled: true,
//         // },
//       });
//     }
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
//       .use(new Export())
//       .use(new Transform({
//         resizing: {
//           enabled: true,
//           minWidth: 50,
//           maxWidth: 0,
//           minHeight: 50,
//           maxHeight: 0,
//           orthogonal: false,
//           restrict: false,
//           preserveAspectRatio: false,
//         },
//       }),);
//     graph.on('edge:dblclick', ({ cell }) => {
//       // this.setState({ openEdgeEditor: true, editingEdge: cell })
//     });
//     graph.on('edge:change:router',
//       (args: {
//         cell: Cell
//         edge: Edge
//         current?: number // 当前值
//         previous?: number // 改变之前的值
//         options: any // 透传的 options
//       }) => {
//         console.log('edge:change:router')
//       },
//     )

//     graph.on('edge:mouseenter', ({ cell }) => {
//       cell.addTools([
//         // {
//         //   name: 'button-remove',
//         //   args: { distance: -40 },
//         // },
//         // {
//         //     name: "source-arrowhead",
//         //     args: {
//         //         attrs: {
//         //             fill: "red",
//         //             visibility: "hidden"
//         //         },
//         //     },
//         // },
//         // {
//         //     name: "target-arrowhead",
//         //     args: {
//         //         attrs: {
//         //             fill: "red",
//         //             visibility: "hidden"
//         //         },
//         //     },
//         // },
//       ])
//       // const ports = this.container?.querySelectorAll(
//       //   '.x6-port-body',
//       // ) as NodeListOf<SVGElement>;
//       // showPorts(ports, true);
//     });

//     graph.on('edge:mouseleave', ({ cell }) => {
//       // cell.removeTools();
//       // const ports = this.container?.querySelectorAll(
//       //   '.x6-port-body',
//       // ) as NodeListOf<SVGElement>;
//       // showPorts(ports, false);
//     });

//     graph.on('node:mouseenter', ({ cell }) => {
//       if (cell.data?.config?.type != 'start') {
//         cell.addTools([
//           {
//             name: 'button-remove',
//             args: {
//               x: '100%',
//               y: 0,
//               offset: { x: -10, y: 10 },
//             },
//           },
//         ])
//       }

//       const ports = this.container?.querySelectorAll(
//         '.x6-port-body',
//       ) as NodeListOf<SVGElement>;
//       showPorts(ports, true);
//     });

//     graph.on('node:mouseleave', ({ cell }) => {
//       cell.removeTools();
//       const ports = this.container?.querySelectorAll(
//         '.x6-port-body',
//       ) as NodeListOf<SVGElement>;
//       showPorts(ports, false);
//     });
//     graph.on('node:click', ({ e, x, y, node, view }) => {
//       node.removeTools();
//       this.setState({ editingNode: node });
//     });
//     graph.on('node:added', ({ node, index, options }) => {
//       dealGraphNodeWhenAddedFromPanel(graph, node);
//     })
//     graph.on('node:dblclick', ({ e, x, y, node, view }) => {
//       this.setState({ rightToolCollapsed: false, editingNode: node })
//     });

//     // 绑定快捷键：复制粘贴
//     graph.bindKey(['meta+c', 'ctrl+c'], () => {
//       const cells = graph.getSelectedCells();
//       if (cells.length) {
//         graph.copy(cells);
//       }
//       return false;
//     });
//     graph.bindKey(['meta+x', 'ctrl+x'], () => {
//       const cells = graph.getSelectedCells();
//       if (cells.length) {
//         graph.cut(cells);
//       }
//       return false;
//     });
//     graph.bindKey(['meta+v', 'ctrl+v'], () => {
//       if (!graph.isClipboardEmpty()) {
//         const cells = graph.paste({ offset: 32 });
//         graph.cleanSelection();
//         graph.select(cells);
//       }
//       return false;
//     });
//     //绑定撤销、重做
//     graph.bindKey(['meta+z', 'ctrl+z'], () => {
//       if (graph.canUndo()) {
//         graph.undo();
//       }
//       return false;
//     });
//     graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
//       if (graph.canRedo()) {
//         graph.redo();
//       }
//       return false;
//     });
//     // select all
//     // graph.bindKey(['meta+a', 'ctrl+a'], () => {
//     //     const nodes = graph.getNodes()
//     //     if (nodes) {
//     //         graph.select(nodes)
//     //     }
//     // })

//     // delete
//     graph.bindKey('backspace', () => {
//       const cells = graph.getSelectedCells();
//       if (cells.length) {
//         if (cells.find(i => {
//           if (i.data)
//             return ['start'].indexOf(i.data.config?.type) > -1;
//           else return false;
//         })) {
//           message.error('禁止删除开始节点！')
//         } else {
//           graph.removeCells(cells);
//         }
//       }
//     });
//     graph.on('blank:dblclick', ({ e, x, y }) => {
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

//     const groups = this.state.panel.groups;
//     const stencil = new Stencil({
//       title: '展开/收起',
//       target: graph,
//       search(cell, keyword) {
//         const label: string = cell.getAttrByPath('text/text');
//         return label?.indexOf(keyword) !== -1;
//       },
//       // placeholder: '通过图形',
//       notFoundText: '未找到',
//       collapsable: true,
//       stencilGraphWidth: 250,
//       groups: groups,
//       layoutOptions: { rowHeight: 100 }
//     });
//     const groupedNodes: { [Key: string]: any[] } = {};
//     debugger;
//     this.state.panel.nodes.forEach((v) => {
//       const n = graph.createNode(v.nodeConfig);
//       groups.forEach((g) => {
//         if (v.groups.includes(g.name)) {
//           if (!groupedNodes[g.name]) groupedNodes[g.name] = [n];
//           else groupedNodes[g.name].push(n);
//         }
//       });
//     });
//     Object.keys(groupedNodes).forEach((o) => {
//       stencil.load([...groupedNodes[o]], o);
//     });
//     this.stencilContainer?.appendChild(stencil.container);

//     if (this.props.config) {
//       this.state.editorCtx.logic = this.props.config;
//       graph.fromJSON(this.state.editorCtx.logic.visualConfig);
//     } else {
//       DefaultGraph(graph);
//       this.autoLayout(graph)
//     }
//     if (this.props.onGraphInsChange)
//       this.props.onGraphInsChange(graph)
//     return graph;
//   };
//   autoLayout = (graph: Graph) => {
//     console.log('自动排序暂不支持分组')
//     // autoDagreLayout(graph);
//   }

//   refContainer = (container: HTMLDivElement) => {
//     this.container = container;
//   };
//   refStencil = (container: HTMLDivElement) => {
//     this.stencilContainer = container;
//   };
//     /**
//    * 增量更新逻辑配置
//    * @param updatedFlowProps 追加更新的属性
//    * @returns 
//    */
//     updateLogicAndEditorCtx = (updatedFlowProps: any) => {
//       let newLogic: Logic = { ...this.state.editorCtx.logic, ...updatedFlowProps };
//       newLogic.version = dayjs(Date.now()).format('YYYYMMDDHHmmss')
//       this.setState({
//         editorCtx: {
//           ...this.state.editorCtx,
//           logic: newLogic,
//         }
//       });
//       return newLogic;
//     }
//   //处理表单提交
//   handleSubmit = (v: any) => {
//     //自动保存整个配置文件
//     this.handleSave();
//   };

//   //保存到浏览器并转换dsl
//   handleSave = () => {
//     const data = this.state.graph?.toJSON();
//     if (logicFromGraph) {
//       const newLogic = this.updateLogicAndEditorCtx({ items: logicFromGraph.items, visualConfig: logicFromGraph.visualConfig })
//       if (this.props.config) {
//         newLogic.id = this.props.config?.id
//       }
//       if (this.props.onSave) this.props.onSave(newLogic);//调用父级传入的回调保存配置
//       const logicJson = JSON.stringify(newLogic);
//       localStorage.setItem('logic-' + newLogic.name, logicJson);//缓存到浏览器
//       // navigator.clipboard.writeText(logicJson);//复制到剪贴板
//       // this.state.flowRunner.send('save', flowJson);//发送消息
//       // this.autoLayout(this.state.graph)//自动布局
//     }
//   };

//   render() {
//     const {
//       editingNode,
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
//             width={250}
//             ref={this.refStencil}
//           >
//           </Layout.Sider>
//           <Layout style={{ height: '100%' }}>
//             <Layout.Header style={{ padding: 0, backgroundColor: 'white' }}>
//               <Space direction="horizontal">
//                 <Button
//                   type="text"
//                   icon={
//                     leftToolCollapsed ? (
//                       <MenuUnfoldOutlined />
//                     ) : (
//                       <MenuFoldOutlined />
//                     )
//                   }
//                   onClick={() => {
//                     this.setState({ leftToolCollapsed: !leftToolCollapsed });
//                   }}
//                   style={{
//                     fontSize: '16px',
//                     width: 64,
//                     height: 64,
//                   }}
//                 />
//                 {this.props.toolElements?.map(b => b)}
//               </Space>
//               <Space style={{
//                 float: 'right',
//                 right: '16px',
//               }}>
//               </Space>
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
//             <RightToolset
//               onClear={() => this.setState({ logs: [] })}
//               editNode={editingNode}
//               onSubmit={this.handleSubmit}
//               logs={this.state.logs}
//               onClose={() => { this.setState({ rightToolCollapsed: true }); }}
//               isCollapsed={rightToolCollapsed}
//             // configSchemaProvider={this.props.configSchemaProvider ?? ConfigSchemaProvider}
//             />
//           </Layout.Sider>
//         </Layout >
//       </EditorContext.Provider >
//     );
//   }
// }
