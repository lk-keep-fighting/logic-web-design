import { ConceptEnum, Param, Return, StructureProperty, TypeAnnotation, Variable } from "../meta-data";
import EnvParam from "../meta-data/EnvParam";

export class TypeAnnotationParser {
    /**
     * 通过值尝试转换为类型标注
     * @param value 具体的js值
     * @returns 
     */
    public static valueToTypeAnnotaion(value: any): TypeAnnotation {
        let typeAnno: TypeAnnotation = {
            concept: ConceptEnum.TypeAnnotation,
            typeKind: 'primitive',
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
                            const propTypeAnno = this.valueToTypeAnnotaion(propValue);
                            const prop: StructureProperty = new StructureProperty(key)
                            prop.typeAnnotation = propTypeAnno;
                            prop.defaultValue = propValue;
                            typeAnno.properties?.push(prop)
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
    public static typeAnnotaionToValue(t: TypeAnnotation): any {
        let value: any;

        switch (t.typeName) {
            case 'array':
                value = t.defaultValue ?? [];
                break;
            case 'boolean':
                value = t.defaultValue ? t.defaultValue == 'true' : false;
                break;
            case 'number':
                value = parseFloat(t.defaultValue)
                break;
            case 'null':
                value = null
                break;
            case 'date':
                value = new Date(t.defaultValue)
                break;
            case 'regexp':
                value = new RegExp(t.defaultValue);
                break;
            case 'object':
                value = {};
                t.properties?.forEach(p => {
                    value[p.name] = this.typeAnnotaionToValue(p.typeAnnotation)
                })
                break;
            case 'string':
            case 'function':
            default:
                value = t.defaultValue;
                break;
        }
        return value;
    }

    public static getParamArrayByJson(jsonObject: any): Array<Param> {
        let params: Array<Param> = [];
        if (jsonObject) {
            Object.keys(jsonObject).forEach((key) => {
                let p = new Param(key);
                p.typeAnnotation = TypeAnnotationParser.valueToTypeAnnotaion(jsonObject[key]);
                p.defaultValue = jsonObject[key];
                params.push(p)
            })
        }
        return params;
    }
    public static getReturnArrayByJson(jsonObject: any): Array<Return> {
        let returns: Array<Return> = [];
        if (jsonObject) {
            Object.keys(jsonObject).forEach((key) => {
                let p = new Return(key);
                p.typeAnnotation = TypeAnnotationParser.valueToTypeAnnotaion(jsonObject[key]);
                p.defaultValue = jsonObject[key];
                returns.push(p)
            })
        }
        return returns;
    }
    public static getVariableArrayByJson(jsonObject: any): Array<Variable> {
        let vars: Array<Variable> = [];
        if (jsonObject) {
            Object.keys(jsonObject).forEach((key) => {
                let p = new Variable(key);
                p.typeAnnotation = TypeAnnotationParser.valueToTypeAnnotaion(jsonObject[key]);
                p.defaultValue = jsonObject[key];
                vars.push(p)
            })
        }
        return vars;
    }
    public static getEnvsArrayByJson(jsonObject: any): Array<EnvParam> {
        let envs: Array<EnvParam> = [];
        if (jsonObject) {
            Object.keys(jsonObject).forEach((key) => {
                let p = new EnvParam(key);
                p.typeAnnotation = TypeAnnotationParser.valueToTypeAnnotaion(jsonObject[key]);
                p.defaultValue = jsonObject[key];
                envs.push(p)
            })
        }
        return envs;
    }

    public static getJsonByParams(params: Array<Param>): any {
        let json: any = {};
        params?.forEach((p) => {
            json[p.name] = p.typeAnnotation ? this.typeAnnotaionToValue(p.typeAnnotation) : p.defaultValue;
        })
        return json;
    }
}