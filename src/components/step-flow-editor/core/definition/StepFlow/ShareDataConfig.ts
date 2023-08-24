import { DataTypeEnum } from "./DataTypeEnum";

/**
 * 共享变量配置
 */
export class ShareDataConfig {
    name: string;
    /**
     * 变量描述 
     */
    describe: string;
    type: DataTypeEnum = DataTypeEnum.string;
    value: any;
    fromJsonPath: any;
}
