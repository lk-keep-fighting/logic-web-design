import { CheckCircleTwoTone, FrownOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { CellView, Edge, Graph, Node, Shape } from '@antv/x6';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Scroller } from '@antv/x6-plugin-scroller'
import { Button, Layout, List, Space, Tabs, TabsProps, Timeline, TimelineItemProps } from 'antd';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import './index.css';
import { InitPanelData } from '@/components/step-flow-editor/x6-graph/settings/PanelSetting';
import { RegistShape } from '@/components/step-flow-editor/x6-graph/settings/InitGraph';
import DagreGraph from '@/components/step-flow-editor/x6-graph/instance/dagre-graph';
import { autoDagreLayout } from '@/components/step-flow-editor/x6-graph/layout/dagreLayout';
import { Schema } from 'form-render';
import { Logic, LogicItem } from '@/components/lib/lasl/meta-data';
import NodeData from '@/components/step-flow-editor/right-toolset/step-config';
import { JsonView } from 'amis';
import NodeConfig from '@/components/logic-editor/panel/right-panel/node-config';

interface LogicViewerProps {
  config?: Logic;
  nextId?: string,
  btns?: ReactNode[],
  configSchemaProvider?: (type: string) => Promise<Schema>;
}

const LogicViewer = (props: LogicViewerProps) => {
  const [graph, setGraph] = useState<Graph>();
  const [logic, setLogic] = useState<Logic>();
  const [leftToolCollapsed, setLeftToolCollapsed] = useState(false)
  const [rightToolCollapsed, setRightToolCollapsed] = useState(true)
  const [centerNode, setCenterNode] = useState<Node>();
  const [selectedNode, setSelectedNode] = useState<Node>();
  const refContainer = useRef();

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
    graph.on('node:added', () => {
    })
    graph.on('node:dblclick', ({ node }) => {
      setRightToolCollapsed(false)
    });
    graph?.on('node:click', ({ node }) => {
      setSelectedNode(node);
    });
    graph.on('blank:dblclick', ({ x, y }) => {
    })
    graph.fromJSON(logic.visualConfig);
    autoDagreLayout(graph);
    setGraph(graph);
  }, [logic])

  const tabItems: TabsProps['items'] = [
    {
      key: '2',
      label: '节点配置',
      children: <NodeConfig
        onSubmit={() => { }}
        editNode={selectedNode}
      />
    }
  ]
  return <Layout style={{ margin: 0, height: '100vh' }}>
    <Layout style={{}}>
      <Layout.Header style={{ padding: 0, backgroundColor: 'white' }}>
        <Space direction="horizontal">
          {props.btns?.map(b => b)}
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
export default LogicViewer;