import { TypeAnnotation } from "./index";

export default class Param {
    constructor(name: string) {
        this.name = name;
    }
    concept: string = "Param";// 产品概念
    name: string; // 输入参数名称
    description?: string; // 输入参数描述
    typeAnnotation?: TypeAnnotation; // 类型
    required?: boolean; // 是否必填
    defaultValue?: string; // 默认值
}