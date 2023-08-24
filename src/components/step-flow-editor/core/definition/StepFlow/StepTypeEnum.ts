/**
 * 流程节点类型
 */
export enum StepTypeEnum {
  /**
   * 开始节点
   */
  start = 'start',
  /**
   * 结束节点
   */
  end = 'end',
  http = 'http',
  /*
  *  等待节点
  */
  wait = 'wait',
  js = 'js',
  /**
   * 并行执行
   */
  parallel = 'parallel',
  parallelEnd = 'parallel-end',
  /**
   * 老条件分支，用switch代替
   */
  branch = 'branch',
  /**
   * 条件分支
   */
  switch = 'switch',
  /**
   * 条件分支2，ifelse模式，每个分支都是表达式
   */
  ifelse = 'ifelse',
  /**
   *  while循环
   */
  while = 'while',
  whileEnd = 'while-end',
  /**
   * 子流程
   */
  process = 'process',
  errorHandler = 'error-handler',
}
