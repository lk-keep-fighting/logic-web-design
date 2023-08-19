import { TypeAnnotation } from "./index";

export default interface Return {
    concept: "Return", // 产品概念
    name: string, // 输出参数名称
    description: string, // 输出参数描述
    typeAnnotation: TypeAnnotation, // 类型
    defaultValue: string, // 默认值
}