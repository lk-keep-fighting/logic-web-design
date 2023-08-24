import { DagreLayout } from "@antv/layout";
import { Graph } from "@antv/x6";
/**
 * 使用Dagre算法实现自动布局
 * @param graph 
 */
export const autoDagreLayout = (graph: Graph) => {
    const dagreLayout: DagreLayout = new DagreLayout({
        type: 'dagre',
        begin: [500, 100],
        // ranker: 'network-simplex', // 节点分层算法，可选：'tight-tree' 'longest-path' 'network-simplex'
        rankdir: 'TB', // 图的延展方向，可选： 'TB' | 'BT' | 'LR' | 'RL'
        ranksep: 20, // 图的各个层次之间的间距
        // nodesep: 20, // 同层各个节点之间的间距
        nodeSize: 50, // 节点的大小，默认：20
        // align: 'DL',// 节点对齐方式，可选：'UL' | 'UR' | 'DL' | 'DR' | undefined
        controlPoints: true,
    });
    const nodes = graph.getNodes();
    const edges = graph.getEdges();
    let { nodes: newNodes = [] } = dagreLayout.layout({ nodes, edges });
    nodes.forEach((current) => {
        const newNode = newNodes.find((node) => node.id === current.id);
        // if (newNode.shape == 'circle' || newNode.shape == 'polygon')
        //   current.position(newNode.x, newNode.y);
        // else
        // console.log(current.data?.config?.type)
        // console.log(current.size())
        newNode.x -= current.size().width / 2;
        newNode.y -= current.size().height / 2;
        current.position(newNode.x, newNode.y);
    });
}