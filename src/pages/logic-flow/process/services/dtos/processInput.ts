/**
 * ProcessInput
 */
export interface ProcessInput {
    /**
     * 客户料号
     */
    customerCode?: null | string;
    /**
     * 删除状态标识
     */
    deleted?: boolean | null;
    /**
     * 图数据
     */
    graphData?: null | string;
    /**
     * 主键
     */
    id?: number | null;
    /**
     * 物料类型
     */
    materialType?: null | string;
    /**
     * 产品编码
     */
    productCode?: null | string;
    /**
     * 产品型号
     */
    productModel?: null | string;
    /**
     * 产品名称
     */
    productName?: null | string;
    /**
     * 工艺类型
     */
    productRouteType?: null | string;
    /**
     * 工艺设计详情集合
     */
    routeProductDetailList?: RouteProductDetailVo[] | null;
    /**
     * 当前状态
     */
    status?: null | string;
    /**
     * 版本号
     */
    version?: null | string;
    [property: string]: any;
}

/**
 * asm.standard.route.model.vo.RouteProductDetailVo
 *
 * RouteProductDetailVo
 */
export interface RouteProductDetailVo {
    /**
     * 创建时间
     */
    createTime?: null | string;
    /**
     * 创建者
     */
    createUser?: null | string;
    /**
     * 客户料号
     */
    customerCode?: null | string;
    /**
     * 删除状态标识
     */
    deleted?: boolean | null;
    /**
     * 扩展属性json文本
     */
    extraProperties?: null | string;
    /**
     * 起始工序编码
     */
    fromNode?: null | string;
    /**
     * 起始工序名称
     */
    fromNodeName?: null | string;
    /**
     * 起始工序类型
     */
    fromNodeType?: null | string;
    /**
     * 主键
     */
    id?: number | null;
    /**
     * 投入产出比
     */
    inputOutputRatio?: null | string;
    /**
     * 产品编码
     */
    productCode?: null | string;
    /**
     * 产品名称
     */
    productName?: null | string;
    /**
     * 工艺明细
     */
    routeDetailDto?: RouteDetailDto;
    /**
     * 工艺路线类型
     */
    routeType?: null | string;
    /**
     * 目标工序编码
     */
    toNode?: null | string;
    /**
     * 目标工序名称
     */
    toNodeName?: null | string;
    /**
     * 目标工序类型
     */
    toNodeType?: null | string;
    /**
     * 修改时间
     */
    updateTime?: null | string;
    /**
     * 修改者
     */
    updateUser?: null | string;
    /**
     * 版本号
     */
    version?: null | string;
    [property: string]: any;
}

/**
 * 工艺明细
 *
 * RouteDetailDto
 */
export interface RouteDetailDto {
    /**
     * BOM单位
     */
    bomUnit?: null | string;
    /**
     * 工装
     */
    frock?: Frock[] | null;
    /**
     * 是否末检
     */
    isFinalCheck?: boolean | null;
    /**
     * 是否首检
     */
    isFirstCheck?: boolean | null;
    /**
     * 调机时长
     */
    machineCheckNum?: number | null;
    /**
     * 后置时间
     */
    materialWaitNum?: number | null;
    /**
     * 单位生产总量
     */
    productNum?: null | string;
    /**
     * 每X生产时间
     */
    productTime?: number | null;
    /**
     * 每X生产时间单位
     */
    productTimeUnit?: null | string;
    /**
     * 保质期
     */
    qualityData?: number | null;
    /**
     * 巡检单位数
     */
    repeatCheckNum?: number | null;
    /**
     * 巡检单位（0小时/1件）
     */
    repeatCheckUnit?: null | string;
    /**
     * 返工工序
     */
    rework?: ReturnWork[] | null;
    /**
     * SOP访问地址
     */
    sopAddress?: null | string;
    /**
     * 点检单位数
     */
    tpmCheckNum?: number | null;
    /**
     * 点检单位（0小时/1件）
     */
    tpmCheckUnit?: null | string;
    /**
     * 工作中心
     */
    workCenters?: WorkCenter[] | null;
    [property: string]: any;
}

/**
 * Frock
 */
export interface Frock {
    /**
     * 工装型号编码
     */
    modelCode?: null | string;
    /**
     * 工装型号名称
     */
    modelName?: null | string;
    /**
     * 工装类型编码
     */
    typeCode?: null | string;
    /**
     * 工装类型名称
     */
    typeName?: null | string;
    [property: string]: any;
}

/**
 * ReturnWork
 */
export interface ReturnWork {
    /**
     * 分支流
     */
    branch?: null | string;
    /**
     * 当前工序编码
     */
    endRouteSn?: number | null;
    /**
     * 起始工序编码
     */
    startRouteSn?: number | null;
    [property: string]: any;
}

/**
 * WorkCenter
 */
export interface WorkCenter {
    /**
     * 工作中心编码
     */
    workCenterCode?: null | string;
    /**
     * 工作中心名称
     */
    workCenterName?: null | string;
    [property: string]: any;
}
