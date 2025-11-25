import EnvParam from "./EnvParam";
import { Transactional, ConceptEnum, TypeParam, LogicItem, Param, Return, Variable } from "./index";
export default class Logic {
    /**
     *
     */
    constructor(id: string) {
        this.id = id;
        this.schemeVersion = "0.1";
    }
    concept: string = ConceptEnum.Logic;
    /**
     * 配置文件格式版本号,默认0.1
     */
    schemeVersion?: string;
    /**
     * 实例版本
     */
    version?: string;
    id: string;//唯一编号
    name?: string; // 逻辑名称
    label?: string; // 逻辑标题
    description?: string; // 逻辑描述
    triggerType?: string; // triggerType
    log?: string;//是否开启节点日志
    cron?: string; // cron表达式，用于定时触发
    typeParams?: Array<TypeParam>; // 类型参数列表
    params?: Array<Param>; // 逻辑输入参数列表
    returns?: Array<Return>; // 逻辑输出参数列表
    variables?: Array<Variable>; //逻辑内全局变量列表
    envs?: Array<EnvParam>; // 逻辑运行环境
    items: Array<LogicItem> = []; // 逻辑项列表
    /**
     * 可视化配置，用于保存流程图显示的额外配置
     */
    visualConfig?: any;
}

// export interface Logic {
//     concept: ConceptEnum.Logic,
//     name: string, // 逻辑名称
//     label: string, // 逻辑标题
//     description: string, // 逻辑描述
//     triggerType: string, // triggerType
//     cron: string, // cron表达式，用于定时触发
//     transactional: Transactional, // 事务
//     compilerInfoMap: { java?: { packageName: string, className: string } }, // 编译器信息，目前仅在后端扩展模块中使用。
//     typeParams: Array<TypeParam>, // 类型参数列表
//     params: Array<Param>, // 输入参数列表
//     returns: Array<Return>, // 输出参数列表
//     variables: Array<Variable>, // 变量列表
//     body: Array<LogicItem>, // 逻辑项列表
//     playground: Array<LogicItem>, // 逻辑项列表
// }