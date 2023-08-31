import axios from 'axios';
import functions from '.';
import { getByJsTplString } from '../../helper/tool';
import { LogicItem } from '../../lasl/meta-data';
import FnContext from './context';
/**
 * 通过客户端提交的header取值转换为当前请求的header
 * 注意：前端请求的header键值已经被转换为小写，所以在取值时注意要用小写，且'-'被替换为'_'
 * @param customHeaders
 * @returns
 */
function getHeaderFromClient(customHeaders: any, ctx: FnContext) {
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

export default async function HttpRunner(ctx: FnContext, item: LogicItem) {
  try {
    const data = await functions['js'](ctx, item.body ?? ''); //getByJsTplString(item.parameter, ctx);
    let customHeaders = await functions['js'](ctx, item.headers ?? ''); // getHeaderFromClient(item.headers, ctx); //{ ...step.headers };
    let method = item.method ?? 'post';
    let url = await functions['js'](ctx, item.url ?? ''); //getByJsTplString(item.url, ctx);
    url = encodeURI(url);
    return axios.request({
      url,
      method,
      headers: customHeaders,
      data,
      withCredentials: true,
      timeout: item.timeout ?? 50000
    }).then(res => res.data)
  } catch (err) {
    // ctx.flow?.warn('http-runner error');
    // await ctx.flow?.hanleError(err);
    console.log('http-err');
    console.log(err);
    return err;
  }
}
