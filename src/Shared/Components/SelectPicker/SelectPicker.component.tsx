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

import {
    GroupHeadingProps,
    MultiValueProps,
    OptionProps,
    ValueContainerProps,
    Props as ReactSelectProps,
} from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { ReactElement, useCallback, useMemo, useRef, useState } from 'react'
import { ComponentSizeType } from '@Shared/constants'
import { ConditionalWrap } from '@Common/Helper'
import Tippy from '@tippyjs/react'
import { deriveBorderRadiusAndBorderClassFromConfig, isNullOrUndefined } from '@Shared/Helpers'
import { getCommonSelectStyle, getSelectPickerOptionByValue } from './utils'
import {
    SelectPickerMultiValueLabel,
    SelectPickerMultiValueRemove,
    SelectPickerClearIndicator,
    SelectPickerControl,
    SelectPickerDropdownIndicator,
    SelectPickerGroupHeading,
    SelectPickerMenuList,
    SelectPickerOption,
    SelectPickerValueContainer,
    SelectPickerInput,
} from './common'
import { SelectPickerOptionType, SelectPickerProps, SelectPickerVariantType } from './type'
import { GenericSectionErrorState } from '../GenericSectionErrorState'
import FormFieldWrapper from '../FormFieldWrapper/FormFieldWrapper'
import { getFormFieldAriaAttributes } from '../FormFieldWrapper'
import './selectPicker.scss'

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
 * @example Menu list footer config
 * The footer is sticky by default
 * ```tsx
 * <SelectPicker
 *      ...
 *      menuListFooterConfig={{
 *          type: 'text',
 *          value: 'Info text',
 *      }}
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
 * @example Multi Select
 * ```tsx
 * <SelectPicker ... isMulti />
 * ```
 *
 * @example Creatable Multi Select
 * ```tsx
 * <SelectPicker
 *      ...
 *      isMulti
 *      multiSelectProps={{
 *          isCreatable: true
 *      }}
 * />
 * ```
 *
 * @example Multi Select with group heading selectable
 * ```tsx
 * <SelectPicker
 *      ...
 *      isMulti
 *      multiSelectProps={{
 *          isGroupHeadingSelectable: true
 *      }}
 * />
 * ```
 *
 * @example Multi Select with selected option validator
 * ```tsx
 * <SelectPicker
 *      ...
 *      isMulti
 *      multiSelectProps={{
 *          getIsOptionValid: (option) => boolean
 *      }}
 * />
 * ```
 *
 * @example Custom options rendering support (menuIsOpen needs to be handled by consumer)
 * ```tsx
 * <SelectPicker
 *      ...
 *      shouldRenderCustomOptions
 *      renderCustomOptions={() => <div />}
 * />
 * ```
 *
 * @example Align the menu at the right most end
 * ```tsx
 * <SelectPicker
 *      ...
 *      shouldMenuAlignRight
 * />
 * ```
 */
const SelectPicker = <OptionValue, IsMulti extends boolean>({
    error,
    icon,
    helperText,
    placeholder = 'Select a option',
    label,
    showSelectedOptionIcon = true,
    size = ComponentSizeType.medium,
    disabledTippyContent,
    showSelectedOptionsCount = false,
    menuSize,
    optionListError,
    reloadOptionList,
    menuPosition = 'fixed',
    variant = SelectPickerVariantType.DEFAULT,
    disableDescriptionEllipsis = false,
    multiSelectProps = {},
    isMulti,
    name,
    classNamePrefix,
    shouldRenderCustomOptions = false,
    isSearchable,
    selectRef: refFromConsumer,
    shouldMenuAlignRight = false,
    fullWidth = false,
    customSelectedOptionsCount = null,
    menuListFooterConfig,
    isCreatable = false,
    onCreateOption,
    closeMenuOnSelect = false,
    shouldShowNoOptionsMessage = true,
    shouldRenderTextArea = false,
    onKeyDown,
    shouldHideMenu = false,
    warningText,
    layout,
    ariaLabel,
    borderConfig,
    borderRadiusConfig,
    labelTippyCustomizedConfig,
    labelTooltipConfig,
    hideFormFieldInfo,
    ...props
}: SelectPickerProps<OptionValue, IsMulti>) => {
    const innerRef = useRef<SelectPickerProps<OptionValue, IsMulti>['selectRef']['current']>(null)
    const selectRef = refFromConsumer ?? innerRef

    const [isFocussed, setIsFocussed] = useState(false)
    const [inputValue, setInputValue] = useState('')

    const {
        inputId,
        required,
        isDisabled,
        controlShouldRenderValue: _controlShouldRenderValue = true,
        value,
        options,
        getOptionValue,
        noOptionsMessage,
    } = props
    const {
        isGroupHeadingSelectable = false,
        getIsOptionValid = () => true,
        customDisplayText = null,
    } = multiSelectProps
    const controlShouldRenderValue = _controlShouldRenderValue && !customDisplayText

    // Only large variant is supported for multi select picker
    const selectSize = isMulti && controlShouldRenderValue ? ComponentSizeType.large : size
    const shouldShowSelectedOptionIcon = !isMulti && showSelectedOptionIcon
    const isSelectSearchable = !shouldRenderCustomOptions && isSearchable

    // Option disabled, group null state, checkbox hover, create option visibility (scroll reset on search)
    const selectStyles = useMemo(
        () =>
            getCommonSelectStyle({
                error,
                size: selectSize,
                menuSize,
                variant,
                getIsOptionValid,
                isGroupHeadingSelectable,
                shouldMenuAlignRight,
            }),
        [error, selectSize, menuSize, variant, isGroupHeadingSelectable, shouldMenuAlignRight],
    )

    // Used to show the create new option for creatable select and the option(s) doesn't have the input value
    const isValidNewOption = (_inputValue: string) => {
        const trimmedInput = _inputValue?.trim()

        return (
            isCreatable &&
            !!trimmedInput &&
            !getSelectPickerOptionByValue<OptionValue>(
                value as SelectPickerOptionType<OptionValue>[],
                trimmedInput as OptionValue,
                null,
                getOptionValue,
            ) &&
            !getSelectPickerOptionByValue<OptionValue>(options, trimmedInput as OptionValue, null, getOptionValue)
        )
    }

    const renderValueContainer = useCallback(
        (valueContainerProps: ValueContainerProps<SelectPickerOptionType<OptionValue>>) => (
            <SelectPickerValueContainer
                {...valueContainerProps}
                showSelectedOptionsCount={showSelectedOptionsCount}
                customSelectedOptionsCount={customSelectedOptionsCount}
            />
        ),
        [showSelectedOptionsCount, customSelectedOptionsCount],
    )

    const renderOption = useCallback(
        (optionProps: OptionProps<SelectPickerOptionType<OptionValue>>) => (
            <SelectPickerOption {...optionProps} disableDescriptionEllipsis={disableDescriptionEllipsis} />
        ),
        [disableDescriptionEllipsis],
    )

    const renderMultiValueLabel = (
        multiValueLabelProps: MultiValueProps<SelectPickerOptionType<OptionValue>, true>,
    ) => <SelectPickerMultiValueLabel {...multiValueLabelProps} getIsOptionValid={getIsOptionValid} />

    const renderGroupHeading = useCallback(
        (groupHeadingProps: GroupHeadingProps<SelectPickerOptionType<OptionValue>>) => (
            <SelectPickerGroupHeading {...groupHeadingProps} isGroupHeadingSelectable={isGroupHeadingSelectable} />
        ),
        [isGroupHeadingSelectable],
    )

    const renderNoOptionsMessage = () => {
        if (optionListError) {
            return <GenericSectionErrorState reload={reloadOptionList} />
        }

        if (shouldShowNoOptionsMessage) {
            return (
                <p className="m-0 cn-7 fs-13 fw-4 lh-20 py-6 px-8">
                    {noOptionsMessage?.({
                        inputValue,
                    }) || 'No options'}
                </p>
            )
        }

        return null
    }

    const renderDisabledTippy = (children: ReactElement) => (
        <Tippy content={disabledTippyContent} placement="top" className="default-tt" arrow={false}>
            {children}
        </Tippy>
    )

    const handleCreateOption: SelectPickerProps<OptionValue, boolean>['onCreateOption'] = (
        _inputValue: string,
    ): void => {
        const trimmedInputValue = _inputValue?.trim()
        if (trimmedInputValue) {
            onCreateOption?.(trimmedInputValue)
        }
    }

    const handleInputChange: ReactSelectProps['onInputChange'] = (updatedInputValue, actionMeta) => {
        // If onInputChange is provided, then the input state should be controlled externally
        if (props.onInputChange) {
            props.onInputChange(updatedInputValue, actionMeta)
            return
        }
        setInputValue(updatedInputValue)
    }

    const handleKeyDown: ReactSelectProps['onKeyDown'] = (e) => {
        // Prevent the option from being selected if meta or control key is pressed
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault()
        }

        if (e.key === 'Escape') {
            e.stopPropagation()

            if (!selectRef.current.props.menuIsOpen) {
                selectRef.current.blur()
            }
        }

        onKeyDown?.(e)
    }

    const handleFocus: ReactSelectProps['onFocus'] = () => {
        setIsFocussed(true)
    }

    const handleBlur: ReactSelectProps['onFocus'] = (e) => {
        setIsFocussed(false)

        props.onBlur?.(e)
    }

    const handleChange: ReactSelectProps<SelectPickerOptionType<OptionValue>, IsMulti>['onChange'] = (...params) => {
        // Retain the input value on selection change
        if (isMulti && isNullOrUndefined(props.inputValue)) {
            setInputValue(inputValue)
        }

        props.onChange?.(...params)
    }

    return (
        <FormFieldWrapper
            inputId={inputId}
            layout={layout}
            label={label}
            error={error}
            helperText={helperText}
            warningText={warningText}
            required={required}
            fullWidth={fullWidth}
            ariaLabel={ariaLabel}
            borderConfig={borderConfig}
            borderRadiusConfig={borderRadiusConfig}
            labelTippyCustomizedConfig={labelTippyCustomizedConfig}
            labelTooltipConfig={labelTooltipConfig}
            hideFormFieldInfo={hideFormFieldInfo}
        >
            <ConditionalWrap condition={isDisabled && !!disabledTippyContent} wrap={renderDisabledTippy}>
                <div className="w-100">
                    <CreatableSelect
                        {...props}
                        {...getFormFieldAriaAttributes({
                            inputId,
                            required,
                            label,
                            ariaLabel,
                            error,
                            helperText,
                        })}
                        classNames={{
                            control: () =>
                                deriveBorderRadiusAndBorderClassFromConfig({ borderConfig, borderRadiusConfig }),
                            ...(isMulti
                                ? {
                                      option: () => 'checkbox__parent-container',
                                  }
                                : {}),
                        }}
                        name={name || inputId}
                        classNamePrefix={classNamePrefix || inputId}
                        isSearchable={isSelectSearchable}
                        placeholder={placeholder}
                        styles={selectStyles}
                        menuPlacement="auto"
                        menuPosition={menuPosition}
                        menuShouldScrollIntoView
                        backspaceRemovesValue={isMulti && controlShouldRenderValue}
                        hideSelectedOptions={false}
                        shouldRenderCustomOptions={shouldRenderCustomOptions || false}
                        isMulti={isMulti}
                        ref={selectRef}
                        components={{
                            IndicatorSeparator: null,
                            LoadingIndicator: null,
                            DropdownIndicator: SelectPickerDropdownIndicator,
                            Control: SelectPickerControl,
                            Option: renderOption,
                            MenuList: SelectPickerMenuList,
                            ClearIndicator: SelectPickerClearIndicator,
                            ValueContainer: renderValueContainer,
                            MultiValueLabel: renderMultiValueLabel,
                            MultiValueRemove: SelectPickerMultiValueRemove,
                            GroupHeading: renderGroupHeading,
                            NoOptionsMessage: renderNoOptionsMessage,
                            Input: SelectPickerInput,
                            ...(shouldHideMenu && {
                                Menu: () => null,
                                DropdownIndicator: () => null,
                            }),
                        }}
                        closeMenuOnSelect={!isMulti || closeMenuOnSelect}
                        allowCreateWhileLoading={false}
                        isValidNewOption={isValidNewOption}
                        createOptionPosition="first"
                        onCreateOption={handleCreateOption}
                        menuListFooterConfig={!optionListError ? menuListFooterConfig : null}
                        inputValue={props.inputValue ?? inputValue}
                        onInputChange={handleInputChange}
                        icon={icon}
                        showSelectedOptionIcon={shouldShowSelectedOptionIcon}
                        onKeyDown={handleKeyDown}
                        shouldRenderTextArea={shouldRenderTextArea}
                        customDisplayText={customDisplayText}
                        {...(!shouldRenderTextArea ? { onFocus: handleFocus } : {})}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        controlShouldRenderValue={controlShouldRenderValue}
                        isFocussed={isFocussed}
                        tabSelectsValue={false}
                    />
                </div>
            </ConditionalWrap>
        </FormFieldWrapper>
    )
}

export default SelectPicker
