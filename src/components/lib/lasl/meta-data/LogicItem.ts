import { Param, Return } from ".";
import EnvParam from "./EnvParam";

export default class LogicItem {
    constructor(id: string, type: string) {
        this.type = type;
        this.id = id;
    }
    concept: string = 'LogicItem';// | "Start" | "End" | "SwitchStatement" | "SwitchCase"  | "Assignment" | "BatchAssignment" | "CallLogic" | "CallFunction" | "CallInterface" | "Destination" | "ValidationRule" | "Argument" | "Anchor" | "JSBlock" | "Identifier" | "NullLiteral" | "BooleanLiteral" | "StringLiteral" | "NumericLiteral" | "BinaryExpression" | "MatchCase" | "Match" | "UnaryExpression" | "MemberExpression" | "Unparsed" | "CallQueryComponent" | "QueryFromExpression" | "QueryJoinExpression" | "QueryFieldExpression" | "QueryAggregateExpression" | "QueryOrderByExpression" | "QueryGroupByExpression" | "QuerySelectExpression" | "QueryLimitExpression" | "SqlQueryComponent" | "ProcessOutcome" | "Assignee"; // 产品概念
    id: string;//全局唯一编号
    name?: string; // 逻辑项名称
    /**
     * 逻辑项版本
     */
    version?: string;
    /**
     * 自定义分组
     */
    group?: string;
    /**
     * 逻辑项或组件在远端的唯一标识
     */
    itemId?: string;
    /**
     * 组件平台标识
     */
    cbbId?: string;
    /**
     * 逻辑项编码
     */
    code?: string;
    type: string;
    label?: string; // 逻辑项标题
    description?: string; // 逻辑项描述
    bizOff?: boolean; // 是否关闭业务实例
    bizId?: string; // 业务标识
    objectId?: string; // 逻辑对象编号
    memo?: string; // 节点备注信息
    async?: boolean; // 是否异步执行
    sourceCode?: string; // 节点源码
    gitInfo?: string; // git信息
    /**
     * 入参
     */
    params?: Array<Param>;
    /**
     * 单返回值定义
     */
    returnType?: Param;
    /**
     * 返回参数
     */
    returns?: Array<Return>;
    /**
     * 环境变量
     */
    envs?: Array<EnvParam>;
    afterReturnAdaptor?: string;//返回值适配器(data)=>data
    returnAccept?: string;//节点值存储的变量,只用一个变量存储data，个性化需求通过afterReturnAdaptor或新增脚本节点适配
    nextId?: string;
    /**
     * while结束节点
     */
    endId?: string;
    /**
     * switch判断
     */
    condition?: string;
    /**
     * js
     */
    script?: string;
    /**
     * 普通节点的超时时间，wait节点的等待时间
     */
    timeout?: number | string;
    branches?: Array<Branch>;
    /**
     * http
     */
    url?: string;
    method?: string;
    headers?: string;
    body?: string;
    queryParams?: string;
    tranScope?: string;//事务范围，def、tranGroup、everyRequest
    tranPropagation?: number;//事务传播机制
    tranGroupId?: string;
    bizErrorModel?: string;//事务异常处理，def、ignore、stop
    /**
     * 设置环境变量
     * @param envs 环境变量实参
     */
    setEnv = (envs: Array<EnvParam>) => {
        this.envs = envs;
    }
}
  /**
   * 分支属性
   */
  export class Branch {
    when: string = '';
    nextId: string = '';
  }
export interface Start {
    concept:'Start',
    label: string, // 逻辑项标题
    description: string, // 逻辑项描述
}
export interface IfStatement {
    concept:'IfStatement',
    label: string, // 逻辑项标题
    description: string, // 逻辑项描述
}
export interface SwitchStatement {
    concept:'SwitchStatement',
    label: string, // 逻辑项标题
    description: string, // 逻辑项描述
    cases:Array<LogicItem>
}
export interface End {
    concept:'End',
    label: string, // 逻辑项标题
    description: string, // 逻辑项描述
}
