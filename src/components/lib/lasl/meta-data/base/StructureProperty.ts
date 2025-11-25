import { TypeAnnotation, ConceptEnum, LASLBase } from "./index";

export default class StructureProperty implements LASLBase {
    constructor(name: string) {
        this.concept = ConceptEnum.StructureProperty;
        this.name = name;;
    }
    concept: string;
    name: string; // 数据结构属性名称
    label?: string; // 数据结构属性标题
    description?: string; // 数据结构属性描述
    typeAnnotation?: TypeAnnotation; // 类型
    required?: boolean = false; // 是否必填
    defaultValue?: string // 默认值，JSON 字符串
}