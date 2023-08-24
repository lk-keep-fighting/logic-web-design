// import axios from 'axios';
import Context from '../context';
import { getByJsTplString } from '../tool';
/**
 * 通过客户端提交的header取值转换为当前请求的header
 * 注意：前端请求的header键值已经被转换为小写，所以在取值时注意要用小写，且'-'被替换为'_'
 * @param customHeaders
 * @returns
 */
function getHeaderFromClient(customHeaders: any, ctx: Context) {
  let headers: { [Key: string]: string };
  if (!customHeaders) return {};
  headers = JSON.parse(customHeaders);
  Object.keys(headers).forEach((h: any) => {
    const res = getByJsTplString(headers[h], ctx);
    headers[h] = res;
  });
  console.log('解析自定义请求头结果：');
  console.log(headers);
  return headers;
}

export default async function HttpRunner(ctx: Context, step: any) {
  try {
    const pars = getByJsTplString(step.parameter, ctx);
    const data = pars ? JSON.parse(pars) : {};
    let customHeaders = getHeaderFromClient(step.headers, ctx); //{ ...step.headers };
    let method = getByJsTplString(step.method, ctx);
    let url = getByJsTplString(step.url, ctx);
    url = encodeURI(url);
    const res = ctx.http.request({
      url,
      method,
      headers: customHeaders,
      data,
    });
    return res;
  } catch (err) {
    ctx.flow?.warn('http-runner error');
    await ctx.flow?.hanleError(err);
    return err;
  }
}
