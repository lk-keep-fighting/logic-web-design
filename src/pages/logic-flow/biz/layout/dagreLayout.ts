import { DagreLayout } from "@antv/layout";
import { Graph, Node } from "@antv/x6";
/**
 * 使用Dagre算法实现自动布局
 * @param graph 
 */
export const autoDagreLayout = (graph: Graph) => {
    var dagreLayout: DagreLayout;
    const selectedCells = graph.getSelectedCells();
    var nodes: Node[] = [], edges = []
    if (selectedCells && selectedCells.length > 2) {
        selectedCells.forEach(c => {
            c.isNode() ? nodes.push(c) : edges.push(c)
        })
        dagreLayout = new DagreLayout({
            type: 'dagre',
            begin: [nodes[0].getPosition().x, nodes[0].getPosition().y],
            // ranker: 'tight-tree', // 节点分层算法，可选：'tight-tree' 'longest-path' 'network-simplex'
            rankdir: 'TB', // 图的延展方向，可选： 'TB' | 'BT' | 'LR' | 'RL'
            ranksepFunc: (d) => {
                switch (d.data.config.type) {
                    case 'sub-logic':
                    case 'switch-cases':
                        return 25;
                    default:
                        return 15;
                }
            },
            ranksep: 15, // 图的各个层次之间的间距
            // nodesep: 100, // 同层各个节点之间的间距
            nodeSize: 50, // 节点的大小，默认：20
            // align: 'DL',// 节点对齐方式，可选：'UL' | 'UR' | 'DL' | 'DR' | undefined
            controlPoints: true
        });
        graph.getEdges().forEach(edge => {
            var sourceNodeId = edge.getSourceCellId();
            var sourceNodeIdIdx = 0;
            var targetNodeId = edge.getTargetCellId();
            var targetNodeIdIdx = 0;
            if (nodes.find(i => i.id === sourceNodeId)) sourceNodeIdIdx++;
            if (nodes.find(i => i.id === targetNodeId)) targetNodeIdIdx++;
            if (sourceNodeIdIdx > 0 && targetNodeIdIdx > 0) {
                edges.push(edge);
            }

        });
        let { nodes: newNodes = [] } = dagreLayout.layout({ nodes, edges });
        nodes.forEach((current) => {
            const newNode = newNodes.find((node) => node.id === current.id);
            if (newNode) {
                newNode.x -= current.size().width / 2;
                newNode.y -= current.size().height / 2;
                current.position(newNode.x, newNode.y);
            }
        });
    } else {
        dagreLayout = new DagreLayout({
            type: 'dagre',
            begin: [400, 100],
            // ranker: 'network-simplex', // 节点分层算法，可选：'tight-tree' 'longest-path' 'network-simplex'
            rankdir: 'TB', // 图的延展方向，可选： 'TB' | 'BT' | 'LR' | 'RL'
            ranksepFunc: (d) => {
                switch (d.data.config.type) {
                    case 'sub-logic':
                    case 'switch-cases':
                        return 25;
                    default:
                        return 15;
                }
            },
            ranksep: 15, // 图的各个层次之间的间距
            // nodesep: 100, // 同层各个节点之间的间距
            nodeSize: 50, // 节点的大小，默认：20
            align: 'DL',// 节点对齐方式，可选：'UL' | 'UR' | 'DL' | 'DR' | undefined
            controlPoints: true
        });
        nodes = graph.getNodes();
        edges = graph.getEdges();
        let { nodes: newNodes = [] } = dagreLayout.layout({ nodes, edges });
        nodes.forEach((current) => {
            const newNode = newNodes.find((node) => node.id === current.id);
            if (newNode) {
                newNode.x -= current.size().width / 2;
                newNode.y -= current.size().height > 40 ? 20 : current.size().height / 2;
                current.position(newNode.x, newNode.y);
            }
        });
    }

}
export const autoDagreLayoutByNodesAndCells = (nodes, edges) => {
    debugger;
    const dagreLayout: DagreLayout = new DagreLayout({
        type: 'dagre',
        begin: [400, 100],
        ranker: 'tight-tree', // 节点分层算法，可选：'tight-tree' 'longest-path' 'network-simplex'
        rankdir: 'TB', // 图的延展方向，可选： 'TB' | 'BT' | 'LR' | 'RL'
        ranksep: 20, // 图的各个层次之间的间距
        // nodesep: 100, // 同层各个节点之间的间距
        nodeSize: 50, // 节点的大小，默认：20
        // align: 'DL',// 节点对齐方式，可选：'UL' | 'UR' | 'DL' | 'DR' | undefined
        controlPoints: true,
    });
    let { nodes: newNodes = [] } = dagreLayout.layout({ nodes, edges });
    nodes.forEach((current) => {
        const newNode = newNodes.find((node) => node.id === current.id);
        if (newNode) {
            newNode.x -= current.size().width / 2;
            newNode.y -= current.size().height / 2;
            current.position(newNode.x, newNode.y);
        }
    });
}