import { SortingOrder } from '../Constants'

export interface SortableTableHeaderCellProps {
    isSorted: boolean
    triggerSorting: () => void
    sortOrder: SortingOrder
    title: string
    disabled: boolean
}
