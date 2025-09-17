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
    'switchCase' = 'switch-case',
    'switchDef' = 'switch-def',
    'http' = 'http',
    'subLogic' = 'sub-logic',
    'js' = 'js',
    'wait' = 'wait',
    'waitForContinue' = 'wait-for-continue',
}