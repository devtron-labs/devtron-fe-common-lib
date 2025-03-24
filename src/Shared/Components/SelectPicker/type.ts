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

import { ServerErrors } from '@Common/ServerError'
import { OptionType } from '@Common/Types'
import { ComponentSizeType } from '@Shared/constants'
import { MutableRefObject, ReactElement, ReactNode } from 'react'
import { GroupBase, GroupHeadingProps, Props as ReactSelectProps, SelectInstance } from 'react-select'
import { CreatableProps } from 'react-select/creatable'
// This import allows to extend the base interface in react-select module via module augmentation
import type {} from 'react-select/base'
import { TooltipProps } from '@Common/Tooltip/types'
import { ResizableTagTextAreaProps } from '@Common/CustomTagSelector'
import { AsyncProps } from 'react-select/async'
import { FormFieldWrapperProps } from '../FormFieldWrapper/types'

export interface SelectPickerOptionType<OptionValue = string | number> extends OptionType<OptionValue, ReactNode> {
    /**
     * Description to be displayed for the option
     */
    description?: ReactNode
    /**
     * Icon at the start of the option
     */
    startIcon?: ReactElement
    /**
     * Icon at the end of the option
     */
    endIcon?: ReactElement
    /**
     * Props passed to show the tippy on option
     */
    tooltipProps?:
        | Omit<TooltipProps, 'alwaysShowTippyOnHover' | 'showOnTruncate' | 'shortcutKeyCombo'>
        | (Omit<TooltipProps, 'alwaysShowTippyOnHover' | 'showOnTruncate' | 'content'> &
              Required<Pick<TooltipProps, 'shortcutKeyCombo'>>)
}

type SelectProps<OptionValue, IsMulti extends boolean> = ReactSelectProps<
    SelectPickerOptionType<OptionValue>,
    IsMulti,
    GroupBase<SelectPickerOptionType<OptionValue>>
>

declare module 'react-select/base' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export interface Props<Option, IsMulti extends boolean, Group extends GroupBase<Option>> {
        /**
         * Render function for the footer at the bottom of menu list. It is sticky by default
         */
        renderMenuListFooter?: () => ReactNode
        /**
         * If true, custom options are rendered in the menuList component of react select
         *
         * Note: renderCustomOptions is required to be passed; renderMenuListFooter is also not called
         *
         * @default false
         */
        shouldRenderCustomOptions?: boolean
        /**
         * Callback handler for custom options
         *
         * Imp Note: The menu open/close needs to handled by the consumer in this case
         */
        renderCustomOptions?: () => ReactElement
        /**
         * Icon to be rendered in the control
         */
        icon?: ReactElement
        /**
         * If true, the selected option icon is shown in the container.
         * startIcon has higher priority than endIcon.
         *
         * @default 'true'
         */
        showSelectedOptionIcon?: boolean
        /**
         * If provided, the custom display text is shown in the value container
         *
         * @default null
         */
        customDisplayText?: string
        /** Render function for the footer at the end of the options list. */
        renderOptionsFooter?: () => ReactNode
        /**
         * If true, the select picker will render textarea instead of input.
         * @default false
         */
        shouldRenderTextArea?: boolean
        /**
         * Custom prop for the value container for focussed state
         */
        isFocussed?: boolean
    }
}

export enum SelectPickerVariantType {
    DEFAULT = 'default',
    BORDER_LESS = 'border-less',
}

export type SelectPickerProps<OptionValue = number | string, IsMulti extends boolean = false> = Pick<
    SelectProps<OptionValue, IsMulti>,
    | 'name'
    | 'classNamePrefix'
    | 'options'
    | 'value'
    | 'onChange'
    | 'isSearchable'
    | 'isClearable'
    | 'hideSelectedOptions'
    | 'controlShouldRenderValue'
    | 'closeMenuOnSelect'
    | 'isDisabled'
    | 'isLoading'
    | 'required'
    | 'isOptionDisabled'
    | 'placeholder'
    | 'menuPosition'
    | 'getOptionLabel'
    | 'getOptionValue'
    | 'isOptionSelected'
    | 'menuIsOpen'
    | 'onMenuOpen'
    | 'onMenuClose'
    | 'autoFocus'
    | 'onBlur'
    | 'onKeyDown'
    | 'formatOptionLabel'
    | 'onInputChange'
    | 'inputValue'
    | 'filterOption'
> &
    Partial<
        Pick<
            SelectProps<OptionValue, IsMulti>,
            | 'renderMenuListFooter'
            | 'shouldRenderCustomOptions'
            | 'renderCustomOptions'
            | 'icon'
            | 'showSelectedOptionIcon'
            | 'renderOptionsFooter'
            | 'shouldRenderTextArea'
        >
    > &
    Required<Pick<SelectProps<OptionValue, IsMulti>, 'inputId'>> &
    Partial<
        Pick<
            CreatableProps<
                SelectPickerOptionType<OptionValue>,
                IsMulti,
                GroupBase<SelectPickerOptionType<OptionValue>>
            >,
            'onCreateOption' | 'formatCreateLabel' | 'menuPortalTarget'
        >
    > &
    Omit<FormFieldWrapperProps, 'children'> & {
        /**
         * Custom selected options count for use cases like filters
         */
        customSelectedOptionsCount?: number
        /**
         * Size of select
         *
         * @default 'ComponentSizeType.medium'
         */
        size?: Extract<ComponentSizeType, ComponentSizeType.medium | ComponentSizeType.large | ComponentSizeType.small>
        /**
         * Content to be shown in a tippy when disabled
         */
        disabledTippyContent?: ReactNode
        /**
         * If true, the selected options count is shown in a chip inside ValueContainer
         *
         * @default 'false'
         */
        showSelectedOptionsCount?: boolean
        /**
         * Width of the menu list
         *
         * Note: the overflow needs to be handled explicitly for non-small variants
         *
         * @default 'ComponentSizeType.small'
         */
        menuSize?: ComponentSizeType
        /**
         * Variant of the select.
         *
         * @default SelectPickerVariantType.DEFAULT
         */
        variant?: SelectPickerVariantType
        /**
         * Disables the ellipsis on description, it will be shown in full width, wrapped if required.
         *
         * @default false
         */
        disableDescriptionEllipsis?: boolean
        /**
         * Ref for the select picker
         */
        selectRef?: IsMulti extends true
            ? MutableRefObject<SelectInstance<SelectPickerOptionType<OptionValue>, true>>
            : MutableRefObject<SelectInstance<SelectPickerOptionType<OptionValue>>>
        /**
         * If true, the menu is aligned at the right end to prevent going outside of viewport
         * in case of menu being larger than the control
         *
         * @default false
         */
        shouldMenuAlignRight?: boolean
        /**
         * If true, the select spans to the max available width
         *
         * @default false
         */
        fullWidth?: boolean
        // TODO: Can make generic typing when adding multi select
        /**
         * If truthy, would show generic section error state as no options message
         */
        optionListError?: ServerErrors
        /**
         * Would reload the option list when called in case optionListError is present
         */
        reloadOptionList?: () => void
        /**
         * If true, the select picker creates the new option
         *
         * @default false
         */
        isCreatable?: boolean
        /**
         * If false, the no options message is not shown
         *
         * Note: Handling for the menu distortion needs to be handled explicitly in this case
         *
         * @default true
         */
        shouldShowNoOptionsMessage?: boolean
        /**
         * If true, the menu list and the dropdown indicator are hidden. Suitable for use cases like multi-inputs
         *
         * @default false
         */
        shouldHideMenu?: boolean
    } & (IsMulti extends true
        ? {
              isMulti: IsMulti | boolean
              multiSelectProps?: Partial<Pick<SelectProps<OptionValue, IsMulti>, 'customDisplayText'>> & {
                  /**
                   * If true, the group heading can be selected
                   *
                   * Only applicable for IsMulti: true
                   *
                   * @default false
                   */
                  isGroupHeadingSelectable?: boolean
                  /**
                   * Callback handler to check if the given selection is valid or not
                   */
                  getIsOptionValid?: (option: SelectPickerOptionType<OptionValue>) => boolean
              }
          }
        : {
              isMulti?: never
              multiSelectProps?: never
          })

// Doing like this, because of global export error GroupHeadingPropsDefinedProps
export type SelectPickerGroupHeadingProps<OptionValue> = GroupHeadingProps<SelectPickerOptionType<OptionValue>> & {
    isGroupHeadingSelectable: boolean
}

export interface FilterSelectPickerProps
    extends Required<
            Pick<SelectPickerProps<number | string, true>, 'options' | 'isDisabled' | 'placeholder' | 'isLoading'>
        >,
        Pick<
            SelectPickerProps<number | string, true>,
            | 'selectRef'
            | 'inputId'
            | 'menuPosition'
            | 'autoFocus'
            | 'shouldMenuAlignRight'
            | 'optionListError'
            | 'reloadOptionList'
            | 'getOptionValue'
            | 'isOptionDisabled'
        > {
    appliedFilterOptions: SelectPickerOptionType[]
    handleApplyFilter: (filtersToApply: SelectPickerOptionType<number | string>[]) => void
}

export type SelectPickerTextAreaProps = Omit<
    SelectPickerProps<string, false>,
    | 'selectRef'
    | 'inputValue'
    | 'onInputChange'
    | 'controlShouldRenderValue'
    | 'onKeyDown'
    | 'onCreateOption'
    | 'shouldRenderTextArea'
    | 'placeholder'
> &
    Pick<ResizableTagTextAreaProps, 'maxHeight' | 'minHeight' | 'refVar' | 'dependentRefs'>

export interface AsyncSelectProps
    extends Partial<
            Pick<
                FormFieldWrapperProps,
                | 'error'
                | 'layout'
                | 'label'
                | 'helperText'
                | 'warningText'
                | 'required'
                | 'fullWidth'
                | 'borderConfig'
                | 'borderRadiusConfig'
                | 'labelTippyCustomizedConfig'
                | 'labelTooltipConfig'
                | 'ariaLabel'
                | 'inputId'
            >
        >,
        AsyncProps<SelectPickerOptionType, boolean, GroupBase<SelectPickerOptionType>>,
        Partial<
            Pick<
                SelectPickerProps,
                'size' | 'menuSize' | 'variant' | 'shouldMenuAlignRight' | 'placeholder' | 'value' | 'isOptionDisabled'
            >
        > {
    getIsOptionValid?: (option: SelectPickerOptionType) => boolean
    isGroupHeadingSelectable?: boolean
    loadingOptions?: SelectPickerOptionType[]
}
