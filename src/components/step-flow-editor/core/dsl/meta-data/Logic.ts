import { Transactional, ConceptEnum, TypeParam, LogicItem, Param, Return, Variable } from "./index";
export default interface Logic {
    concept: ConceptEnum.Logic,
    name: string, // 逻辑名称
    label: string, // 逻辑标题
    description: string, // 逻辑描述
    triggerType: string, // triggerType
    cron: string, // cron表达式，用于定时触发
    typeParams: Array<TypeParam>, // 类型参数列表
    params: Array<Param>, // 逻辑输入参数列表
    returns: Array<Return>, // 逻辑输出参数列表
    variables: Array<Variable>, //逻辑内全局变量列表
    body: Array<LogicItem>, // 逻辑项列表
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