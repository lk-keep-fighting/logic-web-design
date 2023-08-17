import axios, { Axios } from 'axios';
import { Step, StepFlow } from '../../core/definition/StepFlow';
import FlowRunner from './flow-runner';
/*
上下文，包含入参变量_input、全局变量_data
统一异常处理函数handleError(msg,isContinue?=false)
*/
type IContextOptions = {
  input?: any;
  http?: Axios;
  dsl?: StepFlow
};
export default class Context {
  [key: string]: any;
  dsl?: StepFlow;
  emit: any = undefined;
  input: any;
  //自定义全局变量
  data: any = {};
  flow?: FlowRunner;
  curStep?: Step;
  lastRet: any;
  isContinue: boolean = true;
  http: Axios;
  err: any;
  constructor(opts: IContextOptions) {
    this._init(opts);
    this.http = opts.http ?? axios;
    this.dsl = opts.dsl;
  }
  _init(opts: any = {}) {
    const { input = {} } = opts;
    this.input = Object.freeze({ ...input });
  }

  _transitTo(curStep: Step, lastRet: any) {
    this.curStep = curStep;
    this.lastRet = lastRet;
  }

  //   /*
  // * 设置全局变量
  // */
  //   setData(name, value) {
  //     Object.keys(this.data).forEach((key) => {
  //       if (key == name) {
  //         this.data[key] = value
  //       }
  //     });
  //   }
}
