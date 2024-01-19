import { Graph } from "@antv/x6";
import { portsOnBottom } from "@/components/logic-editor/settings/Consts";

export function appendStartNode(graph: Graph) {
    const startNode = graph.createNode({
        shape: 'circle',
        label: 'start',
        width: 50,
        height: 50,
        attrs: {
            body: {
                // fill: '#d9d9d9',
            },
        },
        ports: portsOnBottom,
        data: {
            config: {
                type: 'start'
            },
        },
    })
    // // const endNode = graph.createNode({
    // //   shape: 'circle',
    // //   label: 'end',
    // //   width: 50,
    // //   height: 50,
    // //   attrs: {
    // //     body: {
    // //       fill: '#d9d9d9',
    // //     },
    // //   },
    // //   ports,
    // //   data: {
    // //     config: {
    // //       type: 'end',
    // //     },
    // //   },
    // // })
    // // const se = graph.createEdge({
    // //   source: startNode,
    // //   target: endNode,
    // //   sourcePort: startNode.ports.items.find(i => i.group == 'right')?.id,
    // //   targetPort: endNode.ports.items.find(i => i.group == 'left')?.id
    // // })
    graph.addNode(startNode);
    // // graph.addEdge(se);
}