// DSL转换服务
import { Graph } from "@antv/x6";
import { GraphToLogic, LogicToGraph } from "@/components/lib/dsl/parser/logic-parser";
import { LogicFlowConfig } from "../../types";

export class BizDslConvert {
  /**
   * 将图形转换为逻辑DSL
   */
  graphToLogicItems(graph: Graph | undefined, dsl?: LogicFlowConfig): LogicFlowConfig {
    if (!graph) {
      return { ...dsl } as LogicFlowConfig;
    }
    
    let logic: any = GraphToLogic(dsl?.id, graph.getCells());
    logic.visualConfig = graph.toJSON();
    
    return {
      ...dsl,
      visualConfig: logic.visualConfig,
      items: logic.items
    } as LogicFlowConfig;
  }

  /**
   * 将逻辑DSL转换为图形JSON
   */
  logicToGraphJson(logic: LogicFlowConfig): any {
    if (!logic) {
      return {};
    }
    
    return LogicToGraph(logic);
  }
}
