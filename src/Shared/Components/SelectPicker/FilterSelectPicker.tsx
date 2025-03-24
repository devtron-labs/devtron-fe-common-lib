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

import { useEffect, useMemo, useState } from 'react'
import { ReactComponent as ICFilter } from '@Icons/ic-filter.svg'
import { ReactComponent as ICFilterApplied } from '@Icons/ic-filter-applied.svg'
import { ComponentSizeType } from '@Shared/constants'
import { useRegisterShortcut, UseRegisterShortcutProvider } from '@Common/Hooks'
import { IS_PLATFORM_MAC_OS } from '@Common/Constants'
import { SupportedKeyboardKeysType } from '@Common/Hooks/UseRegisterShortcut/types'
import SelectPicker from './SelectPicker.component'
import { FilterSelectPickerProps, SelectPickerOptionType, SelectPickerProps } from './type'
import { Button, ButtonProps, useTriggerAutoClickTimestamp } from '../Button'

const APPLY_FILTER_SHORTCUT_KEYS: SupportedKeyboardKeysType[] = [IS_PLATFORM_MAC_OS ? 'Meta' : 'Control', 'Enter']

const FilterSelectPicker = ({
    appliedFilterOptions,
    handleApplyFilter,
    options,
    ...props
}: FilterSelectPickerProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { triggerAutoClickTimestamp, setTriggerAutoClickTimestampToNow, resetTriggerAutoClickTimestamp } =
        useTriggerAutoClickTimestamp()

    const [selectedOptions, setSelectedOptions] = useState<SelectPickerOptionType[]>(
        structuredClone(appliedFilterOptions ?? []),
    )

    const { registerShortcut, unregisterShortcut } = useRegisterShortcut()

    const appliedFiltersCount = appliedFilterOptions?.length ?? 0

    useEffect(() => {
        setSelectedOptions(appliedFilterOptions ?? [])
    }, [appliedFilterOptions])

    const filterIcon = useMemo(
        () => (appliedFiltersCount ? <ICFilterApplied className="p-2" /> : <ICFilter className="p-2 scn-6" />),
        [appliedFiltersCount],
    )

    const openMenu = () => {
        setIsMenuOpen(true)
    }

    const closeMenu = () => {
        resetTriggerAutoClickTimestamp()
        setIsMenuOpen(false)
    }

    const handleSelectOnChange: SelectPickerProps<number | string, true>['onChange'] = (selectedOptionsToUpdate) => {
        setTriggerAutoClickTimestampToNow()
        setSelectedOptions(structuredClone(selectedOptionsToUpdate) as SelectPickerOptionType[])
    }

    const handleMenuClose = () => {
        closeMenu()
        setSelectedOptions(structuredClone(appliedFilterOptions ?? []))
    }

    const handleApplyClick: ButtonProps['onClick'] = (e) => {
        handleApplyFilter(selectedOptions)
        resetTriggerAutoClickTimestamp()

        // If true, depicts the click event is triggered by the user
        // Added !e to ensure it works for both click and keyboard shortcut event
        if (!e || e.isTrusted) {
            closeMenu()
        }
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
                triggerAutoClickTimestamp={triggerAutoClickTimestamp}
            />
        </div>
    )

    useEffect(() => {
        if (isMenuOpen) {
            registerShortcut({ keys: APPLY_FILTER_SHORTCUT_KEYS, callback: handleApplyClick as () => void })
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
