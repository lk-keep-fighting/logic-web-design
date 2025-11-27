import { TypeAnnotation } from "./index";

export default class EnvParam {
    constructor(name: string) {
        this.name = name;
    }
    concept?: string = "EnvParam"; // 环境变量
    name: string; // 输入参数名称
    className?: string; // 环境变量所属的class信息
    description?: string; // 输入参数描述
    typeAnnotation?: TypeAnnotation; // 类型
    required: boolean = false; // 是否必填
    defaultValue?: any; // 默认值
}
