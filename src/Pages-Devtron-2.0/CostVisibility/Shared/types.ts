export enum CostBreakdownViewType {
    CLUSTERS = 'clusters',
    ENVIRONMENTS = 'environments',
    PROJECTS = 'projects',
    APPLICATIONS = 'applications',
}

export enum CostBreakdownItemViewParamsType {
    ITEM_NAME = 'itemName',
    VIEW = 'view',
    DETAIL = 'detail',
}

type TrendSignType = '+' | '-'
export type CostTrendType = '0' | `${TrendSignType}${number}`

export enum CostBreakdownSubComponents {
    MEMORY = 'memory',
    CPU = 'cpu',
    STORAGE = 'storage',
    GPU = 'gpu',
}
