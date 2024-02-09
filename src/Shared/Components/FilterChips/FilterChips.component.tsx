import { ReactComponent as CloseIcon } from '../../../Assets/Icon/ic-close.svg'
import { noop } from '../../../Common'
import { FilterChipProps, FilterChipsProps } from './types'

const FilterChip = ({
    label,
    value,
    handleRemoveFilter,
    getFormattedLabel = noop,
    getFormattedValue = noop,
}: FilterChipProps) => {
    const removeFilter = () => {
        handleRemoveFilter(label, value)
    }

    const labelToDisplay = getFormattedLabel(label) ?? label

    const valueToDisplay = getFormattedValue(label, value) ?? value

    return (
        <div className="flexbox flex-align-center br-4 dc__border dc__bg-n50 pl-6 pr-6 pt-2 pb-2 dc__user-select-none h-24 dc__gap-6 fs-12 lh-20 cn-9 fw-4">
            <span className="fw-6 dc__capitalize">{labelToDisplay}</span>
            <span className="dc__divider h-24" />
            <span className="dc__ellipsis-right">{valueToDisplay}</span>
            <button
                type="button"
                className="flex p-0 dc__transparent"
                onClick={removeFilter}
                aria-label="Remove filter"
            >
                <CloseIcon className="icon-dim-12 icon-use-fill-n6" />
            </button>
        </div>
    )
}

/**
 * Component for rendering the applied filter chips
 */
const FilterChips = ({
    filterConfig,
    clearFilters,
    onRemoveFilter,
    getFormattedLabel,
    getFormattedValue,
}: FilterChipsProps) => {
    const handleRemoveFilter = (filterKey, valueToRemove) => {
        const updatedFilterConfig = JSON.parse(JSON.stringify(filterConfig))
        if (Array.isArray(filterConfig[filterKey])) {
            onRemoveFilter({
                ...updatedFilterConfig,
                [filterKey]: updatedFilterConfig[filterKey].filter((val) => val !== valueToRemove),
            })
            return
        }
        if (filterKey in updatedFilterConfig) {
            delete updatedFilterConfig[filterKey]
            onRemoveFilter(updatedFilterConfig)
        }
    }

    const chips = Object.entries(filterConfig).filter(([, value]) => (Array.isArray(value) ? value.length : !!value))

    return (
        chips.length > 0 && (
            <div className="flexbox pt-6 pb-6 flex-wrap dc__gap-8">
                {chips.map(([filterKey, filterValue]) =>
                    Array.isArray(filterValue) ? (
                        filterValue.map((filter) => (
                            <FilterChip
                                key={`${filterKey}-${filter}`}
                                label={filterKey}
                                value={filter}
                                handleRemoveFilter={handleRemoveFilter}
                                getFormattedLabel={getFormattedLabel}
                                getFormattedValue={getFormattedValue}
                            />
                        ))
                    ) : (
                        <FilterChip
                            key={filterKey}
                            label={filterKey}
                            value={filterValue}
                            handleRemoveFilter={handleRemoveFilter}
                            getFormattedLabel={getFormattedLabel}
                            getFormattedValue={getFormattedValue}
                        />
                    ),
                )}
                <div className="flex">
                    <button type="button" className="cta text fs-13 lh-20-imp h-20 p-0-imp" onClick={clearFilters}>
                        Clear All Filters
                    </button>
                </div>
            </div>
        )
    )
}

export default FilterChips
