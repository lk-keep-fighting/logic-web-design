import { ApartmentOutlined, BulbOutlined, ForkOutlined, MenuFoldOutlined, MenuUnfoldOutlined, OrderedListOutlined } from '@ant-design/icons';
import { CellView, Edge, Graph, Node, Shape } from '@antv/x6';
import { History } from '@antv/x6-plugin-history';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Scroller } from '@antv/x6-plugin-scroller'
import { Button, Divider, Flex, Input, Layout, Space, Tabs, TabsProps, Timeline, TimelineItemProps, Typography } from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import './index.css';
import { Logic, LogicItem } from '@/components/lib/dsl/meta-data';
import { InitPanelData } from '../../settings/PanelSetting';
import { RegistShape } from '../../settings/RegistExtShape';
import { autoDagreLayout } from '../../layout/dagreLayout';
import DagreGraph from '@/components/logic-editor/graph/dagre-graph';
import NodeConfig from '@/components/logic-editor/panel/right-panel/node-config';
import FormRenderById from '@/components/ui-render/form-render/render-by-form-id';
import { PageRenderById } from '@/components/ui-render';
import AIDebugLog from '../ai-debug-log';


type EditorCtx = {
  logic: Logic,
}
export const EditorContext = React.createContext<EditorCtx>({
  logic: new Logic('')
})

interface ItemLog {
  name: string,
  beginTime: Date,
  endTime: Date,
  duration: number,
  paramsJson: object,
  config: LogicItem
}
interface Log {
  success: boolean
  serverTime: string
  msg: string
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
}

const DebugLog = (props: DebugProps) => {
  const [graph, setGraph] = useState<Graph>();
  const [logic, setLogic] = useState<Logic>();
  const [rightToolCollapsed, setRightToolCollapsed] = useState(true)
  const [curItemLog, setCurItemLog] = useState<ItemLog>()
  const [curLog, setCurLog] = useState()
  const [centerNode, setCenterNode] = useState<Node>();
  const [selectedNode, setSelectedNode] = useState<Node>();
  const [timeLineItems, setTimeLineItems] = useState<TimelineItemProps[]>();
  const refContainer = useRef();
  const [showAI, setShowAI] = useState(false);

  function getButtonTool(txt, itemLog, idx, btnCnt) {
    return {
      name: 'button',
      args: {
        markup: [
          {
            tagName: 'circle',
            selector: 'button',
            attrs: {
              r: 14,
              x: 0,
              y: 0,
              stroke: itemLog.success ? '#52C41A' : 'red',
              // 'stroke-width': 3 ,
              'stroke-width': 5 - idx < 1 ? 1 : 5 - idx,
              fill: 'white',
              cursor: 'pointer',
            },
          },
          {
            tagName: 'text',
            textContent: txt,
            selector: 'icon',
            attrs: {
              // fill: '#fe854f',
              'font-size': 20 - idx < 12 ? 12 : 20 - idx,
              'text-anchor': 'middle',
              'pointer-events': 'none',
              y: '0.3em',
            },
          },
        ],
        x: (btnCnt - 1) * 28,
        y: 0,
        // offset: { x: 0, y: 0 },
        onClick({ view }: { view: NodeView }) {
          const node = view.cell
          setSelectedNode(node)
          setRightToolCollapsed(false)
          setCurItemLog(itemLog)
        },
      },
    }
  }
  useEffect(() => {
    if (centerNode)
      graph?.centerCell(centerNode);
  }, [centerNode, graph])
  useEffect(() => {
    console.log('select curItemLog', curItemLog)
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
    const items: TimelineItemProps[] = [];
    if (props)
      props.debugLogs?.forEach(v => {
        items.push({
          children: <><span style={{ cursor: 'pointer', fontWeight: v.id == curLog?.id ? 'bolder' : 'normal', color: v.id == curLog?.id ? '#52c41a' : 'black' }} onClick={() => {
            setCurLog(v);
            graph?.fromJSON(logic?.visualConfig);
            // graph?.fitToContent();
            let lastNode: Node;
            let btnCounts = {};
            v.itemLogs.forEach((v, i) => {
              const node = graph?.getNodes().find(n => n.id == v.config?.id);
              console.log('选中的节点')
              console.log(node)
              if (node) {
                node.addTools({
                  name: 'boundary',
                  args: {
                    attrs: {
                      // fill: '#7c68fc',
                      // stroke: '#9254de',
                      stroke: 'red',
                      strokeWidth: 1.5,
                      // fillOpacity: 0.2,
                      rx: 5,
                      ry: 5
                    },
                  },
                })
                // node.attr('body/fill', '#52c41a')
                lastNode = node;
              }
              if (btnCounts[node?.id])
                btnCounts[node?.id] += 1
              else
                btnCounts[node?.id] = 1
              node?.addTools(getButtonTool(i, v, i, btnCounts[node?.id]))
            })
            // graph?.centerPoint(lastNode?.x, lastNode?.y);
            // graph?.centerCell(lastNode, { padding: { left: 0 } });
            if (lastNode)
              graph?.centerCell(lastNode);
            setCurItemLog({});
            setSelectedNode({});
            // autoDagreLayout(graph);
          }} ><p>{v.itemLogs[0].config?.name}</p>
            <p>开始：{v.itemLogs[0].beginTime}</p>
            <p>结束：{v.itemLogs[v.itemLogs.length - 1].endTime}</p>
            {props.logicIns?.version == v.version ? <p></p> : <p>
              <Space>
                <Typography.Paragraph style={{ color: 'red' }}>版本号:</Typography.Paragraph>
                <Typography.Paragraph copyable={{ tooltips: ['点击复制', '复制成功!'], text: v.version }} >{v.version}
                  <Typography.Link style={{ margin: '5px' }} href={`#/assets/logic/i/${v.logicId}/view/${v.version}`} target="_blank"><ApartmentOutlined /></Typography.Link>
                </Typography.Paragraph>
              </Space>
            </p>}
            <p>{v.message}</p>
            <Button type='primary' size='small' icon={<BulbOutlined />} onClick={() => {
              setShowAI(true);
            }} >AI分析</Button>
          </span>
          </>,
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
    if (refContainer.current == null) return;
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
      // setRightToolCollapsed(false)
    });

    graph.on('blank:dblclick', ({ x, y }) => {
    })
    graph.fromJSON(logic.visualConfig);
    autoDagreLayout(graph);
    setGraph(graph);
  }, [logic])

  // useEffect(() => {
  //   graph?.off('node:click', onNodeClick)
  //   graph?.on('node:click', onNodeClick)

  // }, [curLog])
  const replayLogs = () => {
  }
  const tabItems: TabsProps['items'] = [
    {
      key: 'debug-node-input',
      label: '节点入出参',
      children:
        <div>
          {curItemLog?.configInstance?.type == 'sub-logic' ? <div>
            <Typography.Text style={{ margin: '15px' }} copyable={{ tooltips: ['', '复制成功!'], text: curItemLog?.configInstance?.objectId }}>子逻辑日志:<a target='_blank' href={`#/debug/logic-log/i/${curItemLog?.configInstance?.objectId}`}>{curItemLog?.configInstance?.objectId}</a></Typography.Text>
            <Divider /></div> : ''}
          <FormRenderById
            formId='debug-node-input'
            values={{
              success: curItemLog?.success,
              msg: curItemLog?.msg,
              returnData: curItemLog?.returnData,
              body: curItemLog?.configInstance?.body,
              bizId: curItemLog?.configInstance?.bizId,
              logicId: curItemLog?.configInstance?.url
            }}
            onSubmit={() => { }}
          />
          <Typography.Text style={{ margin: '15px' }} copyable={{ tooltips: ['复制节点编号', '复制成功!'], text: selectedNode?.id }}>节点编号</Typography.Text>
          <div />
        </div>
    }
    ,
    {
      key: 'config',
      label: '节点配置',
      children: <div>
        <NodeConfig
          onSubmit={() => { }}
          editNode={selectedNode}
        />
      </div>
    },
    {
      key: 'configIns',
      label: '节点实例',
      children: <div>
        <FormRenderById
          formId={curItemLog?.config?.type || ''}
          values={curItemLog?.configInstance}
          onSubmit={() => { }}
        />
      </div>
    },
    {
      key: 'debug-context',
      label: '执行上下文',
      children: <FormRenderById
        formId='debug-context'
        values={{
          varsJson: curLog?.varsJson, paramsJson: curLog?.paramsJson, varsJsonEnd: curLog?.varsJsonEnd, startNodeId: curLog?.itemLogs[0].config?.id, startNodeName: curLog?.itemLogs[0].config?.name,
          logicId: props.logicIns?.logicId,
          bizId: props.logicIns?.bizId
        }}
        onSubmit={() => { }}
      />
    }
  ]
  return <Layout style={{ margin: 0, height: '100vh' }}>
    <Layout.Sider
      theme="light"
      // collapsed={leftToolCollapsed}
      collapsedWidth={0}
      width={260}
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
      <Divider>执行记录</Divider>
      <Timeline
        style={{
          height: '100%'

        }}
        // pending={true}
        items={timeLineItems}
      />
    </Layout.Sider>
    <Layout style={{ margin: 0, marginLeft: 260, padding: 0 }}>
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
        {/* <Space direction="horizontal" style={{}}> */}
        {/* <Divider type='vertical' /> */}
        {/* <Button icon={<PlayCircleTwoTone />} onClick={() => {
            setInterval(() => {
              replayLogs();
            }, 1000)
          }}></Button> */}
        {props.btns?.map(b => b)}
        {/* </Space> */}
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
        <Tabs
          size='small'
          style={{ backgroundColor: 'white', padding: 5, margin: 0 }}
          items={[ForkOutlined, OrderedListOutlined].map((Icon, i) => {
            const id = String(i + 1);
            if (i == 0)
              return {
                key: id,
                label: `逻辑图`,
                children: <DagreGraph
                  ref={refContainer}
                />,
                icon: <Icon />,
              }; else
              return {
                key: id,
                label: `执行节点`,
                children: < PageRenderById pageId={'itemLogs-table'} data={{ items: curLog?.itemLogs }}
                  onBroadcast={(type, data) => {
                    var nodeId = data.item.config.id;
                    var itemLog = data.item;
                    var node = graph?.getNodes().find(n => n.id == nodeId);
                    if (node) {
                      setSelectedNode(node)
                      setRightToolCollapsed(false)
                      setCurItemLog(itemLog)
                    }
                  }} />,
                icon: <Icon />,
              };
          })}>
        </Tabs>
        {/* <GanttView style={{ height: '100vh' }} items={curLog?.itemLogs} /> */}
        {/* <Divider></Divider> */}
        <AIDebugLog show={showAI} logicLog={curLog} onClose={() => setShowAI(false)} />
      </Layout.Content>
    </Layout>
    <Layout.Sider
      theme="light"
      collapsed={rightToolCollapsed}
      collapsedWidth={0}
      style={{ overflow: 'scroll' }}
      width={500} >
      <Tabs items={tabItems} defaultActiveKey="inout" />
      <Button
        type="text"
        onClick={() => {
          setRightToolCollapsed(!rightToolCollapsed)
        }}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      // style={{
      //   float: 'right',
      //   fontSize: '16px',
      //   width: 64,
      //   height: 64,
      // }}
      >
        x
      </Button>
    </Layout.Sider>

  </Layout >
}
export default DebugLog;