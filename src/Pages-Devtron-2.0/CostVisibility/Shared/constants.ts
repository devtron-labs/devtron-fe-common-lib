import { ChartColorKey } from '@Shared/Components'

import { CostBreakdownSubComponents } from './types'

export const COST_BREAKDOWN_SUB_COMPONENTS_TITLE: Record<CostBreakdownSubComponents, string> = {
    [CostBreakdownSubComponents.CPU]: 'CPU Cost',
    [CostBreakdownSubComponents.MEMORY]: 'Memory Cost',
    [CostBreakdownSubComponents.GPU]: 'GPU Cost',
    [CostBreakdownSubComponents.STORAGE]: 'Storage Cost',
}

export const COST_BREAKDOWN_SUB_COMPONENTS_CHART_COLORS: Record<CostBreakdownSubComponents, ChartColorKey> = {
    [CostBreakdownSubComponents.CPU]: 'AquaTeal400',
    [CostBreakdownSubComponents.MEMORY]: 'DeepPlum300',
    [CostBreakdownSubComponents.GPU]: 'Lavender400',
    [CostBreakdownSubComponents.STORAGE]: 'SkyBlue400',
}
