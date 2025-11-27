// 逻辑流业务模块类型定义

// 调试日志相关类型
export interface ItemLog {
  name: string;
  beginTime: Date;
  endTime: Date;
  duration: number;
  paramsJson: object;
  config: any;
  success?: boolean;
  msg?: string;
  returnData?: any;
  configInstance?: any;
}

export interface DebugLog {
  success: boolean;
  serverTime: string;
  msg: string;
  itemLogs: ItemLog[];
  paramsJson: object;
  version: string;
  varsJson?: object;
  varsJsonEnd?: object;
  id?: string;
}

// 编辑器上下文类型
export interface EditorCtx {
  logic: any;
}

// 图形扩展类型
export interface ShapeExtension {
  type: string;
  component: React.ComponentType;
  config: any;
}

// 面板数据类型
export interface PanelNode {
  id: string;
  name: string;
  type: string;
  icon?: string;
  config?: any;
}

export interface PanelGroup {
  name: string;
  title: string;
  graphHeight?: number;
  nodes?: PanelNode[];
}

export interface PanelData {
  Nodes: PanelNode[];
  Groups: PanelGroup[];
}

// 逻辑流配置类型
export interface LogicFlowConfig {
  name: string;
  version: string;
  params?: any[];
  returns?: any[];
  variables?: any[];
  envs?: any[];
  log?: any;
  visualConfig?: any;
  items?: any[];
}
