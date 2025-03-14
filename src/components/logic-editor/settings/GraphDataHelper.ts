import { Graph } from "@antv/x6";
import { ports, portsOnBottom } from "@/components/logic-editor/settings/Consts";

export function appendStartNode(graph: Graph) {
    const startNode = graph.createNode({
        shape: 'start',
        width: 50,
        height: 50,
        // attrs: {
        //     body: {
        //         fill: 'white',
        //     },
        //     text: {
        //         text: '开始',
        //         fontSize: 12,
        //         // 'font-weight': 'bolder',
        //     },
        // },
        // markup: [
        //     {
        //         tagName: 'circle',
        //         selector: 'body',
        //     },
        //     {
        //         tagName: 'text',
        //         selector: 'label',
        //     }],
        ports: ports,
        data: {
            config: {
                type: 'start',
                name: '开始',
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