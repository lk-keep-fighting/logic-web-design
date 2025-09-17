import { Graph, Node } from "@antv/x6";
import { ports } from "@/components/logic-editor/settings/Consts";

/**
 * 
 * @param panelNode 
 * @param graph 
 */
export const dealGraphNodeWhenAddedFromPanel = (graph: Graph, node: Node): any => {
    const data = node.getData();
    const pos = node.getPosition();
    const curNodes = graph.getNodes();
    console.log('dealGraphNodeWhenAddedFromPanel called for node type:', data?.config?.type, 'Node ID:', node.id, 'Current nodes count:', curNodes.length);
    
    // Prevent duplicate processing
    if (node.getData().__processed) {
        console.log('Node already processed, skipping:', node.id);
        return;
    }
    node.setData({ ...data, __processed: true });
    
    // const startNode = curNodes.find(item => 'start' === data.config.type);
    let newNode: Node | undefined;
    if (['ExtSharp', 'polygon'].indexOf(node.shape) > -1) {
        if (data?.config && data.config.type)
            switch (data.config.type) {
                case 'switch':
                    let width = 200;
                    const switchNode = graph.addNode({
                        shape: 'switch',
                        position: pos,
                        width,
                        height: 40,
                        ports,
                        data: node.data,
                        attrs: {
                            body: {
                                stroke: '#8f8f8f',
                                strokeWidth: 1,
                                fill: '#fff',
                                rx: 6,
                                ry: 6,
                            },
                        }
                    })
                    graph.removeNode(node);
                    const defCaseNode1 = graph.addNode({
                        shape: 'switch-case',
                        position: { y: pos.y + 100, x: pos.x - width / 2 },
                        width: 120,
                        height: 40,
                        ports,
                        data: {
                            config: {
                                type: 'switch-case',
                            },
                        },
                    })
                    const defCaseNode2 = graph.addNode({
                        shape: 'switch-default',
                        position: { y: pos.y + 100, x: pos.x + width },
                        width: 120,
                        height: 40,
                        ports,
                        data: {
                            config: {
                                type: 'switch-default',
                            },
                        },
                    })
                    const se1 = graph.addEdge({
                        source: switchNode,
                        sourcePort: switchNode.ports.items.find(i => i.group == 'bottom')?.id,
                        target: defCaseNode1,
                        targetPort: defCaseNode1.ports.items.find(i => i.group == 'top')?.id,
                        zIndex: 0
                    })
                    const se2 = graph.addEdge({
                        source: switchNode,
                        sourcePort: switchNode.ports.items.find(i => i.group == 'bottom')?.id,
                        target: defCaseNode2,
                        targetPort: defCaseNode2.ports.items.find(i => i.group == 'top')?.id,
                        zIndex: 0
                    })
                    // graph.addNodes([switchNode, defCaseNode1, defCaseNode2]);
                    // switchNode.addChild(defCaseNode1);
                    // switchNode.addChild(defCaseNode2);
                    // graph.addNodes([switchNode]);
                    // graph.addEdges([se1, se2]);
                    newNode = switchNode;
                    break;
                case 'switch-case':
                    const switchCaseNode = graph.createNode({
                        shape: 'switch-case',
                        position: node.position(),
                        width: 120,
                        height: 40,
                        ports,
                        data: node.data
                    })
                    graph.removeNode(node);
                    graph.addNode(switchCaseNode);
                    newNode = switchCaseNode;
                    break;
                case 'switch-default':
                    const switchDefaultNode = graph.createNode({
                        shape: 'switch-default',
                        position: node.position(),
                        width: 120,
                        height: 40,
                        ports,
                        data: node.data
                    })
                    graph.removeNode(node);
                    graph.addNode(switchDefaultNode);
                    newNode = switchDefaultNode;
                    break;
                case 'switch-cases':
                    const switchCasesNode = graph.createNode({
                        shape: 'switch-cases',
                        position: node.position(),
                        width: 120,
                        height: 50,
                        ports,
                        data: node.data
                    })
                    graph.removeNode(node);
                    graph.addNode(switchCasesNode);
                    newNode = switchCasesNode;
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
                    newNode = strNode;;
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
                    newNode = numNode;
                    break;
                case 'assign-global':
                    const assignmentGlobalNode = graph.createNode({
                        shape: 'assign-global',
                        position: node.position(),
                        width: 150,
                        height: 40,
                        ports,
                        data: node.data
                    })
                    graph.removeNode(node);
                    graph.addNode(assignmentGlobalNode);
                    newNode = assignmentGlobalNode;
                    break;
                case 'assign-local':
                    const assignmentLocalNode = graph.createNode({
                        shape: 'assign-local',
                        position: node.position(),
                        width: 150,
                        height: 40,
                        ports,
                        data: node.data
                    })
                    graph.removeNode(node);
                    graph.addNode(assignmentLocalNode);
                    newNode = assignmentLocalNode;
                    break;
                default:
                    break;
            }
    }
    if (['工序组'].indexOf(node.getAttrByPath('text/text')) > -1) {
        node.zIndex = -1;
        // node.setAttrByPath('text/text', '');
    }
    console.log('node:added')
    if (newNode && curNodes.length == 1) {
        graph.addEdge({
            source: curNodes[0],
            sourcePort: curNodes[0].ports.items.find(i => i.group == 'bottom')?.id,
            target: newNode,
            targetPort: newNode?.ports?.items?.find(i => i.group == 'top')?.id,
            zIndex: 0
        })
    }
}