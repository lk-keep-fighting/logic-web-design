import { ApartmentOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { CellView, Edge, Graph, Node, Shape } from '@antv/x6';
import { History } from '@antv/x6-plugin-history';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Scroller } from '@antv/x6-plugin-scroller'
import { Button, Divider, Flex, Input, Layout, Space, Tabs, TabsProps, Timeline, TimelineItemProps, Typography } from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import './index.css';
// import { InitPanelData } from '@/components/step-flow-editor/x6-graph/settings/PanelSetting';
// import { RegistShape } from '@/components/step-flow-editor/x6-graph/settings/InitGraph';
// import DagreGraph from '@/components/step-flow-editor/x6-graph/instance/dagre-graph';
// import { autoDagreLayout } from '@/components/step-flow-editor/x6-graph/layout/dagreLayout';
import { Logic, LogicItem } from '@/components/step-flow-core/lasl/meta-data';
import { InitPanelData } from '../../settings/PanelSetting';
import { RegistShape } from '../../settings/RegistExtShape';
import { autoDagreLayout } from '../../layout/dagreLayout';
import DagreGraph from '@/components/logic-editor/graph/dagre-graph';
import NodeConfig from '@/components/logic-editor/panel/right-panel/node-config';
import FormRenderById from '@/components/ui-render/form-render/render-by-form-id';

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
  logicLog?: Log,
}

const DebugLogicLog = (props: DebugProps) => {
  const [graph, setGraph] = useState<Graph>();
  const [logic, setLogic] = useState<Logic>();
  const [rightToolCollapsed, setRightToolCollapsed] = useState(true)
  const [curItemLog, setCurItemLog] = useState<ItemLog>()
  const [curLog, setCurLog] = useState()
  const [centerNode, setCenterNode] = useState<Node>();
  const [selectedNode, setSelectedNode] = useState<Node>();
  const refContainer = useRef();
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
    console.log('props.logicLog', props.logicLog)
    if (props.logicLog) {
      const logicLog = props.logicLog;
      setCurLog(props.logicLog);
      graph?.fromJSON(logic?.visualConfig);
      let lastNode: Node;
      let btnCounts = {};
      if (logicLog && logicLog.itemLogs) {
        logicLog.itemLogs.forEach((v, i) => {
          const node = graph?.getNodes().find(n => n.id == v.config.id);
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
        graph?.centerCell(lastNode);
        setCurItemLog({});
        setSelectedNode({});
      }
    }
  }, [props.logicLog, graph])
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
      // setRightToolCollapsed(false)
    });

    graph.on('blank:dblclick', ({ x, y }) => {
    })
    graph.fromJSON(logic.visualConfig);
    autoDagreLayout(graph);
    setGraph(graph);
  }, [logic])

  const tabItems: TabsProps['items'] = [
    {
      key: 'debug-node-input',
      label: '节点入出参',
      children: <div>
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
        <Typography.Text style={{ marginLeft: '15px' }} copyable={{ tooltips: ['复制节点编号', '复制成功!'], text: selectedNode?.id }}>节点编号</Typography.Text>
      </div>
    }
    ,
    {
      key: 'config',
      label: '节点配置',
      children: <NodeConfig
        onSubmit={() => { }}
        editNode={selectedNode}
      />
    },
    {
      key: 'configIns',
      label: '节点实例',
      children:
        <div>
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
        values={{ varsJson: curLog?.varsJson, paramsJson: curLog?.paramsJson, varsJsonEnd: curLog?.varsJsonEnd }}
        onSubmit={() => { }}
      />
    }
  ]
  return <Layout style={{ margin: 0, height: '100vh' }}>
    <Layout>
      <Layout.Header style={{ backgroundColor: 'white', padding: 0 }}>
        {props.btns?.map(b => b)}
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
      >
        x
      </Button>
    </Layout.Sider>
  </Layout >
}
export default DebugLogicLog;