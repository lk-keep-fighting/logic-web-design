import { Graph } from "@antv/x6";
import { Logic } from "@/components/step-flow-core/lasl/meta-data";
import { GraphToLogic, LogicToGraph } from "@/components/step-flow-core/lasl/parser/logic-parser";
export class BizDslConvert {
    graphToLogicItems(graph: Graph | undefined, dsl?: Logic): Logic {
        let logic: Logic = GraphToLogic(dsl?.id, graph?.getCells());
        logic.visualConfig = graph?.toJSON();
        return { ...dsl, visualConfig: logic.visualConfig, items: logic.items }
    }
    logicToGraphJson(logic: Logic): any {
        var cells = LogicToGraph(logic)
        return cells;
    }
}
