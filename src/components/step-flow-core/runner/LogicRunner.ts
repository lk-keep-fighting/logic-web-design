import { Logic, LogicItem, Param, Return, Variable } from "../lasl/meta-data";
import { StepFlow } from "../types/StepFlow";
import EnvParam from "../lasl/meta-data/EnvParam";
import { LogicItemTypeEnum } from "../lasl/meta-data/base/ConceptEnum";
import LogicItemRunner from "./LogicItemRunner";
import { TypeAnnotationParser } from "../lasl/parser/type-annotation-parser";
import functions from "./functions";
import FnContext from "./functions/context";

export class LogicRunner {

    /**
     * 流程配置文件
     */
    dsl: Logic;
    paramsJson: Object;
    returnsJson: Object;
    variablesJson: Object;
    envsJson: Object;
    constructor(flowDsl: Logic) {
        this.dsl = flowDsl;
        this.paramsJson = TypeAnnotationParser.getJsonByParams(flowDsl.params ?? []);
        this.returnsJson = TypeAnnotationParser.getJsonByParams(flowDsl.returns ?? []);
        this.variablesJson = TypeAnnotationParser.getJsonByParams(flowDsl.variables ?? []);
        this.envsJson = TypeAnnotationParser.getJsonByParams(flowDsl.envs ?? []);
    }
    /**
     * 设置环境变量，json对象
     */
    set setEnv(env: Object) {
        this.envsJson = env;
    }
    /**
     * 运行流程，入参和环境变量会基于声明时的默认值解构赋值
     * @param input 运行入参
     * @param env 运行环境变量
     */
    async run(params?: Object, env?: Object): Promise<any> {
        if (params) this.paramsJson = { ...this.paramsJson, ...params };
        if (env) this.envsJson = { ...this.envsJson, ...env };
        let items = this.dsl.items;
        const startItem = items.find(i => i.type == LogicItemTypeEnum.start)
        if (startItem) {
            let ctx = new FnContext(this.paramsJson, this.returnsJson, this.variablesJson, this.envsJson);
            return this.runItem(startItem, ctx);
        }
        else {
            throw Error("未找到开始节点");
        }
    }
    /**
   * 运行流程，入参和环境变量会基于声明时的默认值解构赋值
   * @param itemId 需要触发的节点编号
   * @param input 运行入参
   * @param env 运行环境变量
   */
    async triggerToRun(itemId: string, params?: Object, env?: Object): Promise<any> {
        if (params) this.paramsJson = { ...this.paramsJson, ...params };
        if (env) this.envsJson = { ...this.envsJson, ...env };
        let items = this.dsl.items;
        const startItem = items.find(i => i.id == itemId)
        if (startItem) {
            let ctx = new FnContext(this.paramsJson, this.returnsJson, this.variablesJson, this.envsJson);
            return this.runItem(startItem, ctx);
        }
        else {
            throw Error("未找到开始节点");
        }
    }
    async runItem(item: LogicItem, ctx: FnContext): Promise<Object> {
        let ret = await new LogicItemRunner(item).run(ctx);
        ctx._lastRet = ret;
        if (item.returnAccept) {
            functions['js'](ctx, `${item.returnAccept}=_lastRet`)
        }
        const nextItem = await this.findNextItem(item);
        if (nextItem) {
            ret = await this.runItem(nextItem, ctx);
        } else {
            console.log(`${item.name}无下级节点`)
        }
        return ret;
    }
    /**
     * 通过id找到item
     */
    async getItemById(id: string): Promise<LogicItem | undefined> {
        return this.dsl.items.find(i => i.id == id);
    }
    /**
     * 查找下一个节点实例
     * @param item 
     * @returns 
     */
    async findNextItem(item: LogicItem): Promise<LogicItem | undefined> {
        let nextId;
        let nextItem;
        console.log('findNextItem', item)
        switch (item.type) {
            case 'switch':
                const switchConditionRet = await functions['js'](new FnContext(this.paramsJson, this.returnsJson, this.variablesJson, this.envsJson), 'return ' + item.condition ?? '')
                console.log('switchConditionRet', switchConditionRet)
                let defNextId = ''
                item.branches?.forEach(v => {
                    console.log('when', v.when, 'nextId', v.nextId)
                    if (v.when) {
                        if (v.when == switchConditionRet) {
                            nextId = v.nextId;
                            console.warn('命中：when', v.when, 'nextId', v.nextId)
                        }
                    }
                    else defNextId = v.nextId//default节点，没有when属性
                })
                if (!nextId) nextId = defNextId;
                break;
            default:
                nextId = item.nextId;
                break;
        }
        if (nextId) {
            nextItem = this.getItemById(nextId)
        }
        return nextItem;
    }

    async log(msg: string) {
        console.log(msg);
    }
    async handleError(err: any) {
        console.error(err);
    }

}