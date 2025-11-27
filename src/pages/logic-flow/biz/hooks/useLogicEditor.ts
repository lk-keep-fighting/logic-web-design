// 逻辑编辑器自定义Hook
import { useCallback, useEffect } from 'react';
import { TypeAnnotationParser } from '@/components/lib/dsl/parser/type-annotation-parser';
import { appendStartNode } from '@/components/logic-editor/settings/GraphDataHelper';
import { LogicToGraph } from '@/components/lib/dsl/parser/logic-parser';
import { autoDagreLayout } from '../layout/dagreLayout';
import { ideApiService } from '../services/api/ideApi';
import { BizDslConvert } from '../services/dsl/dslConvert';
import { generateNewVersion, isVersionMatch } from '../utils/versionUtils';
import { useLogicEditor as useLogicEditorContext } from '../context/LogicEditorContext';

/**
 * 逻辑编辑器Hook
 */
export function useLogicEditor(logicId: string) {
  const { state, dispatch } = useLogicEditorContext();
  const dslConvert = new BizDslConvert();

  // 更新Web标题
  const refreshWebTitle = useCallback((dsl: any) => {
    if (dsl?.name) {
      window.document.title = `[${dsl.name}]:${dsl.version}`;
    }
  }, []);

  // 保存DSL到服务器
  const saveDslToServer = useCallback(async (newDsl: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await ideApiService.saveLogic(
        logicId,
        newDsl.version,
        JSON.stringify(newDsl)
      );
      
      if (res.status === 200) {
        return true;
      } else {
        throw new Error(`保存失败：${res.statusText}`);
      }
    } catch (error) {
      console.error('保存DSL失败:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [logicId, dispatch]);

  // 处理保存逻辑
  const handleSave = useCallback(async (graph: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // 检查版本一致性
      const serverLogic = await ideApiService.getLogic(logicId);
      if (serverLogic.version && serverLogic.version !== state.dsl.version) {
        throw new Error(`本地版本与服务器[${serverLogic.version}]不一致，无法保存！`);
      }

      // 转换并保存
      const newDsl = dslConvert.graphToLogicItems(graph, state.dsl);
      newDsl.version = generateNewVersion();
      
      await saveDslToServer(newDsl);
      dispatch({ type: 'SET_DSL', payload: newDsl });
      refreshWebTitle(newDsl);
      
      return true;
    } catch (error) {
      console.error('保存逻辑失败:', error);
      throw error;
    }
  }, [logicId, state.dsl, saveDslToServer, refreshWebTitle, dispatch]);

  // 更新编辑器上下文
  const updateEditorCtx = useCallback(async (dsl: any) => {
    try {
      const jsTips: any = {};
      jsTips['_par'] = JSON.stringify(TypeAnnotationParser.getJsonByParams(dsl.params));
      const _varJson = TypeAnnotationParser.getJsonByParams(dsl.variables);
      jsTips['_var'] = JSON.stringify(_varJson);
      jsTips['_global'] = JSON.stringify(_varJson.__global ?? '{}');
      
      const runtimeEnv = await ideApiService.getRuntimeEnv();
      dispatch({ type: 'SET_ENV', payload: runtimeEnv });
      
      jsTips['_env'] = JSON.stringify(runtimeEnv);
      jsTips['_bizId'] = '""';
      jsTips['_lastRet'] = '{}';
      jsTips['_last'] = JSON.stringify({ success: true, msg: '', data: {} });
      
      dispatch({ type: 'SET_JS_TIP_MAP', payload: new Map(Object.entries(jsTips)) });
    } catch (error) {
      console.error('更新编辑器上下文失败:', error);
    }
  }, [dispatch]);

  // 查询并加载逻辑
  const queryAndLoadLogic = useCallback(async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await ideApiService.getLogic(id);
      
      const configJson = res.configJson || res;
      configJson.id = id;
      configJson.name = res.name || configJson.name;
      
      dispatch({ type: 'SET_DSL', payload: configJson });
      dispatch({ type: 'SET_GRAPH_JSON', payload: configJson.visualConfig });
      
      await updateEditorCtx(configJson);
      refreshWebTitle(configJson);
    } catch (error) {
      console.error('加载逻辑失败:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [updateEditorCtx, refreshWebTitle, dispatch]);

  // 保存参数配置
  const saveFlowSettingAndConvertGraphToDsl = useCallback(async (settingValues: any) => {
    try {
      const jsTips: any = {};
      jsTips['_par'] = settingValues.params;
      jsTips['_var'] = settingValues.variables;
      jsTips['_global'] = settingValues.variables.__global ?? '{}';
      
      const newJsTipMap = new Map([...state.jsTipMap, ...Object.entries(jsTips)]);
      dispatch({ type: 'SET_JS_TIP_MAP', payload: newJsTipMap });
      
      // 解析参数和返回值
      const params = TypeAnnotationParser.getParamArrayByJson(
        JSON.parse(settingValues.params ?? '{}')
      );
      const returns = TypeAnnotationParser.getReturnArrayByJson(
        JSON.parse(settingValues.returns ?? '{}')
      );
      const variables = TypeAnnotationParser.getVariableArrayByJson(
        JSON.parse(settingValues.variables ?? '{}')
      );
      const envs = TypeAnnotationParser.getEnvsArrayByJson(
        JSON.parse(settingValues.envs ?? '{}')
      );
      
      dispatch({ type: 'SET_ENV', payload: envs });
      
      // 更新DSL
      const newDsl = {
        ...state.dsl,
        params,
        returns,
        variables,
        envs,
        log: settingValues.log,
        version: generateNewVersion()
      };
      
      await saveDslToServer(newDsl);
      dispatch({ type: 'SET_DSL', payload: newDsl });
    } catch (error) {
      console.error('保存参数配置失败:', error);
      throw error;
    }
  }, [state.jsTipMap, state.dsl, saveDslToServer, dispatch]);

  // 导入逻辑JSON
  const handleImportLogicJson = useCallback((json: string, graph: any) => {
    try {
      const res = LogicToGraph(JSON.parse(json));
      dispatch({ type: 'SET_GRAPH_JSON', payload: res });
      
      // 延迟执行自动布局，确保图形已渲染
      setTimeout(() => {
        autoDagreLayout(graph);
      }, 500);
    } catch (error) {
      console.error('导入逻辑JSON失败:', error);
      throw error;
    }
  }, [dispatch]);

  // 初始化逻辑
  useEffect(() => {
    if (logicId) {
      queryAndLoadLogic(logicId);
    }
  }, [logicId, queryAndLoadLogic]);

  return {
    state,
    dispatch,
    handleSave,
    saveFlowSettingAndConvertGraphToDsl,
    handleImportLogicJson,
    queryAndLoadLogic,
    appendStartNode,
    autoDagreLayout
  };
}
