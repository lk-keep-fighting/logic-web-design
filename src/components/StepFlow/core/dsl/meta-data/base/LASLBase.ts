import { TypeAnnotation } from './TypeAnnotation';

export default interface LASLBase {
    concept: string,//当前节点概念
    version?: '1.0',//当前节点版本
    typeAnnotation?: TypeAnnotation,//当前节点类型描述，可缺省，默认根据concept推断，在动态添加的节点中有用
}
