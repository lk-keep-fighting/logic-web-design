import { Cell, Edge, Graph, Node } from '@antv/x6';
import { message } from 'antd';
import { Logic, LogicItem } from '../meta-data';
//将图数据转换为Logic，不包含图原始数据，图原始数据保存在visualConfig属性中，在外部处理
export class LogicParser {
  public static parseFromX6GraphCells(cells: Cell.Properties[]): Logic | undefined {
    const logic: Logic = new Logic();
    const edges: Edge.Properties[] = [];
    // const nodes: Node.Properties[] = [];
    const nodesDic: { [Key: string]: Node.Properties } = {};
    let startNode = undefined;
    //分组所有的节点与边
    cells.forEach((v) => {
      const id = v.id || '';
      if (v.shape === 'edge') {
        //边,当前无自定义边，当有自定义边时这里判断条件可能有问题
        edges.push(v);
      } else {
        const attr: any = v.attrs;
        nodesDic[id] = v;
        // nodes.push(v);
        if (v.data.config.type === 'start') startNode = v;
      }
    });
    if (!startNode) {
      message.error('未发现开始节点，请配置！');
      return undefined;
    }
    buildLogicItem(startNode, nodesDic, edges, logic.items);
    return logic;

  }
}

function buildLogicItem(
  curNode: Cell.Properties,
  nodesDic: { [Key: string]: Node.Properties },
  edges: Cell.Properties[],
  items: LogicItem[],
) {
  const nodeConfig = curNode.data.config;
  const nodeType = nodeConfig.type;
  const nextNodes = edges.flatMap((v) => {//通过边找到下一个节点
    if (v.source.cell === curNode.id) {
      // let edgeLabel = '';
      // if (v.labels && v.labels.length > 0 && v.labels[0].attrs) {
      //   edgeLabel = v.labels[0].attrs.label?.text;
      // }
      return nodesDic[v.target.cell];
    } else {
      return [];
    }
  });
  const attr: any = curNode.attrs;
  let item: LogicItem = new LogicItem(curNode.id ?? '', nodeType);
  item = {
    ...nodeConfig,
    id: curNode.id,
    name: attr?.text?.text,
  };
  if (items.findIndex((s) => s.id === item.id) > -1) return; //已经解析
  items.push(item);
  if (nextNodes.length === 0) return;
  switch (nodeType) {
    default:
      if (nextNodes.length > 1 || item.type === 'switch') {
        console.log(curNode.data?.config);
        console.log(nextNodes);
        item.branches = [];
        nextNodes.forEach((n) => {
          console.log(n.data?.config);
          if (n.data?.config.type === 'switch-cases') {
            n.data?.config?.cases?.forEach((c) => {
              item.branches?.push({
                when: c,
                nextId: n.id,
              });
            });
          } else {
            item.branches?.push({
              when: n.data?.config?.case,
              nextId: n.id,
            });
          }
          buildLogicItem(nodesDic[n.id], nodesDic, edges, items);
        });
      } else {
        item.nextId = nextNodes[0].id;
        buildLogicItem(nodesDic[nextNodes[0].id], nodesDic, edges, items);
      }
      break;
  }
}
//将图数据转换为StepFlow，不包含图原始数据，图原始数据保存在visualConfig属性中，在外部处理
export function GraphToLogic(
  logicId: string,
  cells: Cell.Properties[],
): Logic | undefined {
  const logic: Logic = new Logic(logicId);
  const edges: Edge.Properties[] = [];
  const nodes: Node.Properties[] = [];
  const nodesDic: { [Key: string]: Node.Properties } = {};
  let startNode = undefined;
  //分组所有的节点与边
  cells.forEach((v) => {
    const id = v.id || '';
    if (v.shape === 'edge') {
      //边,当前无自定义边，当有自定义边时这里可能有问题
      edges.push(v);
    } else {
      // const attr: any = v.attrs;
      nodesDic[id] = v;
      nodes.push(v);
      if (v.data.config.type === 'start') startNode = v;
    }
  });
  if (!startNode) {
    message.error('未发现开始节点，请配置！');
    return undefined;
  }
  buildLogicItem(startNode, nodesDic, edges, logic.items);
  console.log('logic.items')
  console.log(logic.items)
  return logic;
}

//未完成
export function LogicToGraph(logic: Logic): Cell[] {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Create nodes
  logic.items.forEach((item) => {
    const node: Node = {
      id: item.id,
      shape: item.type, // Adjust the shape based on your node representation
      // position: { x: 0, y: 0 }, // Set the appropriate position
      size: { width: 80, height: 40 }, // Set the appropriate size
      data: {
        config: item // Customize as needed
      },
      attrs: {
        text: { text: item.name },
      },
    };

    nodes.push(node);

    // If the node has branches, create edges
    if (item.branches && item.branches.length > 0) {
      item.branches.forEach((branch) => {
        const edge: Edge = {
          shape: 'edge', // Adjust the shape based on your edge representation
          source: { cell: item.id },
          target: { cell: branch.nextId },
          labels: [
            {
              position: 0.5,
              attrs: {
                label: { text: branch.when },
              },
            },
          ],
        };

        edges.push(edge);
      });
    } else if (item.nextId) {
      // If the node has a single next node, create an edge
      const edge: Edge.Properties = {
        shape: 'edge', // Adjust the shape based on your edge representation
        source: { cell: item.id },
        target: { cell: item.nextId },
      };

      edges.push(edge);
    }
  });

  return { nodes, edges };
}
