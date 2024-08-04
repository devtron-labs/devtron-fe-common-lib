import { SortingOrder } from '@Common/Constants'

export enum SortBy {
    SEVERITY = 'severity',
    PACKAGE = 'package',
}

export interface SortConfig {
    sortBy: SortBy
    sortOrder: SortingOrder
}
