import { CostTrendType } from './types'

export const parseCostTrendChange = (trend: CostTrendType): 'increase' | 'decrease' | 'no_change' => {
    if (!trend || typeof trend !== 'string') {
        return 'no_change'
    }

    return trend.startsWith('+') ? 'increase' : 'decrease'
}
