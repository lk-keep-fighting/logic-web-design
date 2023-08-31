import { LogicItem, Param, Return } from "../lasl/meta-data";
import { LogicItemTypeEnum } from "../lasl/meta-data/base/ConceptEnum";
import { LogicRunner } from "./LogicRunner";
import functions from "./functions";
import FnContext from "./functions/context";

export default class LogicItemRunner {
    dsl: LogicItem;
    constructor(itemDsl: LogicItem, logicRunner?: LogicRunner) {
        this.dsl = itemDsl;
        this.logicRunner = logicRunner;
    }
    logicRunner?: LogicRunner;
    /**
  * 执行本节点
  * @param params 本节点入参
  * @returns 
  */
    run = async (ctx: FnContext): Promise<Object> => {
        let ret: any;
        console.log("执行逻辑节点", this.dsl.name);
        switch (this.dsl.type) {
            case LogicItemTypeEnum.end:
                ret = functions['js'](ctx, this.dsl.script ?? 'return _ret')
                break;
            case LogicItemTypeEnum.switch:
                break;
            case LogicItemTypeEnum["switch-case"]:
                break;
            case LogicItemTypeEnum["switch-def"]:
                break;
            case LogicItemTypeEnum["mqtt-client"]:
                console.log("mqtt client item case")
                ret = functions['mqtt'](ctx, this.dsl)
                break;
            case LogicItemTypeEnum["mqtt-pub"]:
                break;
            case LogicItemTypeEnum["mqtt-sub"]:
                break;
            case LogicItemTypeEnum.http:
                ret = functions['http'](ctx, this.dsl)
                break;
            case LogicItemTypeEnum.wait:
                ret = functions['wait'](ctx, this.dsl.timeout ?? 0)
                break;
            case LogicItemTypeEnum.js:
                ret = functions['js'](ctx, this.dsl.script ?? '')
                break;
            case LogicItemTypeEnum.start:
            default:
                console.log("def item case")
                break;
        }
        return ret;
    }
    // findNextItem = (itemId: string): LogicItem | undefined => {
    //     let nxtItem: LogicItem | undefined;
    //     switch (this.dsl.concept) {
    //         case LogicItemConceptEnum.start:
    //             nxtItem = this.logicRunner?.findItemById(itemId);
    //             break;
    //         case LogicItemConceptEnum.end:
    //             break;
    //         case LogicItemConceptEnum.switch:
    //             break;
    //         case LogicItemConceptEnum["switch-case"]:
    //             break;
    //         case LogicItemConceptEnum["switch-def"]:
    //             break;
    //         case LogicItemConceptEnum["mqtt-client"]:
    //             break;
    //         case LogicItemConceptEnum["mqtt-pub"]:
    //             break;
    //         case LogicItemConceptEnum["mqtt-sub"]:
    //             break;
    //         case LogicItemConceptEnum.http:
    //             break;
    //         case LogicItemConceptEnum.js:
    //             break;
    //         default:
    //             break;
    //     }
    //     return nxtItem;
    // }

}