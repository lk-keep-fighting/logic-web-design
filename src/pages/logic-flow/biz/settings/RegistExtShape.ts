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
import { HttpNode } from "../ext-shape/http";
import { JavaNode } from "../ext-shape/java";
import { JsNode } from "../ext-shape/js";
import { SubLogicNode } from "../ext-shape/sub-logic";
import { ExtShape1ReactNode } from "../ext-shape/extShape1";
import { ExtShape2ReactNode } from "../ext-shape/extShape2";
import { ExtShape3ReactNode } from "../ext-shape/extShape3";
import { WaitNode } from "../ext-shape/wait";
import { EndNode } from "../ext-shape/end";

export function RegistShape(customSharps: any[]) {
    customSharps.forEach((v) => {
        console.log('注册新节点:' + v.name);
        Graph.registerNode(v.name, v.config, true);
    });

    register({
        shape: 'start',
        component: StartNode,
    })
    register({
        shape: 'end',
        component: EndNode,
    })
    register({
        shape: 'wait-for-continue',
        component: WaitForContinueNode,
    })
    register({
        shape: 'http',
        component: HttpNode,
    })
    register({
        shape: 'js',
        component: JsNode,
    })
    register({
        shape: 'java',
        component: JavaNode,
    })
    register({
        shape: 'wait',
        component: WaitNode,
    })
    register({
        shape: 'sub-logic',
        component: SubLogicNode,
    })
    register({
        shape: 'ExtShape1',
        component: ExtShape1ReactNode,
    })
    register({
        shape: 'ExtShape2',
        component: ExtShape2ReactNode,
    })
    register({
        shape: 'ExtShape3',
        component: ExtShape3ReactNode,
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
        shape: 'switch-cases',
        component: SwitchCasesNode,
    })
    register({
        shape: 'switch-default',
        component: SwitchDefaultNode,
    })
}