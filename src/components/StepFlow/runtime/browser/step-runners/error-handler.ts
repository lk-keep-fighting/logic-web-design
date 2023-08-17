import Context from '../context';
export default async function ErrorHandlerRunner(ctx: Context, step: any) {
  const AsyncFunction = Object.getPrototypeOf(
    async function () { },
  ).constructor;

  const res = new AsyncFunction('_ctx', '_flow', step.script);
  return await res(ctx, ctx.flow);
}
