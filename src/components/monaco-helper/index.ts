/**
 * 将对象转换为文件格式，用于Monaco自动提示
 * ！！注意，不能使用JSON.stringfy，因为Monaco识别的是js/ts文件，
 * 而将对象转为json字符串会包含转义字符，所以无法识别
 * @param obj 需要转换为js文件的对象
 * @returns 
 */
const buildObjectStr = (obj: any) => {
    if (obj = null || obj == undefined) return obj;
    let str = '{';
    Object.keys(obj).forEach((item: any) => {
        const value = obj[item];
        str += `${item}:`;
        if (Array.isArray(value)) {
            str += `[],`;
        } else if (typeof value == 'object') {
            str += buildObjectStr(value) + ',';
        } else if (typeof value == 'string') {
            str += `'${value}',`;
        } else {
            str += `${value},`;
        }
    });
    str += '}';
    return str;
}
/**
 * 根据变量对象生成某个变量的Monaco自动提示字符串
 * 将函数返回值注入ctx为返回值
 * monaco?.languages.typescript.javascriptDefaults.addExtraLib(ctx);
 * @param varName 提示变量名
 * @param obj 变量名对应的对象定义
 * @returns 满足Monaco提示要求的字符串
 */
export const buildVarExtarLibByObj = (varName: string, obj?: Object) => {
    let str = '';
    if (obj) {
        // console.log('obj')
        // console.log(obj)
        Object.keys(obj).forEach((item: any) => {
            const value = obj[item];
            str += `${item}:`;
            if (Array.isArray(value)) {
                str += `[],`;
            } else if (typeof value == 'object') {
                str += buildObjectStr(value) + ',';
            } else if (typeof value == 'string') {
                str += `'${value}',`;
            } else {
                str += `${value},`;
            }
        })
        str = str.substring(0, str.length - 1);
    }
    const varExtarLib = `const ${varName}={${str}}`;
    return varExtarLib;
}