import { BulkSelectionDropdownItemsProps } from './types'

const BulkSelectionDropdownItems = <T,>({
    locator,
    label,
    isSelected,
    handleBulkSelection,
    icon: Icon,
}: BulkSelectionDropdownItemsProps<T>) => {
    const handleSelect = () => {
        handleBulkSelection({
            action: locator,
        })
    }

    return (
        <button
            data-testid={`bulk-action-${locator}`}
            onClick={handleSelect}
            className={`dc__no-border dc__outline-none-imp w-100 flexbox h-32 dc__align-items-center pt-6 pr-8 pb-6 pl-8 dc__gap-8 ${
                isSelected
                    ? 'cb-5 bcb-1 icon-stroke-b5 fs-13 fw-6 lh-20'
                    : 'dc__no-background cn-9 fs-13 fw-4 lh-20 dc__hover-n50'
            }`}
            type="button"
        >
            <Icon className="icon-dim-16" />
            {label}
        </button>
    )
}

export default BulkSelectionDropdownItems
