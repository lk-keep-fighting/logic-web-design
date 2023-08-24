import { ConceptEnum, StructureProperty, TypeAnnotation } from "../meta-data";

export class TypeAnnotationParser {
    /**
     * 通过值尝试转换为类型标注
     * @param value 具体的js值
     * @returns 
     */
    public static guessByValue(value: any): TypeAnnotation {
        let typeAnno: TypeAnnotation = {
            concept: ConceptEnum.TypeAnnotation,
            typeName: 'string',
            defaultValue: value,

        }
        if (Array.isArray(value)) {
            typeAnno.typeName = 'array';
        } else {
            const jsType = typeof value;
            switch (jsType) {
                case 'boolean':
                    typeAnno.typeKind = 'primitive';
                    typeAnno.typeName = 'boolean';
                    break;
                case 'number':
                    typeAnno.typeKind = 'primitive';
                    typeAnno.typeName = 'number';
                    break;
                case 'string':
                    typeAnno.typeKind = 'primitive';
                    typeAnno.typeName = 'string';
                    break;
                case 'object':
                    if (value == null) {
                        typeAnno.typeName = 'null';
                    } else if (value instanceof Date) {
                        typeAnno.typeKind = 'primitive';
                        typeAnno.typeName = 'date';
                    } else if (value instanceof RegExp) {
                        typeAnno.typeKind = 'primitive';
                        typeAnno.typeName = 'regexp';
                    } else if (value instanceof Function) {
                        typeAnno.typeKind = 'primitive';
                        typeAnno.typeName = 'function';
                    } else {
                        typeAnno.typeKind = 'anonymousStructure';
                        typeAnno.typeName = 'object';
                        typeAnno.properties = [];
                        Object.keys(value).map(key => {
                            const propValue = value[key];
                            const propTypeAnno = this.guessByValue(propValue);
                            const prop: StructureProperty = {
                                name: key,
                                typeAnnotation: propTypeAnno,
                                defaultValue: propValue
                            }
                            typeAnno.properties.push(prop)
                        })
                    }
                    break;
                default:
                    typeAnno.typeKind = 'unknown';
                    typeAnno.typeName = jsType;
                    break;
            }
        }
        return typeAnno;
    }
}