import { ConceptEnum } from "./ConceptEnum";
import TypeAnnotation from "./TypeAnnotation";

export default interface TypeParam {
    concept?: ConceptEnum.TypeParam | string, // 产品概念
    name: string, // 类型名称
    className?: string,
    typeAnnotation?: TypeAnnotation,
    required?: boolean,
    defaultValue?: any,
}
