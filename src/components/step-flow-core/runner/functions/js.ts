import FnContext from "./context";

export default async function JsRunner(ctx: FnContext, script: string) {
  try {
    const allCtxKeys = Object.keys(ctx).map(
      (k) => k,
    );
    const allCtxValues = allCtxKeys.map((k) => ctx[k]);
    const AsyncFunction = Object.getPrototypeOf(
      async function () { },
    ).constructor;

    //正则表达式 匹配全部"\" 需要加 /g
    let reg = /\\/g;
    //使用replace方法将全部匹配正则表达式的转义符替换为空
    let originScript = script.replace(reg, '');

    const res = new AsyncFunction(...allCtxKeys, originScript);
    return res(...allCtxValues);
  } catch (err) {
    // ctx._logic?.log('js error');
    // await ctx._logic?.handleError(err);
    return err;
  }
}
