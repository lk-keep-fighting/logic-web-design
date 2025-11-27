// 逻辑编辑器上下文
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { LogicFlowConfig } from '../types';

// 状态类型
interface LogicEditorState {
  dsl: LogicFlowConfig;
  graphJson: any;
  jsTipMap: Map<string, object>;
  env: any;
  loading: boolean;
  showLeftPanel: boolean;
  lineStyle: '1' | '2';
}

// Action类型
type LogicEditorAction =
  | { type: 'SET_DSL'; payload: LogicFlowConfig }
  | { type: 'SET_GRAPH_JSON'; payload: any }
  | { type: 'SET_JS_TIP_MAP'; payload: Map<string, object> }
  | { type: 'SET_ENV'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_LEFT_PANEL' }
  | { type: 'SET_LINE_STYLE'; payload: '1' | '2' };

// 初始状态
const initialState: LogicEditorState = {
  dsl: { name: '', version: '' },
  graphJson: {},
  jsTipMap: new Map(),
  env: {},
  loading: false,
  showLeftPanel: true,
  lineStyle: '1',
};

// Reducer函数
function logicEditorReducer(state: LogicEditorState, action: LogicEditorAction): LogicEditorState {
  switch (action.type) {
    case 'SET_DSL':
      return { ...state, dsl: action.payload };
    case 'SET_GRAPH_JSON':
      return { ...state, graphJson: action.payload };
    case 'SET_JS_TIP_MAP':
      return { ...state, jsTipMap: action.payload };
    case 'SET_ENV':
      return { ...state, env: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'TOGGLE_LEFT_PANEL':
      return { ...state, showLeftPanel: !state.showLeftPanel };
    case 'SET_LINE_STYLE':
      return { ...state, lineStyle: action.payload };
    default:
      return state;
  }
}

// 创建上下文
interface LogicEditorContextType {
  state: LogicEditorState;
  dispatch: React.Dispatch<LogicEditorAction>;
}

const LogicEditorContext = createContext<LogicEditorContextType | undefined>(undefined);

// 上下文Provider组件
export function LogicEditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(logicEditorReducer, initialState);

  return (
    <LogicEditorContext.Provider value={{ state, dispatch }}>
      {children}
    </LogicEditorContext.Provider>
  );
}

// 自定义Hook，用于访问上下文
export function useLogicEditor() {
  const context = useContext(LogicEditorContext);
  if (context === undefined) {
    throw new Error('useLogicEditor must be used within a LogicEditorProvider');
  }
  return context;
}
