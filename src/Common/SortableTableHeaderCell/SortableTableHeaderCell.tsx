import { ReactComponent as SortIcon } from '../../Assets/Icon/ic-arrow-up-down.svg'
import { ReactComponent as SortArrowDown } from '../../Assets/Icon/ic-sort-arrow-down.svg'
import { SortingOrder } from '../Constants'
import { noop } from '../Helper'
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
    isSortable = true,
}: SortableTableHeaderCellProps) => {
    const renderSortIcon = () => {
        if (!isSortable) {
            return null
        }

        if (isSorted) {
            return (
                <SortArrowDown
                    className={`icon-dim-12 mw-12 scn-7 ${sortOrder === SortingOrder.DESC ? 'dc__flip-180' : ''}`}
                />
            )
        }

        return <SortIcon className="icon-dim-12 mw-12 scn-7" />
    }

    return (
        <button
            type="button"
            className="dc__transparent p-0 bcn-0 cn-7 flex dc__content-start dc__gap-4 dc__select-text"
            onClick={isSortable ? triggerSorting : noop}
            disabled={disabled}
        >
            <span className="dc__uppercase dc__ellipsis-right">{title}</span>
            {renderSortIcon()}
        </button>
    )
}

export default SortableTableHeaderCell
