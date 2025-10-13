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

import { useEffect, useRef } from 'react'
import { SelectInstance } from 'react-select'

import { useRegisterShortcut } from '@Common/Hooks/UseRegisterShortcut'
import {
    getNoMatchingResultText,
    SelectPicker,
    SelectPickerOptionType,
    SelectPickerProps,
    SelectPickerVariantType,
} from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'
import { ToastManager, ToastVariantType } from '@Shared/Services'

import { ContextSwitcherTypes } from './types'
import { customSelectFilterOption, getDisabledOptions } from './utils'

export const ContextSwitcher = ({
    inputId,
    options = [],
    inputValue,
    onInputChange,
    isLoading,
    value,
    onChange,
    placeholder,
    filterOption,
    formatOptionLabel,
    optionListError,
    reloadOptionList,
    classNamePrefix,
    resource,
}: ContextSwitcherTypes) => {
    const selectRef = useRef<SelectInstance<SelectPickerOptionType>>(null)
    const shouldShowToastRef = useRef<boolean>(true)

    const selectedOptions = options?.map((section) => ({
        ...section,
        options: section?.label === 'Recently Visited' ? section.options?.slice(1) : section.options,
    }))

    const { registerShortcut, unregisterShortcut } = useRegisterShortcut()

    const handleOpenShortcutToast: SelectPickerProps['onMenuOpen'] = () => {
        if (shouldShowToastRef.current) {
            ToastManager.showToast({
                variant: ToastVariantType.shortcut,
                text: `to switch ${resource}`,
                shortcuts: ['S'],
            })
        }
        shouldShowToastRef.current = true
    }

    useEffect(() => {
        registerShortcut({
            keys: ['S'],
            callback: () => {
                shouldShowToastRef.current = false
                selectRef.current?.focus()
                selectRef.current?.openMenu('first')
            },
        })

        return () => {
            unregisterShortcut(['S'])
        }
    }, [])

    const onKeyDown: SelectPickerProps['onKeyDown'] = (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            e.preventDefault()
            selectRef.current?.blurInput()
            selectRef.current?.blur()
        }
    }

    return (
        <SelectPicker
            selectRef={selectRef}
            inputId={inputId}
            options={selectedOptions || []}
            inputValue={inputValue}
            onFocus={handleOpenShortcutToast}
            onInputChange={onInputChange}
            isLoading={isLoading}
            noOptionsMessage={getNoMatchingResultText}
            onChange={onChange}
            value={value}
            variant={SelectPickerVariantType.BORDER_LESS}
            placeholder={placeholder}
            isOptionDisabled={getDisabledOptions}
            size={ComponentSizeType.xl}
            filterOption={filterOption || customSelectFilterOption}
            formatOptionLabel={formatOptionLabel}
            optionListError={optionListError}
            reloadOptionList={reloadOptionList}
            classNamePrefix={classNamePrefix}
            onKeyDown={onKeyDown}
        />
    )
}
