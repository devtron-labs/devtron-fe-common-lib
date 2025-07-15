/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ComponentSizeType } from '@Shared/constants'

import { noop, Tooltip } from '../../../Common'
import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { Icon } from '../Icon'
import { FilterChipProps, FilterChipsProps } from './types'

import './styles.scss'

const FilterChip = ({
    label,
    value,
    handleRemoveFilter,
    getFormattedLabel = noop,
    getFormattedValue = noop,
    showRemoveIcon,
    shouldHideLabel = false,
}: FilterChipProps) => {
    const removeFilter = () => {
        handleRemoveFilter(label, value)
    }

    const labelToDisplay = getFormattedLabel(label) ?? label

    const valueToDisplay = getFormattedValue(label, value) ?? value

    return (
        (labelToDisplay || shouldHideLabel) &&
        valueToDisplay && (
            <div className="flexbox flex-align-center br-4 dc__border bg__secondary pl-6 dc__user-select-none h-24 dc__gap-6 fs-12 lh-20 cn-9 fw-4 dc__ellipsis-right">
                {!shouldHideLabel && (
                    <>
                        <span className="fw-6 dc__capitalize">{labelToDisplay}</span>
                        <span className="dc__divider h-24" />
                    </>
                )}
                <Tooltip content={valueToDisplay}>
                    <span className="dc__ellipsis-right dc__word-break dc__mxw-150">{valueToDisplay}</span>
                </Tooltip>
                {showRemoveIcon && (
                    <Button
                        variant={ButtonVariantType.borderLess}
                        style={ButtonStyleType.negativeGrey}
                        dataTestId="filter-chip__remove-btn"
                        showAriaLabelInTippy={false}
                        ariaLabel="Remove filter"
                        icon={<Icon name="ic-close-small" color={null} />}
                        size={ComponentSizeType.xs}
                        onClick={removeFilter}
                    />
                )}
            </div>
        )
    )
}

/**
 * Component for rendering the applied filter chips
 */
const FilterChips = <T = Record<string, unknown>,>({
    filterConfig,
    clearFilters,
    onRemoveFilter,
    getFormattedLabel,
    getFormattedValue,
    className = '',
    clearButtonClassName = '',
    showClearAndRemove = true,
    shouldHideLabel,
}: FilterChipsProps<T>) => {
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
            <div className={`flexbox pt-6 pb-6 flex-wrap dc__gap-8 ${className}`}>
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
                                showRemoveIcon={showClearAndRemove}
                                shouldHideLabel={shouldHideLabel}
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
                            showRemoveIcon={showClearAndRemove}
                            shouldHideLabel={shouldHideLabel}
                        />
                    ),
                )}
                {showClearAndRemove && (
                    <div className="flex">
                        <button
                            type="button"
                            className={`cta text fs-13-imp lh-20-imp h-20 p-0-imp ${clearButtonClassName}`}
                            onClick={clearFilters}
                        >
                            Clear All Filters
                        </button>
                    </div>
                )}
            </div>
        )
    )
}

export default FilterChips
