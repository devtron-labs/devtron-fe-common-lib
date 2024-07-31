/*
 * Copyright (c) 2024. Devtron Inc.
 */

import React, { cloneElement, useState } from 'react'
import ReactSelect, { MenuListProps, components } from 'react-select'
import { Option } from '@Common/MultiSelectCustomization'
import { OptionType } from '@Common/Types'
import { ReactComponent as ICCaretDown } from '../../../Assets/Icon/ic-caret-down.svg'
import { getFilterStyle } from './utils'
import { FilterButtonPropsType } from './types'

const ValueContainer = (props: any) => {
    const { selectProps, getValue, children } = props
    const selectedProjectLen = getValue().length

    return (
        <components.ValueContainer {...props}>
            {!selectProps.inputValue &&
                (!selectProps.menuIsOpen ? (
                    <div className="flexbox dc__gap-8 dc__align-items-center">
                        <div className="fs-13 fw-4 cn-9">{selectProps.placeholder}</div>
                        {selectedProjectLen > 0 && (
                            <div className="bcb-5 dc__border-radius-4-imp pl-5 pr-5 cn-0 fs-12 fw-6 lh-18">
                                {selectedProjectLen}
                            </div>
                        )}
                    </div>
                ) : (
                    <span className="dc__position-abs cn-5 ml-2">{selectProps.placeholder}</span>
                ))}

            {cloneElement(children[1])}
        </components.ValueContainer>
    )
}

const FilterSelectMenuList: React.FC<MenuListProps> = (props) => {
    const {
        children,
        // @ts-ignore NOTE: handleApplyFilter is passed from FilterButton
        selectProps: { handleApplyFilter },
    } = props

    return (
        <components.MenuList {...props}>
            {children}
            <div className="p-8 dc__position-sticky dc__bottom-0 dc__border-top-n1 bcn-0">
                <button
                    type="button"
                    className="dc__unset-button-styles w-100 br-4 h-28 flex bcb-5 cn-0 fw-6 lh-28 fs-12 h-28 br-4 pt-5 pr-12 pb-5 pl-12"
                    onClick={handleApplyFilter}
                    aria-label="Apply filters"
                >
                    Apply
                </button>
            </div>
        </components.MenuList>
    )
}

const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
        <ICCaretDown className="icon-dim-20 icon-n5" />
    </components.DropdownIndicator>
)

const FilterButton: React.FC<FilterButtonPropsType> = ({
    placeholder,
    appliedFilters,
    options,
    disabled,
    handleApplyChange,
    getFormattedFilterLabelValue,
    menuAlignFromRight,
}) => {
    const [selectedOptions, setSelectedOptions] = useState<OptionType[]>(
        appliedFilters.map((filter) => ({ value: filter, label: getFormattedFilterLabelValue?.(filter) || filter })),
    )

    const handleSelectOnChange: React.ComponentProps<typeof ReactSelect>['onChange'] = (selected: OptionType[]) => {
        setSelectedOptions([...selected])
    }

    const handleApply = () => {
        handleApplyChange(Object.values(selectedOptions).map((option) => option.value))
    }

    return (
        <ReactSelect
            placeholder={placeholder}
            isMulti
            isDisabled={disabled}
            options={options}
            value={selectedOptions}
            onChange={handleSelectOnChange}
            closeMenuOnSelect={false}
            controlShouldRenderValue={false}
            hideSelectedOptions={false}
            maxMenuHeight={300}
            components={{
                MenuList: FilterSelectMenuList,
                IndicatorSeparator: null,
                ClearIndicator: null,
                DropdownIndicator,
                Option,
                ValueContainer,
            }}
            styles={getFilterStyle(menuAlignFromRight)}
            // @ts-ignore NOTE: passing this to use in FilterSelectMenuList
            handleApplyFilter={handleApply}
        />
    )
}

export default FilterButton
