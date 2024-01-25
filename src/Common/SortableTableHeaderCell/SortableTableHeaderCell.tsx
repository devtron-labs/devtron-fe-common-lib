import { ReactComponent as SortIcon } from '../../Assets/Icon/ic-arrow-up-down.svg'
import { ReactComponent as SortArrowDown } from '../../Assets/Icon/ic-sort-arrow-down.svg'
import { SortingOrder } from '../Constants'
import { SortableTableHeaderCellProps } from './types'

/**
 * Reusable component for the table header cell with support for sorting icons
 *
 * @example Usage
 * ```tsx
 * <SortableTableHeaderCell
 *   isSorted={currentSortedCell === 'cell'}
 *   triggerSorting={() => {}}
 *   sortOrder={SortingOrder.ASC}
 *   title="Header Cell"
 *   disabled={isDisabled}
 * />
 * ```
 */
const SortableTableHeaderCell = ({
    isSorted,
    triggerSorting,
    sortOrder,
    title,
    disabled,
}: SortableTableHeaderCellProps) => (
    <button
        type="button"
        className="dc__transparent p-0 bcn-0 cn-7 flex dc__content-start dc__gap-4 cursor"
        onClick={triggerSorting}
        disabled={disabled}
    >
        <span className="dc__uppercase dc__ellipsis-right">{title}</span>
        {isSorted ? (
            <SortArrowDown
                className={`icon-dim-12 mw-12 scn-7 ${sortOrder === SortingOrder.DESC ? 'dc__flip-180' : ''}`}
            />
        ) : (
            <SortIcon className="icon-dim-12 mw-12 scn-7" />
        )}
    </button>
)

export default SortableTableHeaderCell
