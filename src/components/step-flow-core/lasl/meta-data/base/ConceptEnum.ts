export enum ConceptEnum {
    /**
     * 类型注解
     */
    'TypeAnnotation' = 'TypeAnnotation',
    /**
     * 数据结构
     */
    'Structure' = 'Structure',
    /**
     * 数据结构属性
     */
    'StructureProperty' = 'StructureProperty',
    /**
     * 泛型类型的类型参数
     */
    'TypeParam' = 'TypeParam',
    /**
     * 变量
     */
    'Variable' = 'Variable',
    /**
     * 逻辑定义
     */
    'Logic' = 'Logic',
    /**
     * 逻辑项
     */
    'LogicItem' = 'LogicItem',
}
export enum LogicItemTypeEnum {
    'start' = 'start',
    'end' = 'end',
    'switch' = 'switch',
    'switch-case' = 'switch-case',
    'switch-def' = 'switch-def',
    'http' = 'http',
    'logic' = 'logic',
    'js' = 'js',
    'wait' = 'wait'
}