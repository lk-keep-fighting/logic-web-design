import { Graph } from "@antv/x6";
import { ports } from "../../settings/Consts";

/**
 * 
 * @param panelNode 
 * @param graph 
 */
export const dealGraphNodeWhenAddedFromPanel = (graph: Graph, node: any): any => {
    const data = node.getData();
    const pos = node.getPosition();

    if (['ExtSharp', 'polygon'].indexOf(node.shape) > -1) {
        switch (data.config.type) {
            case 'switch':
                let width = 150;
                const switchNode = graph.createNode({
                    shape: 'switch',
                    position: pos,
                    width,
                    height: 50,
                    ports,
                    data: node.data
                })
                graph.removeNode(node);
                const defCaseNode1 = graph.createNode({
                    shape: 'switch-case',
                    position: { x: pos.x + width + 60, y: pos.y - 50 },
                    width: 120,
                    height: 50,
                    ports,
                    data: {
                        config: {
                            type: 'switch-case',
                        },
                    },
                })
                const defCaseNode2 = graph.createNode({
                    shape: 'switch-default',
                    position: { x: pos.x + width + 60, y: pos.y + 50 },
                    width: 120,
                    height: 50,
                    ports,
                    data: {
                        config: {
                            type: 'switch-default',
                        },
                    },
                })
                const se1 = graph.createEdge({
                    source: switchNode,
                    sourcePort: switchNode.ports.items.find(i => i.group == 'right')?.id,
                    target: defCaseNode1,
                    targetPort: defCaseNode1.ports.items.find(i => i.group == 'left')?.id,
                    zIndex: 0
                })
                const se2 = graph.createEdge({
                    source: switchNode,
                    sourcePort: switchNode.ports.items.find(i => i.group == 'right')?.id,
                    target: defCaseNode2,
                    targetPort: defCaseNode2.ports.items.find(i => i.group == 'left')?.id,
                    zIndex: 0
                })
                graph.addNodes([switchNode, defCaseNode1, defCaseNode2]);
                graph.addEdges([se1, se2]);
                break;
            case 'switch-case':
                const switchCaseNode = graph.createNode({
                    shape: 'switch-case',
                    position: node.position(),
                    width: 100,
                    height: 50,
                    ports,
                    data: node.data
                })
                graph.removeNode(node);
                graph.addNode(switchCaseNode);
                break;
            case 'string':
                const strNode = graph.createNode({
                    shape: 'string',
                    position: node.position(),
                    width: 100,
                    height: 50,
                    ports,
                    data: node.data
                })
                graph.removeNode(node);
                graph.addNode(strNode);
                break;
            case 'num':
                const numNode = graph.createNode({
                    shape: 'num',
                    position: node.position(),
                    width: 100,
                    height: 50,
                    ports,
                    data: node.data
                })
                graph.removeNode(node);
                graph.addNode(numNode);
                break;
            case 'assignment':
                const assignmentNode = graph.createNode({
                    shape: 'assignment',
                    position: node.position(),
                    width: 220,
                    height: 50,
                    ports,
                    data: node.data
                })
                graph.removeNode(node);
                graph.addNode(assignmentNode);
                break;
            default:
                break;
        }

    }
}