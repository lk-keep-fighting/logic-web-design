import { ConceptEnum } from "./base";

export default interface LogicItem {
    concept:ConceptEnum.LogicItem | "Start" | "End" | "SwitchStatement" | "SwitchCase"  | "Assignment" | "BatchAssignment" | "CallLogic" | "CallFunction" | "CallInterface" | "Destination" | "ValidationRule" | "Argument" | "Anchor" | "JSBlock" | "Identifier" | "NullLiteral" | "BooleanLiteral" | "StringLiteral" | "NumericLiteral" | "BinaryExpression" | "MatchCase" | "Match" | "UnaryExpression" | "MemberExpression" | "Unparsed" | "CallQueryComponent" | "QueryFromExpression" | "QueryJoinExpression" | "QueryFieldExpression" | "QueryAggregateExpression" | "QueryOrderByExpression" | "QueryGroupByExpression" | "QuerySelectExpression" | "QueryLimitExpression" | "SqlQueryComponent" | "ProcessOutcome" | "Assignee", // 产品概念
    label: string, // 逻辑项标题
    description: string, // 逻辑项描述
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