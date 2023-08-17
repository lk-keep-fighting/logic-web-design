import { isAxiosError } from 'axios';
import EventEmitter from 'eventemitter3';
import { Step, StepFlow, StepTypeEnum } from '../../core/definition/StepFlow';
import Context from './context';
import StepRuntime from './step-runners';
import { getByJsTplString, runJsExpress } from './tool';
import { ProcessStep } from '../../core/definition/StepFlow/Step';

const LIFECYCLE = new Set(['ctxCreated', 'enterNode', 'leaveNode']);
const SHAPES = {
  START: 'start',
  BRANCH: 'branch',
  BEHAVIOR: 'js',
};

type FlowRunnerProps = {
  dsl?: StepFlow;
  /**
   * 通过名称获取dsl的函数，通常由调用方提供，如果使用了子流程，会通过此函数获取子流程的配置
   */
  getDslByName?: any;
}
export default class FlowRunner extends EventEmitter {
  /**
   * 通过名称获取dsl的函数，通常由调用方提供，如果使用了子流程，会通过此函数获取子流程的配置
   */
  getDslByName?: (name: string) => Promise<StepFlow>;
  _unsafeCtx: Context;
  constructor(opts?: FlowRunnerProps) {
    super();
    this._unsafeCtx = this._createCtx({ dsl: opts?.dsl })
    this.getDslByName = opts?.getDslByName;
  }

  steps(ctx: Context) {
    return ctx.dsl?.steps;
  }

  _runLifecycleEvent(eventName: string, ctx: Context) {
    // if (!LIFECYCLE.has(eventName)) {
    //   return this._warn(`Lifecycle ${eventName} is not supported!`);
    // }
    // }
  }

  log(data: any, lv = '0') {
    let type = typeof data === 'string' ? 'info' : 'json';
    type = data instanceof Error ? 'err' : type;
    type = isAxiosError(data) ? 'axioError' : type;
    this.emit('log', { data, type });
    console.log(data);
  }
  warn(data: any, lv = '1') {
    this.log(data, lv);
  }

  _createCtx(opts: { input?: any, dsl?: StepFlow }) {
    const ctx = new Context({ ...opts });
    ctx.flow = this;
    ctx.emit = this.emit.bind(this);
    this._runLifecycleEvent('ctxCreated', ctx);
    return ctx;
  }

  _getStartStep(ctx: Context) {
    return this.steps(ctx)?.find((s) => s.type === SHAPES.START);
  }

  async _findNextNodes(ctx: Context, curStep: Step) {
    if ([StepTypeEnum.switch].indexOf(curStep.type) > -1) {
      let con: any = undefined;
      if (curStep.condition) con = await runJsExpress(curStep.condition, ctx);
      const branch = curStep.branches?.find((b) => b.when.toString() == con);
      if (branch === undefined) {
        this.log(`条件[${con}]未命中任何下级`);
        return [];
      } else {
        this.log(`条件[${con}]命中了下级`);
        this.log(branch);
        return [branch];
      }
    } else {
      let nxtId = curStep.nextStepId;
      let nextStep = this.steps(ctx)?.find((i) => i.id === curStep.nextStepId);
      if (!nextStep) {
        this.log('||未找到下级节点:' + nxtId);
        return [];
      }
      if (nextStep.type === StepTypeEnum.parallelEnd) {
        this.log('--分支结束');
        return [];
      }
      if (nextStep.type === StepTypeEnum.end) {
        this.log('||下一个为结束节点:');
        return [];
      }
      this.log(`下一个节点:${nextStep.type}:${nextStep.name}`);
      return [nextStep];
    }
  }
  async _execNextSteps(
    ctx: Context,
    curStep: Step,
    lastRet: any,
    callback: any,
  ) {
    const nextSteps = await this._findNextNodes(ctx, curStep);
    if (nextSteps.length > 0 && ctx.isContinue) {
      nextSteps.forEach(async (nxt: any) => {
        await this._execStep(ctx, nxt, lastRet, callback);
      });
    } else {
      this.log('--------执行结束--------');
      if (callback) callback(lastRet);
    }
  }
  async _execStep(ctx: Context, curStep: Step, lastRet: any, callback: any) {
    try {
      if (curStep.type) {
        this.log(`正在执行:${curStep.type}:${curStep.name}`);
        this.log(curStep);
      }
      ctx._transitTo(curStep, lastRet);
      this._runLifecycleEvent('enterNode', ctx);
      let curRet: any;
      switch (curStep.type) {
        case StepTypeEnum.js:
        case StepTypeEnum.http:
          ctx.lastRet = lastRet;
          curRet = await StepRuntime[curStep.type](ctx, curStep);
          this.log('返回值：');
          this.log(curRet);
          this._runLifecycleEvent('leaveNode', ctx);
          await this._execNextSteps(ctx, curStep, curRet, callback);
          break;
        case StepTypeEnum.wait:
          setTimeout(() => {
            this._execNextSteps(ctx, curStep, lastRet, callback);
          }, curStep.timeout || 2000);
          break;
        case StepTypeEnum.process:
          let processSteps: StepFlow = { steps: [] };
          const procStep = curStep as ProcessStep;
          if (procStep.subProcessName && this.getDslByName) {
            processSteps = await this.getDslByName(procStep.subProcessName);
            console.log('process获取到配置如下：')
            console.log(processSteps)
          }
          else {
            console.log(curStep);
            throw 'process参数有误'
          }
          var _proc = new FlowRunner({ getDslByName: this.getDslByName })
          var _pCtx = _proc._createCtx({ dsl: processSteps })
          var _p = ctx.data;
          if (procStep.parameter)
            _p = getByJsTplString(procStep.parameter, ctx);

          console.log('process入参：')
          console.log(_p);
          _proc.invoke(_p, async (ret: any) => {
            await this._execNextSteps(ctx, curStep, ret, callback);
          }, _pCtx);
          break;
        case StepTypeEnum.start:
          if (ctx) ctx.data = JSON.parse(curStep.data);
          await this._execNextSteps(ctx, curStep, lastRet, callback);
          break;
        default:
          await this._execNextSteps(ctx, curStep, lastRet, callback);
          break;
      }
    } catch (err) {
      this.warn('execStep异常 ');
      await this.hanleError(err);
    }
  }
  async send(msg: string, args: any) {
    this.emit(msg, args);
  }
  init(dsl: StepFlow) {
    this._unsafeCtx.dsl = dsl;
  }
  async invoke(input: any, callback: any, ctx?: Context) {
    ctx = ctx || this._unsafeCtx;
    const startStep = this._getStartStep(ctx);
    if (!startStep) {
      return Promise.reject('未发现开始节点');
    }
    ctx.input = input;
    console.log('开始执行，上下文如下：');
    console.log(ctx)
    await this._execStep(ctx, startStep, undefined, callback);
  }
  //统一处理catch到的异常
  async hanleError(err: any, isContinue: boolean = false) {
    if (this._unsafeCtx) this._unsafeCtx.isContinue = isContinue;
    // this._warn('发生异常');
    this.warn(err);
    if (this._unsafeCtx) this._unsafeCtx.err = err;
    const ret = await StepRuntime[StepTypeEnum.errorHandler](
      this._unsafeCtx || new Context({}),
      this._unsafeCtx?.curStep,
    );
  }
}
