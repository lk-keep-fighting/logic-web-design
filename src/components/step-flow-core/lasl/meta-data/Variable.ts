import { TypeAnnotation } from "./index";

export default interface Variable {
    concept: "Variable", // 产品概念
    name: string, // 变量名称
    description: string, // 变量描述
    typeAnnotation: TypeAnnotation, // 类型
    defaultValue: string, // 默认值
}