import { Step } from '.';
import { Param, Return, Variable } from '../lasl/meta-data';
/**
 * 一个流程完整的配置文件
 */
export class StepFlow {
  /**
   * 配置文件格式版本号,默认0.1
   */
  schemeVersion?: string;
  /**
   * 配置文件值的版本管理，推荐时间戳yyMMdd-HHmmss
   */
  version?: string = '0.1';
  /**
   * 入参
   */
  params?: Array<Param>;
  /**
   * 返回参数
   */
  returns?: Array<Return>;
  /**
   * 局部变量
   */
  variables?: Array<Variable>;
  /**
   * 环境配置
   */
  env?: Array<Param>;
  /**
   * api流程所有步骤配置，平铺无嵌套，通过nextStepId关联流转
   */
  steps: Array<Step> = [];
  /**
   * 可视化配置，用于保存流程图显示的额外配置
   */
  visualConfig?: any;
  /**
   * 流程图名称
   */
  name?: string;
}
