import { ChartColorKey } from '@Shared/Components/Charts/types'

export enum ProdNonProdSelectValueTypes {
    ALL = 'All',
    PRODUCTION = 'Prod',
    NON_PRODUCTION = 'Non-Prod',
}

export enum RelativeTimeWindow {
    LAST_7_DAYS = 'last7Days',
    LAST_30_DAYS = 'last30Days',
    LAST_90_DAYS = 'last90Days',
}

export interface ChartTooltipProps {
    title?: string
    label: string
    value: string | number
    chartColorKey: ChartColorKey
}

export enum TIME_WINDOW {
    TODAY = 'today',
    THIS_WEEK = 'week',
    THIS_MONTH = 'month',
    THIS_QUARTER = 'quarter',
    LAST_WEEK = 'lastWeek',
    LAST_MONTH = 'lastMonth',
}
