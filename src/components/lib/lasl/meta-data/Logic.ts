import EnvParam from "./EnvParam";
import { Transactional, ConceptEnum, TypeParam, LogicItem, Param, Return, Variable } from "./index";

export type LogicVisualConfig = Record<string, any>;

export default class Logic {
    constructor(id?: string) {
        this.id = id ?? this.id;
        this.schemaVersion = "0.1";
        this.schemeVersion = this.schemaVersion;
    }
    concept: string = ConceptEnum.Logic;
    /**
     * 配置文件格式版本号,默认0.1
     */
    schemaVersion?: string;
    /**
     * @deprecated 使用 schemaVersion 代替
     */
    schemeVersion?: string;
    /**
     * 实例版本
     */
    version?: string;
    /**
     * 唯一编号
     */
    id: string = '';//唯一编号
    name?: string; // 逻辑名称
    label?: string; // 逻辑标题
    description?: string; // 逻辑描述
    triggerType?: string; // triggerType
    /**
     * 是否开启节点日志
     */
    log?: string | boolean;//是否开启节点日志
    cron?: string; // cron表达式，用于定时触发
    typeParams?: Array<TypeParam>; // 类型参数列表
    params?: Array<Param>; // 逻辑输入参数列表
    returns?: Array<Return>; // 逻辑输出参数列表
    variables?: Array<Variable>; //逻辑内全局变量列表
    envs?: Array<EnvParam>; // 逻辑运行环境
    /**
     * 事务配置
     */
    transactional?: Transactional;
    items: Array<LogicItem> = []; // 逻辑项列表
    /**
     * 可视化配置，用于保存流程图显示的额外配置
     */
    visualConfig?: LogicVisualConfig;
}
