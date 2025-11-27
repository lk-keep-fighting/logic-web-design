// 版本管理工具
import dayjs from "dayjs";

/**
 * 生成新版本号
 */
export function generateNewVersion(): string {
  return dayjs(Date.now()).format('YYYYMMDDHHmmss');
}

/**
 * 比较版本号
 */
export function compareVersions(version1: string, version2: string): number {
  if (version1 === version2) return 0;
  
  const v1 = parseInt(version1.replace(/\D/g, ''), 10);
  const v2 = parseInt(version2.replace(/\D/g, ''), 10);
  
  if (v1 > v2) return 1;
  if (v1 < v2) return -1;
  return 0;
}

/**
 * 检查版本是否一致
 */
export function isVersionMatch(localVersion: string, serverVersion: string): boolean {
  return localVersion === serverVersion;
}
