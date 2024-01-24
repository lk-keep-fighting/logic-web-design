import { Graph } from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import { StringNode } from "../ext-shape/string";
import { NumNode } from "../ext-shape/num";
import { SwitchCaseNode } from "../ext-shape/swtich-case";
import { SwitchNode } from "../ext-shape/swtich";
import { portsOnBottom } from "@/components/logic-editor/settings/Consts";
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
        // effect: ['data'],
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