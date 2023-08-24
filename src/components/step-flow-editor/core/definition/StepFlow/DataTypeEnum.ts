/**
 * 变量数据类型，默认string
 * 需要运算的数值类型需要指定int、float，否则会作为字符串处理
 * 定义函数时需要指定fn
 */
export enum DataTypeEnum {
    object = 'object',
    string = 'string',
    date = 'date',
    int = 'int',
    float = 'float',
    fn = 'fn',
}
