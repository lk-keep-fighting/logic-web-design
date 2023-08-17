import Context from './context';
/**
 * 自定义模板字符串解析，用于处理特殊变量类型，比如Array，用法getValueFromTplStr`${ids}`
 * @param strings
 * @param args
 * @returns
 */
export function myTplStrConvert(strings: any[], ...args: any[]) {
  console.log('------通过函数解析模板字符串');
  let expr: string[] = [];
  if (args.length === 0) return strings.join('');
  strings.forEach((v, i) => {
    expr.push(`${v}`);
    let a = args[i];
    console.log(a);
    if (a) {
      let isArray = a instanceof Array;
      if (isArray) {
        console.log('数组类型特殊处理');
        expr.push(`[`);
        a.forEach((e: any) => {
          expr.push(`"${e}"`);
          expr.push(`,`);
        });
        expr.pop();
        expr.push(`]`);
      } else expr.push(`${a}`);
    }
  });
  const res = expr.join('');
  console.log('^^^^^^^^^^^解析完成');
  console.log(res);
  return res;
}

/**
 * 通过执行js字符串脚本获取值
 * 如：`${c}`
 * @param script
 * @returns
 */
export function getByJsTplString(script: string, ctx: Context): any {
  if (script === undefined) return '';
  console.log('通过js模板字符串获取值');
  console.log(script);
  console.log('上下文数据：');
  console.log(ctx);
  console.log('替换键值中的"-"为"_"');
  const allCtxKeys = Object.keys(ctx).map(
    (k) => k,
    // (k) => k.replace('-', '_'),
    // `'${k}'`,
  );
  const allCtxValues = allCtxKeys.map((k) => ctx[k]);

  console.log('替换后：');
  console.log(allCtxKeys);
  const fn = new Function(
    '_ctx',
    'getValueFromTplStr',
    ...allCtxKeys,
    'return getValueFromTplStr`' + script + '`',
  );
  const res = fn(ctx, myTplStrConvert, ...allCtxValues);
  console.log('模板字符串结果：');
  console.log(res);
  return res;
}
/**
 * 执行js表达式，自动在脚本前追加return获取表达式返回值
 * @param jsScript
 * @param ctx
 * @returns
 */
export async function runJsExpress(jsScript: string, ctx: Context) {
  const allVarKeys = Object.keys(ctx).map((k) => k);
  const allVarValues = Object.keys(ctx).map((k) => ctx[k]);
  try {
    const res = new Function(
      '_ctx',
      '_flow',
      ...allVarKeys,
      'return ' + jsScript,
    );
    return res(ctx, ctx.flow, ...allVarValues);
  } catch (err) {
    ctx.flow?.log('js error');
    await ctx.flow?.hanleError(err);
    return err;
  }
}
