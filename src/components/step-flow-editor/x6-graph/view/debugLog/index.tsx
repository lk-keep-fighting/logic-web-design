import { ApartmentOutlined, CheckCircleTwoTone, FrownOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { CellView, Edge, Graph, Node, Shape } from '@antv/x6';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Scroller } from '@antv/x6-plugin-scroller'
import { Export } from '@antv/x6-plugin-export'
import { Button, Divider, Layout, List, Space, Tabs, TabsProps, Timeline, TimelineItemProps, Typography } from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import './index.css';
import { InitPanelData } from '@/components/step-flow-editor/x6-graph/settings/PanelSetting';
import { RegistShape } from '@/components/step-flow-editor/x6-graph/settings/InitGraph';
import DagreGraph from '@/components/step-flow-editor/x6-graph/instance/dagre-graph';
import { autoDagreLayout } from '@/components/step-flow-editor/x6-graph/layout/dagreLayout';
import { Schema } from 'form-render';
import { Logic, LogicItem } from '@/components/step-flow-core/lasl/meta-data';
import NodeData from '@/components/step-flow-editor/right-toolset/step-config';
import { JsonView } from 'amis';
import Paragraph from 'antd/es/skeleton/Paragraph';

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
  itemLogs: ItemLog[],
  paramsJson: object
  version: string,
  // success: boolean
  // }
}
interface DebugProps {
  name?: string;
  config?: Logic;
  nextId?: string,
  btns?: ReactNode[],
  logicIns: any,
  debugLogs?: Log[],
  configSchemaProvider?: (type: string) => Promise<Schema>;
}

const DebugLog = (props: DebugProps) => {
  const [graph, setGraph] = useState<Graph>();
  const [logic, setLogic] = useState<Logic>();
  const [leftToolCollapsed, setLeftToolCollapsed] = useState(false)
  const [rightToolCollapsed, setRightToolCollapsed] = useState(true)
  const [curItemLog, setCurItemLog] = useState<ItemLog>()
  // const [curItemLogSchema, setCurItemLogSchema] = useState<Schema>({})
  const [curLog, setCurLog] = useState()
  // const [curItemLogIndex, setCurItemLogIndex] = useState(0)
  const [centerNode, setCenterNode] = useState<Node>();
  const [selectedNode, setSelectedNode] = useState<Node>();
  const [timeLineItems, setTimeLineItems] = useState<TimelineItemProps[]>();
  const refContainer = useRef();
  const onNodeClick = ({ node }) => {
    setSelectedNode(node)
    const itemLog = curLog?.itemLogs.find(i => {
      return i.config.id == node.id
    });
    setCurItemLog(itemLog)
  }
  useEffect(() => {
    if (centerNode)
      graph?.centerCell(centerNode);
  }, [centerNode, graph])
  useEffect(() => {
    console.log('play curItemLog', curItemLog)
    // graph?.getNodes().find(n => n.id == curItemLog?.config?.id)?.attr('body/fill', 'green')
  }, [curItemLog])
  useEffect(() => {
    const node = graph?.getNodes().find(n => n.id == props.nextId);
    node?.attr('body/fill', 'red');
    setCenterNode(node)
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
    const items: TimelineItemProps[] = [];
    if (props)
      props.debugLogs?.forEach(v => {
        items.push({
          children: <><span style={{ cursor: 'pointer', fontWeight: v.id == curLog?.id ? 'bolder' : 'normal', color: v.id == curLog?.id ? '#52c41a' : 'black' }} onClick={() => {
            setCurLog(v);
            console.log(v);
            graph?.fromJSON(logic?.visualConfig);
            // graph?.fitToContent();
            let lastNode: Node;
            v.itemLogs.forEach(i => {
              const node = graph?.getNodes().find(n => n.id == i.config.id);
              console.log('fill node')
              console.log(node)
              if (node) {
                node.addTools({
                  name: 'boundary',
                  args: {
                    attrs: {
                      // fill: '#7c68fc',
                      stroke: '#9254de',
                      strokeWidth: 2,
                      fillOpacity: 0.2,
                    },
                  },
                })
                // node.attr('body/fill', '#52c41a')
                lastNode = node;
              }
            })
            // graph?.centerPoint(lastNode?.x, lastNode?.y);
            // graph?.centerCell(lastNode, { padding: { left: 0 } });
            graph?.centerCell(lastNode);
            setCurItemLog({});
            setSelectedNode({});
            // autoDagreLayout(graph);
          }} ><p>{v.itemLogs[0]?.config.name}</p>
            {props.logicIns?.version == v.version ? <p></p> : <p>
              <Space>
                <Typography.Paragraph style={{ color: 'red' }}>版本号:</Typography.Paragraph>
                <Typography.Paragraph copyable={{ tooltips: ['点击复制', '复制成功!'], text: v.version }} >{v.version}
                  <Typography.Link style={{ margin: '5px' }} href={`#/assets/logic/i/${v.logicId}/view/${v.version}`} target="_blank"><ApartmentOutlined /></Typography.Link>
                </Typography.Paragraph>
              </Space>
            </p>}
            <p>业务标识：{v.bizId}</p>
            <p>{v.serverTime}</p>
            <p>{v.message}</p></span></>,
          color: v.success ? 'green' : 'red'
        })
      })
    setTimeLineItems(items);
  }, [props.debugLogs, props.logicIns, graph, curLog])
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
    // graph.on('node:click', onNodeClick);
    graph.on('node:added', () => {
    })
    graph.on('node:dblclick', ({ node }) => {
      setRightToolCollapsed(false)
    });

    graph.on('blank:dblclick', ({ x, y }) => {
    })
    graph.fromJSON(logic.visualConfig);
    autoDagreLayout(graph);
    setGraph(graph);
  }, [logic])

  useEffect(() => {
    graph?.off('node:click', onNodeClick)
    graph?.on('node:click', onNodeClick)

  }, [curLog])
  const replayLogs = () => {
    // console.log('curItemLogIndex,', curItemLogIndex)
    // if (props.debugLogs) {
    //   setCurItemLog(props.debugLogs[curLogIndex].debug.itemLogs[curItemLogIndex]);
    //   if (curItemLogIndex == props.debugLogs[curLogIndex].debug.itemLogs.length - 1 && curLogIndex < props.debugLogs.length - 1) {
    //     setCurItemLogIndex(0);
    //     setCurLogIndex(curLogIndex + 1);
    //   }
    //   if (curItemLogIndex < props.debugLogs[curLogIndex].debug.itemLogs.length) {
    //     console.log('curItemLogIndex,', curItemLogIndex)
    //     setCurItemLogIndex(curItemLogIndex + 1);
    //   }
    // }
  }
  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: '日志',
      children: <JsonView src={curItemLog} />
    }
    // ,
    // {
    //   key: '2',
    //   label: '节点配置',
    //   children: <NodeData
    //     editNode={selectedNode}
    //     configSchemaProvider={props.configSchemaProvider}
    //   />
    // }
  ]
  return <Layout style={{ margin: 0, height: '100vh' }}>
    <Layout.Sider
      theme="light"
      // collapsed={leftToolCollapsed}
      collapsedWidth={0}
      width={300}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        // padding: '5px',
        // backgroundColor: 'WhiteSmoke',
        borderRight: '0.5px solid'
      }}
    >
      <Divider>状态变更记录</Divider>
      <Timeline
        style={{
          height: '100%'

        }}
        // pending={true}
        items={timeLineItems}
      />
    </Layout.Sider>
    <Layout style={{ marginLeft: 300 }}>
      <Layout.Header style={{ backgroundColor: 'white', padding: 0 }}>
        {/* <Button
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
        /> */}
        <Space direction="horizontal" style={{}}>
          <Divider type='vertical' />
          {/* <Button icon={<PlayCircleTwoTone />} onClick={() => {
            setInterval(() => {
              replayLogs();
            }, 1000)
          }}></Button> */}
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
      style={{ overflow: 'scroll' }}
      title='ddd'
      width={500} >
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
      <Tabs items={tabItems} defaultActiveKey="1" />
    </Layout.Sider>
  </Layout >
}
export default DebugLog;