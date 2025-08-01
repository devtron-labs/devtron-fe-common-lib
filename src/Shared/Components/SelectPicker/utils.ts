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

import { GroupBase, MultiValue, OptionsOrGroups, StylesConfig } from 'react-select'

import { noop } from '@Common/Helper'
import { CHECKBOX_VALUE } from '@Common/Types'
import { ComponentSizeType } from '@Shared/constants'

import {
    SELECT_PICKER_CONTROL_SIZE_MAP,
    SELECT_PICKER_FONT_SIZE_MAP,
    SELECT_PICKER_ICON_SIZE_MAP,
    SELECT_PICKER_MULTI_VALUE_LABEL_SIZE_MAP,
} from './constants'
import { SelectPickerOptionType, SelectPickerProps, SelectPickerVariantType } from './type'

const getMenuWidthFromSize = <OptionValue, IsMulti extends boolean>(
    menuSize: SelectPickerProps<OptionValue, IsMulti>['menuSize'],
): { width: string; minWidth: string } => {
    switch (menuSize) {
        case ComponentSizeType.medium:
            return {
                width: '125%',
                minWidth: '250px',
            }
        case ComponentSizeType.large:
            return {
                width: '150%',
                minWidth: '300px',
            }
        case ComponentSizeType.xs: {
            return {
                width: '100%',
                minWidth: '100%',
            }
        }
        case ComponentSizeType.small:
        default:
            return {
                width: '100%',
                minWidth: '200px',
            }
    }
}

const getVariantOverrides = <OptionValue>(
    variant: SelectPickerVariantType,
): StylesConfig<SelectPickerOptionType<OptionValue>> => {
    switch (variant) {
        case SelectPickerVariantType.COMPACT:
            return {
                control: () => ({
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: 0,
                }),
                singleValue: () => ({
                    fontWeight: 600,
                }),
            }
        case SelectPickerVariantType.BORDER_LESS:
            return {
                control: (_, state) => ({
                    ...(!state.isFocused && {
                        '&:not(:hover)': {
                            backgroundColor: 'transparent',
                            borderColor: 'transparent',
                            paddingInline: 0,
                        },
                    }),
                    ...(state.menuIsOpen && {
                        minWidth: '250px',
                        maxWidth: '250px',
                    }),
                }),
                singleValue: (_, state) => ({
                    ...(!state.selectProps.isFocussed && {
                        '&:not(:hover)': {
                            fontWeight: 600,
                        },
                    }),
                }),
            }
        default:
            return null
    }
}

const getOptionBgColor = <OptionValue>(
    state: Parameters<StylesConfig<SelectPickerOptionType<OptionValue>>['option']>[1],
): string => {
    if (state.isSelected && !state.selectProps.isMulti) {
        return 'var(--B100)'
    }

    if (state.isFocused) {
        return 'var(--bg-hover)'
    }

    return 'var(--transparent)'
}

export const getCommonSelectStyle = <OptionValue, IsMulti extends boolean>({
    error,
    size,
    menuSize,
    variant,
    getIsOptionValid,
    isGroupHeadingSelectable,
    shouldMenuAlignRight,
}: Pick<SelectPickerProps<OptionValue, IsMulti>, 'error' | 'size' | 'menuSize' | 'variant' | 'shouldMenuAlignRight'> &
    Pick<
        SelectPickerProps<OptionValue, IsMulti>['multiSelectProps'],
        'getIsOptionValid' | 'isGroupHeadingSelectable'
    >): StylesConfig<SelectPickerOptionType<OptionValue>> => {
    const { control, singleValue } = getVariantOverrides(variant) ?? {
        control: noop,
        singleValue: noop,
    }

    return {
        container: (base, state) => ({
            ...base,
            ...(state.isDisabled && {
                cursor: 'not-allowed',
                pointerEvents: 'auto',
            }),
        }),
        menu: (base) => ({
            ...base,
            overflow: 'hidden',
            marginBlock: '4px',
            backgroundColor: 'var(--bg-menu-primary)',
            border: '1px solid var(--border-primary-translucent)',
            boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.20)',
            width: getMenuWidthFromSize(menuSize).width,
            minWidth: getMenuWidthFromSize(menuSize).minWidth,
            zIndex: 'var(--select-picker-menu-index)',
            ...(shouldMenuAlignRight && {
                right: 0,
            }),
        }),
        menuList: (base) => ({
            ...base,
            padding: 0,
        }),
        control: (base, state) => ({
            ...base,
            minHeight: SELECT_PICKER_CONTROL_SIZE_MAP[size],
            minWidth: '56px',
            boxShadow: 'none',
            backgroundColor: 'var(--bg-secondary)',
            border: `1px solid ${error ? 'var(--R500)' : 'var(--N200)'}`,
            cursor: state.isDisabled ? 'not-allowed' : 'pointer',
            padding: '5px 8px',
            gap: '6px',
            opacity: state.isDisabled ? 0.5 : 1,
            flexWrap: 'nowrap',
            maxHeight: '120px',
            overflow: 'auto',
            alignItems: 'safe center',
            transition: 'border-color 0.17s, border 0.17s, padding-inline 0.17s, min-width 0.17s',
            ...(control(base, state) || {}),

            '&:hover': {
                borderColor: state.isDisabled ? 'var(--N200)' : `${error ? 'var(--R500)' : 'var(--N300)'}`,
            },

            '&:focus, &:focus-within': {
                borderColor: state.isDisabled ? 'var(--N200)' : 'var(--B500)',
                outline: 'none',
            },
        }),
        option: (base, state) => ({
            ...base,
            color: 'var(--N900)',
            backgroundColor: getOptionBgColor(state),
            padding: '6px 8px',
            cursor: 'pointer',
            fontSize: '13px',
            lineHeight: '20px',
            fontWeight: 400,
            borderRadius: '4px',
            marginInline: '4px',
            width: 'auto',

            ':active': {
                backgroundColor: 'var(--N100)',
            },

            ':hover': {
                backgroundColor: 'var(--bg-hover)',
            },

            ...(state.isDisabled && {
                cursor: 'not-allowed',
                opacity: 0.5,
            }),

            '& + .select-picker__group': {
                marginTop: '4px',
            },
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            ...SELECT_PICKER_ICON_SIZE_MAP[size],
            display: 'flex',
            alignItems: 'center',
            flexShrink: '0',
            color: 'var(--N600)',
            padding: '0',
            transition: `transform .2s ease${variant === SelectPickerVariantType.BORDER_LESS ? ' 0.17s' : ''}`,
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }),
        clearIndicator: (base) => ({
            ...base,
            ...SELECT_PICKER_ICON_SIZE_MAP[size],
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            flexShrink: '0',

            '&:hover': {
                backgroundColor: 'transparent',
                color: 'inherit',

                'svg use': {
                    fill: 'var(--R500)',
                },
            },
        }),
        valueContainer: (base, state) => ({
            ...base,
            padding: '0',
            fontWeight: '400',
            ...(state.selectProps.isMulti && {
                gap: '6px',
            }),
        }),
        multiValue: (base, state) => {
            const isOptionValid = getIsOptionValid(state.data)

            return {
                ...base,
                background: isOptionValid ? 'var(--bg-primary)' : 'var(--R100)',
                border: isOptionValid ? '1px solid var(--N200)' : '1px solid var(--R200)',
                borderRadius: '4px',
                padding: '1px 5px',
                maxWidth: '250px',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
            }
        },
        multiValueLabel: (base) => ({
            ...base,
            borderRadius: 0,
            color: 'var(--N900)',
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: SELECT_PICKER_MULTI_VALUE_LABEL_SIZE_MAP[size],
            padding: 0,
            paddingLeft: 0,
        }),
        multiValueRemove: (base) => ({
            ...base,
            padding: 0,
            borderRadius: 0,

            '&:hover': {
                backgroundColor: 'var(--R100)',
                color: 'inherit',
                borderRadius: '2px',

                'svg use': {
                    fill: 'var(--R500)',
                },
            },
        }),
        loadingMessage: (base) => ({
            ...base,
            color: 'var(--N600)',
        }),
        noOptionsMessage: (base) => ({
            ...base,
            color: 'var(--N600)',
        }),
        group: (base) => ({
            ...base,
            paddingBlock: '4px',
            borderTop: '1px solid var(--border-secondary-translucent)',

            '&:first-child': {
                paddingTop: 0,
                borderTop: 'none',
            },

            '&:last-child': {
                paddingBottom: 0,
            },
        }),
        groupHeading: (base) => ({
            ...base,
            fontWeight: 600,
            fontSize: '12px',
            color: 'var(--N900)',
            backgroundColor: 'var(--bg-menu-secondary)',
            marginBottom: '4px',
            padding: '4px 12px',
            textTransform: 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            position: 'sticky',
            top: 0,
            zIndex: 1,

            ...(isGroupHeadingSelectable && {
                cursor: 'pointer',
            }),
        }),
        input: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
            color: 'var(--N900)',
            fontSize: '13px',
            fontWeight: 400,
            lineHeight: '20px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'clip',
        }),
        placeholder: (base) => ({
            ...base,
            color: 'var(--N500)',
            fontSize: SELECT_PICKER_FONT_SIZE_MAP[size],
            lineHeight: '20px',
            fontWeight: 400,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        }),
        indicatorsContainer: (base) => ({
            ...base,
            gap: '4px',
            flexShrink: 0,
        }),
        singleValue: (base, state) => ({
            ...base,
            margin: 0,
            color: 'var(--N900)',
            fontSize: SELECT_PICKER_FONT_SIZE_MAP[size],
            fontWeight: 400,
            lineHeight: '20px',
            ...(singleValue(base, state) || {}),
        }),
    }
}

export const getGroupCheckboxValue = <OptionValue>(
    groupHeadingOptions: readonly SelectPickerOptionType<OptionValue>[],
    selectedOptions: MultiValue<SelectPickerOptionType<OptionValue>>,
    getOptionValue: (option: SelectPickerOptionType<OptionValue>) => string,
) => {
    const selectedOptionsMapByValue = selectedOptions.reduce<Record<string, true>>((acc, option) => {
        acc[getOptionValue(option)] = true
        return acc
    }, {})
    const groupOptionsComputedValue = groupHeadingOptions.map((option) => getOptionValue(option))

    const isEveryOptionInGroupSelected = groupOptionsComputedValue.every((value) => selectedOptionsMapByValue[value])

    if (isEveryOptionInGroupSelected) {
        return CHECKBOX_VALUE.CHECKED
    }

    const isSomeOptionInGroupSelected = groupOptionsComputedValue.some((value) => selectedOptionsMapByValue[value])

    if (isSomeOptionInGroupSelected) {
        return CHECKBOX_VALUE.INTERMEDIATE
    }

    return null
}

/**
 * Retrieves an option from the options list based on the provided value.
 *
 * @param optionsList - The list of options or groups of options.
 * @param value - The value to compare against the options' values.
 * @param defaultOption - The default option to return if no match is found.
 * @param getOptionValue - Override the default value for the option
 * @returns The matched option or the default option if no match is found.
 */
export const getSelectPickerOptionByValue = <OptionValue>(
    optionsList: OptionsOrGroups<SelectPickerOptionType<OptionValue>, GroupBase<SelectPickerOptionType<OptionValue>>>,
    value: OptionValue,
    defaultOption: SelectPickerOptionType<OptionValue> = { label: '', value: '' as unknown as OptionValue },
    getOptionValue: SelectPickerProps<OptionValue>['getOptionValue'] = null,
): SelectPickerOptionType<OptionValue> => {
    if (!Array.isArray(optionsList)) {
        return defaultOption
    }

    const flatOptionsList = optionsList.flatMap<SelectPickerOptionType<OptionValue>>((groupOrBaseOption) =>
        'options' in groupOrBaseOption ? groupOrBaseOption.options : [groupOrBaseOption],
    )

    return (
        flatOptionsList.find((option) => {
            const optionValue = getOptionValue ? getOptionValue(option) : option.value

            return optionValue === value
        }) ?? defaultOption
    )
}
