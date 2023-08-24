import { TypeAnnotation, ConceptEnum, LASLBase } from "./index";

export default interface StructureProperty extends LASLBase {
    concept: ConceptEnum.StructureProperty,
    name: string, // 数据结构属性名称
    label: string, // 数据结构属性标题
    description: string, // 数据结构属性描述
    typeAnnotation: TypeAnnotation, // 类型
    required: boolean, // 是否必填
    defaultValue: string, // 默认值，JSON 字符串
}