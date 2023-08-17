import { Cell, Edge, Node } from '@antv/x6';
import { message } from 'antd';
import { Step, StepFlow } from '../definition/StepFlow';
function buildStep(
  curNode: Cell.Properties,
  nodesDic: { [Key: string]: Node.Properties },
  edges: Cell.Properties[],
  steps: Step[],
) {
  const nodeConfig = curNode.data.config;
  const nodeType = nodeConfig.type;
  const nextNodes = edges.flatMap((v) => {
    if (v.source.cell === curNode.id) {
      let edgeLabel = '';
      if (v.labels && v.labels.length > 0 && v.labels[0].attrs) {
        edgeLabel = v.labels[0].attrs.label?.text;
      }
      return { condition: edgeLabel, id: v.target.cell };
    } else {
      return [];
    }
  });
  const attr: any = curNode.attrs;
  const step: Step = {
    ...nodeConfig,
    id: curNode.id,
    name: attr?.text?.text,
    type: nodeType,
  };
  if (steps.findIndex((s) => s.id === step.id) > -1) return; //已经解析
  steps.push(step);
  if (nextNodes.length === 0) return;
  switch (nodeType) {
    default:
      if (nextNodes.length > 1 || step.type === 'switch') {
        step.branches = [];
        nextNodes.forEach((n) => {
          step.branches?.push({
            when: n.condition,
            nextStepId: n.id,
          });
          buildStep(nodesDic[n.id], nodesDic, edges, steps);
        });
      } else {
        step.nextStepId = nextNodes[0].id;
        buildStep(nodesDic[nextNodes[0].id], nodesDic, edges, steps);
      }
      break;
  }
}
//将图数据转换为StepFlow，不包含图原始数据，图原始数据保存在visualConfig属性中，在外部处理
export function GraphToStepFlow(
  cells: Cell.Properties[],
): StepFlow | undefined {
  const stepFlow: StepFlow = {
    steps: [],
  };
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
      const attr: any = v.attrs;
      nodesDic[id] = v;
      nodes.push(v);
      if (v.data.config.type === 'start') startNode = v;
    }
  });
  if (!startNode) {
    message.error('未发现开始节点，请配置！');
    return undefined;
  }
  buildStep(startNode, nodesDic, edges, stepFlow.steps);
  return stepFlow;
}
