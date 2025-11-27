import LASLBase from "./LASLBase";
import { ConceptEnum, StructureProperty } from "./index";

/**
 * 类型注解，用于描述节点类型
 * 设计时可生成动态配置的参数类型，通过类型进行自动提示与校验
 * 运行时可根据类型做运行/编译检查，类型解析
 */
export default interface TypeAnnotation extends LASLBase {
    concept: ConceptEnum.TypeAnnotation,
    typeKind: "primitive" | "reference" | "generic" | 'array' | "typeParam" | "function" | "union" | "anonymousStructure" | 'unknown', // 类型种类
    typeNamespace?: string,
    typeName: string,
    typeArguments?: Array<TypeAnnotation>,
    genericTypes?: Array<TypeAnnotation>,
    returnType?: Array<TypeAnnotation>,
    inferred?: boolean,
    properties?: Array<StructureProperty>, //匿名数据结构属性
    ruleMap?: Object,
    //------新增属性
    defaultValue?: any,
}

/**
 * 联合类型，typeArguments可以传入多种类型
 * typeKind:"union"
 * typeNamespace: "nasl.core"
 * typeName: "Union"
 * typeArguments: Array[2]
 */