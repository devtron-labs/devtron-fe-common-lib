/*
 * Copyright (c) 2024. Devtron Inc.
 */

import { useState } from 'react'
import SelectPicker from './SelectPicker.component'
import { FilterSelectPickerProps, SelectPickerOptionType, SelectPickerProps } from './type'

const FilterSelectPicker = ({
    appliedFilterOptions,
    handleApplyFilter,
    options,
    ...props
}: FilterSelectPickerProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState<SelectPickerOptionType[]>(
        structuredClone(appliedFilterOptions ?? []),
    )

    const openMenu = () => {
        setIsMenuOpen(true)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    const handleSelectOnChange: SelectPickerProps<number | string, true>['onChange'] = (selectedOptionsToUpdate) => {
        setSelectedOptions(structuredClone(selectedOptionsToUpdate))
    }

    const handleMenuClose = () => {
        closeMenu()
        setSelectedOptions(structuredClone(appliedFilterOptions ?? []))
    }

    const handleApplyClick = () => {
        handleApplyFilter(selectedOptions)
        closeMenu()
    }

    const renderApplyButton = () => (
        <div className="p-8 dc__border-top-n1">
            <button
                type="button"
                className="dc__unset-button-styles w-100 br-4 h-28 flex bcb-5 cn-0 fw-6 lh-28 fs-12 h-28 br-4 pt-5 pr-12 pb-5 pl-12"
                onClick={handleApplyClick}
                aria-label="Apply filters"
            >
                Apply
            </button>
        </div>
    )

    return (
        <SelectPicker
            {...props}
            options={options}
            value={selectedOptions}
            isMulti
            menuIsOpen={isMenuOpen}
            onMenuOpen={openMenu}
            onMenuClose={handleMenuClose}
            onChange={handleSelectOnChange}
            renderMenuListFooter={renderApplyButton}
            controlShouldRenderValue={false}
            showSelectedOptionsCount
            isSearchable
            isClearable={false}
        />
    )
}

export default FilterSelectPicker
