import { Graph } from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import { StringNode } from "../ext-shape/string";
import { NumNode } from "../ext-shape/num";
import { SwitchCaseNode } from "../ext-shape/swtich-case";
import { SwitchNode } from "../ext-shape/swtich";
import { SwitchDefaultNode } from "../ext-shape/swtich-default";
import { SwitchCasesNode } from "../ext-shape/swtich-cases";
import { StartNode } from "../ext-shape/start";
import { WaitForContinueNode } from "../ext-shape/wait-for-continue";

export function RegistShape(customSharps: any[]) {
    customSharps.forEach((v) => {
        console.log('注册新节点:' + v.name);
        Graph.registerNode(v.name, v.config, true);
    });

    // register({
    //     shape: 'start',
    //     component: StartNode,
    // })
    // register({
    //     shape: 'wait-for-continue',
    //     component: WaitForContinueNode,
    // })
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
        shape: 'switch-cases',
        component: SwitchCasesNode,
    })
    register({
        shape: 'switch-default',
        component: SwitchDefaultNode,
    })
}