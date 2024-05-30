import { SortingOrder } from '../Constants'

export interface SortableTableHeaderCellProps {
    /**
     * If true, the cell is sorted
     */
    isSorted: boolean
    /**
     * Callback for handling the sorting of the cell
     */
    triggerSorting: () => void
    /**
     * Current sort order
     *
     * Note: On click, the sort order should be updated as required
     */
    sortOrder: SortingOrder
    /**
     * Label for the cell
     */
    title: string
    /**
     * If true, the cell is disabled
     */
    disabled: boolean
    /**
     * If false, the cell acts like normal table header cell
     * @default true
     */
    isSortable?: boolean
}
