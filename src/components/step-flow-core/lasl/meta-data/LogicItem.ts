import { Param, Return } from ".";
import EnvParam from "./EnvParam";
import { ConceptEnum } from "./base";
import { LogicItemTypeEnum } from "./base/ConceptEnum";

export default class LogicItem {
    constructor(id:string,type:string){
        this.type=type;
        this.id=id;
    }
    concept:string='LogicItem';// | "Start" | "End" | "SwitchStatement" | "SwitchCase"  | "Assignment" | "BatchAssignment" | "CallLogic" | "CallFunction" | "CallInterface" | "Destination" | "ValidationRule" | "Argument" | "Anchor" | "JSBlock" | "Identifier" | "NullLiteral" | "BooleanLiteral" | "StringLiteral" | "NumericLiteral" | "BinaryExpression" | "MatchCase" | "Match" | "UnaryExpression" | "MemberExpression" | "Unparsed" | "CallQueryComponent" | "QueryFromExpression" | "QueryJoinExpression" | "QueryFieldExpression" | "QueryAggregateExpression" | "QueryOrderByExpression" | "QueryGroupByExpression" | "QuerySelectExpression" | "QueryLimitExpression" | "SqlQueryComponent" | "ProcessOutcome" | "Assignee"; // 产品概念
    id:string;//全局唯一编号
    name?: string; // 逻辑项名称
    type:string;
    label?: string; // 逻辑项标题
    description?: string; // 逻辑项描述
     /**
     * 入参
     */
    params?: Array<Param>;
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
    timeout?: number;
    branches?: Array<Branch>;
    /**
     * http
     */
    url?: string;
    method?: string;
    headers?: string;
    queryParams?: string;
    tranScope?: string;//事务范围，交互、java节点、关闭
    body?: string;
    /**
     * 设置环境变量
     * @param envs 环境变量实参
     */
    setEnv=(envs:Array<EnvParam>)=>{
        this.envs=envs;
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

// | "Start" - 开始
// | "End" - 结束
// | "IfStatement" - 如果语句
// | "SwitchStatement" - 开关语句
// | "SwitchCase" - 开关情况
// | "ForEachStatement" - 循环语句
// | "WhileStatement" - 当语句
// | "Assignment" - 赋值
// | "BatchAssignment" - 批量赋值
// | "Comment" - 注释
// | "CallLogic" - 调用逻辑
// | "CallFunction" - 调用函数
// | "CallInterface" - 调用接口
// | "Destination" - 目标
// | "ValidationRule" - 验证规则
// | "Argument" - 参数
// | "Anchor" - 锚点
// | "JSBlock" - JS块
// | "Identifier" - 标识符
// | "NullLiteral" - 空文本
// | "BooleanLiteral" - 布尔文本
// | "StringLiteral" - 字符串文本
// | "NumericLiteral" - 数字文本
// | "BinaryExpression" - 二元表达式
// | "MatchCase" - 匹配情况
// | "Match" - 匹配
// | "UnaryExpression" - 一元表达式
// | "MemberExpression" - 成员表达式
// | "Unparsed" - 未解析
// | "CallQueryComponent" - 调用查询组件
// | "QueryFromExpression" - 查询From表达式
// | "QueryJoinExpression" - 查询Join表达式
// | "QueryFieldExpression" - 查询字段表达式
// | "QueryAggregateExpression" - 查询聚合表达式
// | "QueryOrderByExpression" - 查询排序表达式
// | "QueryGroupByExpression" - 查询分组表达式
// | "QuerySelectExpression" - 查询选择表达式
// | "QueryLimitExpression" - 查询限制表达式
// | "SqlQueryComponent" - SQL查询组件
// | "ProcessOutcome" - 处理结果
// | "Assignee" - 被指派者
   
//NASL
// interface LogicItem {
//     concept: "LogicItem" | "Start" | "End" | "IfStatement" | "SwitchStatement" | "SwitchCase" | "ForEachStatement" | "WhileStatement" | "Assignment" | "BatchAssignment" | "Comment" | "CallLogic" | "CallFunction" | "CallInterface" | "Destination" | "ValidationRule" | "Argument" | "Anchor" | "JSBlock" | "Identifier" | "NullLiteral" | "BooleanLiteral" | "StringLiteral" | "NumericLiteral" | "BinaryExpression" | "MatchCase" | "Match" | "UnaryExpression" | "MemberExpression" | "Unparsed" | "CallQueryComponent" | "QueryFromExpression" | "QueryJoinExpression" | "QueryFieldExpression" | "QueryAggregateExpression" | "QueryOrderByExpression" | "QueryGroupByExpression" | "QuerySelectExpression" | "QueryLimitExpression" | "SqlQueryComponent" | "ProcessOutcome" | "Assignee", // 产品概念
//     label: string, // 逻辑项标题
//     description: string, // 逻辑项描述
//     folded: boolean, // 是否折叠
//     "offsetX": number, // offsetX
//     "offsetY": number, // offsetY
// }