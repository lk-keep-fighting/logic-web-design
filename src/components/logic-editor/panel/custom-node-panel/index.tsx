import React, { useRef, useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { Graph, Node } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';
import { Input, Collapse, Empty, Tooltip, Spin, Button } from 'antd';
import { SearchOutlined, ExpandAltOutlined, ShrinkOutlined } from '@ant-design/icons';
import LogicNodeConfig from '../../types/LogicNodeConfig';
import { Stencil } from '@antv/x6-plugin-stencil';
import { dealGraphNodeWhenAddedFromPanel } from '../../nodes/node-mapping';
import './index.css';
import { PreviewInPanelReactNode } from '../../../../pages/logic-flow/biz/ext-shape/preview-in-panel';

// Dynamic imports for node components
// const StartNode = lazy(() => import('../../../../pages/logic-flow/biz/ext-shape/start').then(m => ({ default: m.StartNode })));
// const EndNode = lazy(() => import('../../../../pages/logic-flow/biz/ext-shape/end').then(m => ({ default: m.EndNode })));
// const AssignGlobalNode = lazy(() => import('../../../../pages/logic-flow/biz/ext-shape/assign/global').then(m => ({ default: m.AssignGlobalNode })));
// const AssignLocalNode = lazy(() => import('../../../../pages/logic-flow/biz/ext-shape/assign/local').then(m => ({ default: m.AssignLocalNode })));
// const JavaNode = lazy(() => import('../../../../pages/logic-flow/biz/ext-shape/java').then(m => ({ default: m.JavaNode })));
// const JsNode = lazy(() => import('../../../../pages/logic-flow/biz/ext-shape/js').then(m => ({ default: m.JsNode })));
// const HttpNode = lazy(() => import('../../../../pages/logic-flow/biz/ext-shape/http').then(m => ({ default: m.HttpNode })));
// const WaitNode = lazy(() => import('../../../../pages/logic-flow/biz/ext-shape/wait').then(m => ({ default: m.WaitNode })));
// const WaitForContinueNode = lazy(() => import('../../../../pages/logic-flow/biz/ext-shape/wait-for-continue').then(m => ({ default: m.WaitForContinueNode })));
// const SwitchNode = lazy(() => import('../../../../pages/logic-flow/biz/ext-shape/swtich').then(m => ({ default: m.SwitchNode })));
// const SubLogicNode = lazy(() => import('../../../../pages/logic-flow/biz/ext-shape/sub-logic').then(m => ({ default: m.SubLogicNode })));
// const ExtShape = lazy(() => import('../../../../pages/logic-flow/biz/ext-shape/extShape').then(m => ({ default: m.ExtShapeReactNode })));
// const ExtShape1 = lazy(() => import('../../../../pages/logic-flow/biz/ext-shape/extShape1').then(m => ({ default: m.ExtShape1ReactNode })));
// const ExtShape2 = lazy(() => import('../../../../pages/logic-flow/biz/ext-shape/extShape2').then(m => ({ default: m.ExtShape2ReactNode })));
// const PreviewInPanel = lazy(() => import('../../../../pages/logic-flow/biz/ext-shape/preview-in-panel').then(m => ({ default: m.PreviewInPanelReactNode })));

// const getNodeComponent = (nodeShape: string) => {
//   switch (nodeShape) {
//     // case 'start':
//     //   return StartNode;
//     // case 'end':
//     //   return EndNode;
//     // // case 'assign-global':
//     // //   return AssignGlobalNode;
//     // // case 'assign-local':
//     // //   return AssignLocalNode;
//     // case 'java':
//     //   return JavaNode;
//     // case 'js':
//     //   return JsNode;
//     // case 'http':
//     //   return HttpNode;
//     // case 'wait':
//     //   return WaitNode;
//     // case 'wait-for-continue':
//     //   return WaitForContinueNode;
//     // case 'swtich':
//     //   return SwitchNode;
//     // // case 'swtich-case':
//     // //   return SwitchCaseNode;
//     // // case 'swtich-cases':
//     // //   return SwitchCasesNode;
//     // // case 'swtich-default':
//     // //   return SwitchDefaultNode;
//     // case 'sub-logic':
//     //   return SubLogicNode;
//     // case 'ExtShape':
//     //   return ExtShape;
//     // case 'ExtShape1':
//     //   return ExtShape1;
//     // case 'ExtShape2':
//     //   return ExtShape2;
//     // case 'ExtShape3':
//     //   return ExtShape3;
//     default:
//       return PreviewInPanel;
//   }
// };

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

  // Render the actual node component as preview
  const renderNodePreview = () => {
    // const NodeComponent = getNodeComponent(nodeConfig.shape || 'ExtShape');
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
          {/* <NodeComponent node={nodeConfig} /> */}
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
              icon={isAllExpanded ? <ShrinkOutlined /> : <ExpandAltOutlined />}
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
            expandIconPosition="end"
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
  );
};

export default CustomNodePanel;