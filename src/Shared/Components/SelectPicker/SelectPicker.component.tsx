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

import ReactSelect, { ControlProps, MenuListProps, ValueContainerProps } from 'react-select'
import { ReactElement, useCallback, useMemo } from 'react'
import { ReactComponent as ErrorIcon } from '@Icons/ic-warning.svg'
import { ReactComponent as ICInfoFilledOverride } from '@Icons/ic-info-filled-override.svg'
import { ComponentSizeType } from '@Shared/constants'
import { ConditionalWrap } from '@Common/Helper'
import Tippy from '@tippyjs/react'
import { getCommonSelectStyle } from './utils'
import {
    SelectPickerClearIndicator,
    SelectPickerControl,
    SelectPickerDropdownIndicator,
    SelectPickerLoadingIndicator,
    SelectPickerMenuList,
    SelectPickerOption,
    SelectPickerValueContainer,
} from './common'
import { SelectPickerOptionType, SelectPickerProps } from './type'

/**
 * Generic component for select picker
 *
 * @example With icon in control
 * ```tsx
 * <SelectPicker ... icon={<CustomIcon />} />
 * ```
 *
 * @example Medium menu list width
 * ```tsx
 * <SelectPicker ... menuSize={ComponentSizeType.medium} />
 * ```
 *
 * @example Large menu list width
 * ```tsx
 * <SelectPicker ... menuSize={ComponentSizeType.large} />
 * ```
 *
 * @example Required label
 * ```tsx
 * <SelectPicker ... required label="Label" />
 * ```
 *
 * @example Custom label
 * ```tsx
 * <SelectPicker ... label={<div>Label</div>} />
 * ```
 *
 * @example Error state
 * ```tsx
 * <SelectPicker ... error="Something went wrong" />
 * ```
 *
 * @example Helper text
 * ```tsx
 * <SelectPicker ... helperText="Help information" />
 * ```
 *
 * @example Menu list footer
 * The footer is sticky by default
 * ```tsx
 * <SelectPicker
 *      ...
 *      renderMenuListFooter={() => (
 *          <div className="px-8 py-6 dc__border-top bcn-50 cn-6">
 *              <div>Foot note</div>
 *          </div>
 *      )}
 * />
 * ```
 *
 * @example Loading state
 * ```tsx
 * <SelectPicker ... isLoading />
 * ```
 *
 * @example Disabled state
 * ```tsx
 * <SelectPicker ... isDisabled />
 * ```
 *
 * @example Loading & disabled state
 * ```tsx
 * <SelectPicker ... isLoading isDisabled />
 * ```
 *
 * @example Hide selected option icon in control
 * ```tsx
 * <SelectPicker ... showSelectedOptionIcon={false} />
 * ```
 *
 * @example Selected option clearable
 * ```tsx
 * <SelectPicker ... isClearable />
 * ```
 *
 * @example Selected option clearable
 * ```tsx
 * <SelectPicker ... showSelectedOptionsCount />
 * ```
 */
const SelectPicker = ({
    error,
    icon,
    renderMenuListFooter,
    helperText,
    placeholder = 'Select a option',
    label,
    showSelectedOptionIcon = true,
    size = ComponentSizeType.medium,
    disabledTippyContent,
    showSelectedOptionsCount = false,
    menuSize,
    menuPosition = 'fixed',
    ...props
}: SelectPickerProps) => {
    const { inputId, required, isDisabled } = props

    const labelId = `${inputId}-label`
    const errorElementId = `${inputId}-error-msg`

    const selectStyles = useMemo(
        () =>
            getCommonSelectStyle({
                error,
                size,
                menuSize,
            }),
        [error, size, menuSize],
    )

    const renderControl = useCallback(
        (controlProps: ControlProps<SelectPickerOptionType>) => (
            <SelectPickerControl {...controlProps} icon={icon} showSelectedOptionIcon={showSelectedOptionIcon} />
        ),
        [icon, showSelectedOptionIcon],
    )

    const renderMenuList = useCallback(
        (menuProps: MenuListProps<SelectPickerOptionType>) => (
            <SelectPickerMenuList {...menuProps} renderMenuListFooter={renderMenuListFooter} />
        ),
        [],
    )

    const renderValueContainer = useCallback(
        (valueContainerProps: ValueContainerProps<SelectPickerOptionType>) => (
            <SelectPickerValueContainer {...valueContainerProps} showSelectedOptionsCount={showSelectedOptionsCount} />
        ),
        [showSelectedOptionsCount],
    )

    const renderDisabledTippy = (children: ReactElement) => (
        <Tippy content={disabledTippyContent} placement="top" className="default-tt" arrow={false}>
            {children}
        </Tippy>
    )

    return (
        <div className="flex column left top dc__gap-4">
            {/* Note: Common out for fields */}
            <div className="flex column left top dc__gap-6 w-100">
                {label && (
                    <label
                        className="fs-13 lh-20 cn-7 fw-4 dc__block mb-0"
                        htmlFor={inputId}
                        data-testid={`label-${inputId}`}
                        id={labelId}
                    >
                        {typeof label === 'string' ? (
                            <span className={`flex left ${required ? 'dc__required-field' : ''}`}>
                                <span className="dc__truncate">{label}</span>
                                {required && <span>&nbsp;</span>}
                            </span>
                        ) : (
                            label
                        )}
                    </label>
                )}
                <ConditionalWrap condition={isDisabled && !!disabledTippyContent} wrap={renderDisabledTippy}>
                    <div className="w-100">
                        <ReactSelect<SelectPickerOptionType, boolean>
                            {...props}
                            placeholder={placeholder}
                            components={{
                                IndicatorSeparator: null,
                                LoadingIndicator: SelectPickerLoadingIndicator,
                                DropdownIndicator: SelectPickerDropdownIndicator,
                                Control: renderControl,
                                Option: SelectPickerOption,
                                MenuList: renderMenuList,
                                ClearIndicator: SelectPickerClearIndicator,
                                ValueContainer: renderValueContainer,
                            }}
                            styles={selectStyles}
                            menuPlacement="auto"
                            menuPosition={menuPosition}
                            menuShouldScrollIntoView
                            backspaceRemovesValue={false}
                            aria-errormessage={errorElementId}
                            aria-invalid={!!error}
                            aria-labelledby={labelId}
                        />
                    </div>
                </ConditionalWrap>
            </div>
            {error && (
                <div className="flex left dc__gap-4 cr-5 fs-11 lh-16 fw-4" id={errorElementId}>
                    <ErrorIcon className="icon-dim-16 p-1 form__icon--error dc__no-shrink dc__align-self-start" />
                    <span className="dc__ellipsis-right__2nd-line">{error}</span>
                </div>
            )}
            {/* Note: Common out for input fields */}
            {helperText && (
                <div className="flex left dc__gap-4 fs-11 lh-16 cn-7">
                    <ICInfoFilledOverride className="icon-dim-16 dc__no-shrink dc__align-self-start" />
                    <span className="dc__ellipsis-right__2nd-line">{helperText}</span>
                </div>
            )}
        </div>
    )
}

export default SelectPicker
