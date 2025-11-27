import { Cell, Edge, Graph, Node } from '@antv/x6';
import { message } from 'antd';
import { Logic, LogicItem } from '../meta-data';
import { ports } from '@/components/logic-editor/settings/Consts';
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
    nextId: '',
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
//将图数据转换为Logic，不包含图原始数据，图原始数据保存在visualConfig属性中，在外部处理
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
  debugger;
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
export function LogicToGraph(logic: Logic): {
  nodes: Node.Metadata[];
  edges: Edge.Metadata[];
} {
  if (!logic?.items?.length) {
    return { nodes: [], edges: [] };
  }

  const getDefaultNodeConfig = (type: string) => {
    console.log('type')
    console.log(type)
    switch (type) {
      case 'http':
      case 'js':
      case 'java':
      case 'sub-logic':
        return {
          size: { width: 100, height: 50 },
        };
      case 'switch':
        return {
          size: { width: 200, height: 50 },
        };
      case 'switch-case':
      case 'switch-default':
      case 'switch-cases':
        return {
          size: { width: 120, height: 50 },
        };
      case 'assign-global':
      case 'assign-local':
        return {
          size: { width: 150, height: 40 },
        };
      default:
        return {
          size: { width: 50, height: 50 },
        };;
    }
  }

  const defaultEdgeConfig = {
    shape: 'edge',
  };

  const nodes: Node.Metadata[] = logic.items.map((item) => ({
    ...getDefaultNodeConfig(item.type),
    id: item.id,
    ports: {
      ...ports,
      items: ports.items.map((port) => ({
        ...port,
        id: `${item.id}-${port.group}`,
      })),
    },
    shape: item.type,
    data: { config: item },
  }));

  const edges: Edge.Metadata[] = logic.items.flatMap((item) => {
    if (item.branches?.length) {
      return item.branches.map((branch) => ({
        ...defaultEdgeConfig,
        source: { cell: item.id, port: item.id + '-bottom' },
        target: { cell: branch.nextId, port: branch.nextId + '-top' },
      }));
    }

    if (item.nextId) {
      return [{
        ...defaultEdgeConfig,
        source: { cell: item.id, port: item.id + '-bottom' },
        target: { cell: item.nextId, port: item.nextId + '-top' },
      }];
    }

    return [];
  });

  return { nodes, edges };
}
