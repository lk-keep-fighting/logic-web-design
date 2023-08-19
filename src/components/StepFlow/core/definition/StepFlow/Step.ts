import { ShareDataConfig, StepTypeEnum } from '.';

/**
 * 单步骤节点配置
 */
export class Step {
  id: string = '';
  name?: string;
  describe?: string;
  type: StepTypeEnum = StepTypeEnum.js;
  return?: string;//节点值存储的变量
  // shareData?: Array<ShareDataConfig>;
  // while结束节点
  endStepId?: string;
  nextStepId?: string;
  // 普通节点的超时时间，wait节点的等待时间
  timeout?: number;
  branches?: Array<Branch>;
}
export class SwitchStep extends Step {
  type: StepTypeEnum = StepTypeEnum.switch;
  condition?: string;
}
export class JsStep extends Step {
  script?: string;
}
export class HttpStep extends Step {
  url?: string;
  method?: string;
  headers?: string;
  query?: string;
  body?: string;
  // @ApiProperty({ name: '请求适配器' })
  // reqAdaptor: string;
  // @ApiProperty({ name: '接收适配器' })
  // resAdaptor: string;
}
export class BranchStep extends Step {
  condition?: string;
  branches?: Array<Branch>;
}
/**
 * 分支属性
 */
export class Branch {
  when: string = '';
  nextStepId: string = '';
}


export type ProcessStep = Step & {
  /**
   * 子流程名称
   */
  subProcessName: string
}
