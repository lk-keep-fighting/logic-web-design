import { Graph } from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import { StringNode } from "../ext-shape/string";
import { NumNode } from "../ext-shape/num";

export function RegistShape(customSharps: any[]) {
    customSharps.forEach((v) => {
        console.log('注册新节点:' + v.name);
        Graph.registerNode(v.name, v.config, true);
    });

    register({
        shape: 'string',
        // width: 120,
        height: 50,
        component: StringNode,
    })
    register({
        shape: 'num',
        // width: 120,
        height: 50,
        component: NumNode,
    })
}