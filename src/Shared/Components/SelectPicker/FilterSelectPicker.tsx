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

import { useEffect, useMemo, useRef, useState } from 'react'

import { ReactComponent as ICFilter } from '@Icons/ic-filter.svg'
import { ReactComponent as ICFilterApplied } from '@Icons/ic-filter-applied.svg'
import { IS_PLATFORM_MAC_OS } from '@Common/Constants'
import { useRegisterShortcut, UseRegisterShortcutProvider } from '@Common/Hooks'
import { SupportedKeyboardKeysType } from '@Common/Hooks/UseRegisterShortcut/types'

import { ButtonProps, ButtonVariantType, useTriggerAutoClickTimestamp } from '../Button'
import SelectPicker from './SelectPicker.component'
import { FilterSelectPickerProps, SelectPickerOptionType, SelectPickerProps } from './type'

const APPLY_FILTER_SHORTCUT_KEYS: SupportedKeyboardKeysType[] = [IS_PLATFORM_MAC_OS ? 'Meta' : 'Control', 'Enter']

const FilterSelectPicker = ({
    appliedFilterOptions,
    handleApplyFilter,
    options,
    menuIsOpen = false,
    onMenuClose,
    focusOnMount = false,
    ...props
}: FilterSelectPickerProps) => {
    const selectRef = useRef<SelectPickerProps<string | number, true>['selectRef']['current']>()

    const [isMenuOpen, setIsMenuOpen] = useState(menuIsOpen)
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

    const handleApplyClick: ButtonProps['onClick'] = (e) => {
        handleApplyFilter(selectedOptions)
        resetTriggerAutoClickTimestamp()

        // If true, depicts the click event is triggered by the user
        // Added !e to ensure it works for both click and keyboard shortcut event
        if (!e || e.isTrusted) {
            closeMenu()
        } else {
            // If the event is not triggered by the user, focus on the select picker
            // As it loses focus when auto-click is triggered and menu is not closed
            setTimeout(() => {
                selectRef.current.focus()
            }, 100)
        }
    }

    const handleMenuClose = () => {
        onMenuClose?.()
        ;(handleApplyClick as () => void)()
    }

    useEffect(() => {
        if (isMenuOpen) {
            registerShortcut({ keys: APPLY_FILTER_SHORTCUT_KEYS, callback: handleApplyClick as () => void })
        }

        return () => {
            unregisterShortcut(APPLY_FILTER_SHORTCUT_KEYS)
        }
    }, [handleApplyClick, isMenuOpen])

    useEffect(() => {
        setTimeout(() => {
            if (menuIsOpen && focusOnMount && selectRef.current) {
                selectRef.current.focus()
            }
        }, 100)
    }, [])

    return (
        <div className="dc__mxw-250">
            <SelectPicker<string | number, true>
                {...props}
                selectRef={selectRef}
                options={options}
                value={selectedOptions}
                isMulti
                menuIsOpen={isMenuOpen}
                onMenuOpen={openMenu}
                onMenuClose={handleMenuClose}
                onChange={handleSelectOnChange}
                menuListFooterConfig={{
                    type: 'button',
                    buttonProps: {
                        text: 'Apply',
                        dataTestId: 'filter-select-picker-apply',
                        onClick: handleApplyClick,
                        showTooltip: true,
                        tooltipProps: {
                            shortcutKeyCombo: {
                                text: 'Apply filter',
                                combo: APPLY_FILTER_SHORTCUT_KEYS,
                            },
                        },
                        triggerAutoClickTimestamp,
                        variant: ButtonVariantType.primary,
                    },
                }}
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
