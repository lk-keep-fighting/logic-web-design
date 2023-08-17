import Context from '../context';
export default async function JsRunner(ctx: Context, step: any) {
  try {
    const AsyncFunction = Object.getPrototypeOf(
      async function () { },
    ).constructor;

    const res = new AsyncFunction('_ctx', '_flow', step.script);
    return await res(ctx, ctx.flow);
  } catch (err) {
    ctx.flow?.log('js error');
    await ctx.flow?.hanleError(err);
    return err;
  }
}
