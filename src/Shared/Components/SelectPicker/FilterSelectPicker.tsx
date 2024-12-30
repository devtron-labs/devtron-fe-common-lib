/*
 * Copyright (c) 2024. Devtron Inc.
 */

import { useEffect, useMemo, useState } from 'react'
import { ReactComponent as ICFilter } from '@Icons/ic-filter.svg'
import { ReactComponent as ICFilterApplied } from '@Icons/ic-filter-applied.svg'
import { ComponentSizeType } from '@Shared/constants'
import { useRegisterShortcut, UseRegisterShortcutProvider } from '@Common/Hooks'
import { IS_PLATFORM_MAC_OS } from '@Common/Constants'
import { SupportedKeyboardKeysType } from '@Common/Hooks/UseRegisterShortcut/types'
import SelectPicker from './SelectPicker.component'
import { FilterSelectPickerProps, SelectPickerOptionType, SelectPickerProps } from './type'
import { Button } from '../Button'

const APPLY_FILTER_SHORTCUT_KEYS: SupportedKeyboardKeysType[] = [IS_PLATFORM_MAC_OS ? 'Meta' : 'Control', 'Enter']

const FilterSelectPicker = ({
    appliedFilterOptions,
    handleApplyFilter,
    options,
    ...props
}: FilterSelectPickerProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')

    const [selectedOptions, setSelectedOptions] = useState<SelectPickerOptionType[]>(
        structuredClone(appliedFilterOptions ?? []),
    )

    const { registerShortcut, unregisterShortcut } = useRegisterShortcut()

    const appliedFiltersCount = appliedFilterOptions?.length ?? 0

    useEffect(() => {
        setSelectedOptions(appliedFilterOptions ?? [])
    }, [appliedFilterOptions])

    const filterIcon = useMemo(
        () => (appliedFiltersCount ? <ICFilterApplied className="p-2" /> : <ICFilter className="p-2" />),
        [appliedFiltersCount],
    )

    const openMenu = () => {
        setIsMenuOpen(true)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    const handleSelectOnChange: SelectPickerProps<number | string, true>['onChange'] = (selectedOptionsToUpdate) => {
        setInputValue(inputValue)
        setSelectedOptions(structuredClone(selectedOptionsToUpdate) as SelectPickerOptionType[])
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
            <Button
                text="Apply"
                dataTestId="filter-select-picker-apply"
                onClick={handleApplyClick}
                size={ComponentSizeType.small}
                fullWidth
                showTooltip
                tooltipProps={{
                    shortcutKeyCombo: {
                        text: 'Apply filter',
                        combo: APPLY_FILTER_SHORTCUT_KEYS,
                    },
                }}
            />
        </div>
    )

    useEffect(() => {
        if (isMenuOpen) {
            registerShortcut({ keys: APPLY_FILTER_SHORTCUT_KEYS, callback: handleApplyClick })
        }

        return () => {
            unregisterShortcut(APPLY_FILTER_SHORTCUT_KEYS)
        }
    }, [handleApplyClick, isMenuOpen])

    return (
        <div className="dc__mxw-250">
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
                customSelectedOptionsCount={appliedFiltersCount}
                icon={filterIcon}
                inputValue={inputValue}
                onInputChange={setInputValue}
            />
        </div>
    )
}

const FilterSelectPickerWrapper = (props: FilterSelectPickerProps) => (
    <UseRegisterShortcutProvider ignoreTags={[]}>
        <FilterSelectPicker {...props} />
    </UseRegisterShortcutProvider>
)

export default FilterSelectPickerWrapper
