import { Cell, Edge, Graph, Node } from "@antv/x6";
import { ProcessInput } from "../services/dtos/processInput";
import { Logic } from "@/components/step-flow-core/lasl/meta-data";
import { GraphToLogic } from "@/components/step-flow-core/lasl/parser/logic-parser";
export class BizDslConvert {
    graphToLogicDsl(graph: Graph | undefined, dsl?: Logic): Logic {
        let logic: Logic = GraphToLogic(dsl?.id, graph?.getCells());
        logic.visualConfig = graph?.toJSON();
        return { ...dsl, visualConfig: logic.visualConfig, items: logic.items }
    }
}
