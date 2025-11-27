// IDE API服务
import { getLogic, runLogicOnServer, saveLogic, getLogicByBak } from "@/services/ideSvc";
import { getPanelData } from "../panelSvc";
import { RuntimeSvc } from "@/services/runtimeSvc";

/**
 * IDE API服务类
 */
export class IdeApiService {
  /**
   * 获取逻辑配置
   */
  async getLogic(id: string) {
    return getLogic(id);
  }

  /**
   * 运行逻辑
   */
  async runLogicOnServer(
    id: string,
    params: any,
    bizId?: string,
    bizStartCode?: string,
    model?: string,
    headers?: any,
    configModel?: string
  ) {
    return runLogicOnServer(id, params, bizId, bizStartCode, model, headers, configModel);
  }

  /**
   * 保存逻辑
   */
  async saveLogic(id: string, version: string, config: string) {
    return saveLogic(id, version, config);
  }

  /**
   * 获取历史逻辑
   */
  async getLogicByBak(id: string, version?: string) {
    return getLogicByBak(id, version);
  }

  /**
   * 获取面板数据
   */
  async getPanelData() {
    return getPanelData();
  }

  /**
   * 获取运行时环境
   */
  async getRuntimeEnv() {
    return RuntimeSvc.getEnvJson();
  }
}

// 导出单例实例
export const ideApiService = new IdeApiService();
