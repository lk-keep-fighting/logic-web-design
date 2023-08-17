import { Graph } from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import { StringNode } from "../ext-shape/string";
import { NumNode } from "../ext-shape/num";
import { SwitchCaseNode } from "../ext-shape/swtich-case";
import { SwitchNode } from "../ext-shape/swtich";
import { portsOnRight } from "./Consts";
import { SwitchDefaultNode } from "../ext-shape/swtich-default";

export function RegistShape(customSharps: any[]) {
    customSharps.forEach((v) => {
        console.log('注册新节点:' + v.name);
        Graph.registerNode(v.name, v.config, true);
    });

    register({
        shape: 'string',
        component: StringNode,
    })
    register({
        shape: 'num',
        component: NumNode,
    })
    register({
        shape: 'switch',
        component: SwitchNode,
    })
    register({
        shape: 'switch-case',
        component: SwitchCaseNode,
    })
    register({
        shape: 'switch-default',
        component: SwitchDefaultNode,
    })
}
export function DefaultGraph(graph: Graph) {
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
        ports: portsOnRight,
        data: {
            config: {
                type: 'start'
            },
        },
    })
    // const endNode = graph.createNode({
    //   shape: 'circle',
    //   label: 'end',
    //   width: 50,
    //   height: 50,
    //   attrs: {
    //     body: {
    //       fill: '#d9d9d9',
    //     },
    //   },
    //   ports,
    //   data: {
    //     config: {
    //       type: 'end',
    //     },
    //   },
    // })
    // const se = graph.createEdge({
    //   source: startNode,
    //   target: endNode,
    //   sourcePort: startNode.ports.items.find(i => i.group == 'right')?.id,
    //   targetPort: endNode.ports.items.find(i => i.group == 'left')?.id
    // })
    graph.addNode(startNode);
    // graph.addEdge(se);
}