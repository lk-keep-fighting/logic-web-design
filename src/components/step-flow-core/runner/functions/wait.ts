import FnContext from "./context";

export default async function WaitRunner(ctx: FnContext, timeout: number) {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(timeout);
      }, timeout);
    });
  } catch (err) {
    // ctx._logic?.log('js error');
    // await ctx._logic?.handleError(err);
    return err;
  }
}
