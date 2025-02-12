import { Graph } from "@antv/x6";
import { ports, portsOnBottom } from "@/components/logic-editor/settings/Consts";
import { LogicItem } from "@/components/step-flow-core/lasl/meta-data";
import { LogicItemSharpMapping } from "@/pages/logic-flow/biz/convert/logicItemSharpMapping";

export function appendStartNode(graph: Graph) {
    const startNode = graph.createNode({
        shape: 'circle',
        width: 50,
        height: 50,
        attrs: {
            body: {
                fill: 'white',
            },
            text: {
                text: '开始',
                fontSize: 12,
                // 'font-weight': 'bolder',
            },
        },
        markup: [
            {
                tagName: 'circle',
                selector: 'body',
            },
            {
                tagName: 'text',
                selector: 'label',
            }],
        ports: portsOnBottom,
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
export function appendLogicItemNode(graph: Graph, logicItem: LogicItem) {

    var nodeConfig = LogicItemSharpMapping[logicItem.type]
    if (nodeConfig) {
        nodeConfig.data = { config: logicItem }
        const itemNode = graph.createNode(nodeConfig)
        itemNode.setAttrByPath('text/text', logicItem.name);
        graph.addNode(itemNode);
    }
}
