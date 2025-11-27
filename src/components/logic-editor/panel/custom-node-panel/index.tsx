import React, { useRef, useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { Graph, Node } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';
import { Input, Collapse, Empty, Tooltip, Spin, Button, Tabs } from 'antd';
import { SearchOutlined, ExpandAltOutlined, ShrinkOutlined, DatabaseOutlined, JavaOutlined, AppstoreAddOutlined, UnorderedListOutlined, ColumnHeightOutlined } from '@ant-design/icons';
import LogicNodeConfig from '../../types/LogicNodeConfig';
import { Stencil } from '@antv/x6-plugin-stencil';
import { dealGraphNodeWhenAddedFromPanel } from '../../nodes/node-mapping';
import './index.css';
import { PreviewInPanelReactNode } from '../../../../pages/logic-flow/biz/ext-shape/preview-in-panel';


const { Panel } = Collapse;
const { Search } = Input;

interface CustomNodePanelProps {
  graph?: Graph;
  nodes: LogicNodeConfig[];
  groups: Stencil.Group[];
  onNodeAdd?: (node: Node) => void;
}

interface NodeItemProps {
  node: LogicNodeConfig;
  graph: Graph;
  dnd: Dnd;
  onNodeAdd?: (node: Node) => void;
}

const NodeItem: React.FC<NodeItemProps> = ({ node, graph, dnd, onNodeAdd }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const nodeLabel = String(node.getNodeConfig().attrs?.text?.text || node.getNodeConfig().data.config.name);
  const nodeConfig = node.getNodeConfig();

  useEffect(() => {
    if (nodeRef.current && graph && dnd) {
      const previewNode = graph.createNode(node.getNodeConfig());

      // Setup drag and drop
      const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dnd.start(previewNode, e);
      };

      nodeRef.current.addEventListener('mousedown', handleMouseDown);

      return () => {
        if (nodeRef.current) {
          nodeRef.current.removeEventListener('mousedown', handleMouseDown);
        }
        // Clean up the preview node to prevent memory leaks
        try {
          if (graph.getNodes().includes(previewNode)) {
            graph.removeNode(previewNode);
          }
        } catch (e) {
          // Ignore cleanup errors
        }
      };
    }
  }, [node, graph, dnd, onNodeAdd]);

  const renderNodePreview = () => {
    return (
      <div
        style={{
          width: '100px',
          height: '50px',
          transformOrigin: 'center',
          //   overflow: 'hidden',
          pointerEvents: 'none', // Disable interactions in preview
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Suspense fallback={<Spin size="small" />}>
          <PreviewInPanelReactNode node={nodeConfig} />
        </Suspense>
      </div>
    );
  };

  return (
    <Tooltip title={nodeLabel} placement="top">
      <div
        ref={nodeRef}
        className="custom-node-item"
        draggable
      >
        {/* <div className="node-preview-container"> */}
        {/* <div className="node-preview"> */}
        {renderNodePreview()}
        {/* </div> */}
        {/* </div> */}
        {/* <div className="node-label">{nodeLabel}</div> */}
      </div>
    </Tooltip>
  );
};

const CustomNodePanel: React.FC<CustomNodePanelProps> = ({
  graph,
  nodes,
  groups,
  onNodeAdd
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeKeys, setActiveKeys] = useState<string[]>(['ctrl', 'assign']);
  const [dnd, setDnd] = useState<Dnd>();

  // Initialize DND plugin
  useEffect(() => {
    if (graph) {
      const dndInstance = new Dnd({
        target: graph,
        scaled: false,
        validateNode: (droppedNode) => {
          // This is called when a node is dropped
          console.log('DND validateNode called for node type:', droppedNode.getData()?.config?.type);
          // Use setTimeout to ensure the node is added to graph first
          setTimeout(() => {
            console.log('Processing DND drop for node:', droppedNode.getData()?.config?.type);
            dealGraphNodeWhenAddedFromPanel(graph, droppedNode);
            onNodeAdd?.(droppedNode);
          }, 0);
          return true;
        },
      });

      setDnd(dndInstance);

      return () => {
        dndInstance.dispose();
      };
    }
  }, [graph, onNodeAdd]);

  // Group nodes by their groups
  const groupedNodes = useMemo(() => {
    const result: { [key: string]: LogicNodeConfig[] } = {};

    groups.forEach(group => {
      result[group.name] = nodes.filter(node =>
        node.getGroups()?.includes(group.name)
      );
    });

    return result;
  }, [nodes, groups]);

  // Filter nodes based on search keyword
  const filteredGroupedNodes = useMemo(() => {
    if (!searchKeyword.trim()) return groupedNodes;

    const result: { [key: string]: LogicNodeConfig[] } = {};

    Object.keys(groupedNodes).forEach(groupName => {
      const filteredNodes = groupedNodes[groupName].filter(node => {
        const config = node.getNodeConfig();
        const label = String(node.getNodeConfig().attrs?.text?.text || '');
        const searchLower = searchKeyword.toLowerCase();

        return (
          String(label).toLowerCase().includes(searchLower) ||
          (config.data?.config?.name || '').toLowerCase().includes(searchLower)
        );
      });

      if (filteredNodes.length > 0) {
        result[groupName] = filteredNodes;
      }
    });

    return result;
  }, [groupedNodes, searchKeyword]);

  // Set default active keys when groups change - remove automatic expansion
  useEffect(() => {
    if (groups.length > 0 && activeKeys.length === 0) {
      // Don't automatically expand all panels
      setActiveKeys([]);
    }
  }, [groups]);

  // Handle expand/collapse all with single toggle
  const isAllExpanded = activeKeys.length === groups.length;

  const handleToggleAll = () => {
    if (isAllExpanded) {
      setActiveKeys([]);
    } else {
      setActiveKeys(groups.map(g => g.name));
    }
  };

  if (!graph || !dnd) {
    return <div>Loading...</div>;
  }

  const hasFilteredNodes = Object.keys(filteredGroupedNodes).some(
    key => filteredGroupedNodes[key].length > 0
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* <Tabs centered size='small' tabBarStyle={{ margin: 0 }}>
        <Tabs.TabPane tab="本地组件" key="code" icon={<AppstoreAddOutlined />}> */}
          <div className="custom-node-panel">
            <div className="panel-header">
              <div className="header-row">
                <Search
                  placeholder="搜索节点"
                  allowClear
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  // prefix={<SearchOutlined />}
                  // size="small" 
                  className="search-input"
                />
                <Tooltip title={isAllExpanded ? "收起全部" : "展开全部"}>
                  <Button
                    type="text"
                    // size="small"
                    icon={isAllExpanded ? <UnorderedListOutlined /> : <ColumnHeightOutlined />}
                    // icon={isAllExpanded ? <ShrinkOutlined /> : <ExpandAltOutlined />}
                    onClick={handleToggleAll}
                  // className="toggle-button"
                  >
                    {/* {isAllExpanded ? "收起" : "展开"} */}
                  </Button>
                </Tooltip>
              </div>
            </div>

            <div className="panel-content">
              {!hasFilteredNodes ? (
                <Empty
                  description="未找到节点"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ marginTop: 40 }}
                />
              ) : (
                <Collapse
                  activeKey={activeKeys}
                  onChange={(keys) => setActiveKeys(keys as string[])}
                  ghost
                  size="small"
                // expandIconPosition="end"
                >
                  {groups.map(group => {
                    const groupNodes = filteredGroupedNodes[group.name] || [];
                    if (groupNodes.length === 0) return null;

                    return (
                      <Panel
                        header={<span >{group.title || group.name}</span>}
                        key={group.name}
                        className="group-panel"
                      >
                        <div
                          className="nodes-grid"
                        >
                          {groupNodes.map((node, index) => (
                            <NodeItem
                              key={`${group.name}-${index}`}
                              node={node}
                              graph={graph}
                              dnd={dnd}
                              onNodeAdd={onNodeAdd}
                            />
                          ))}
                        </div>
                      </Panel>
                    );
                  })}
                </Collapse>
              )}
            </div>
          </div>
        {/* </Tabs.TabPane>
        <Tabs.TabPane tab="资产库" key="assets" icon={<DatabaseOutlined />}>
        </Tabs.TabPane>
      </Tabs> */}

    </div>

  );
};

export default CustomNodePanel;