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

import { OptionType } from '@Common/Types'
import { ComponentSizeType } from '@Shared/constants'
import { MutableRefObject, ReactElement, ReactNode } from 'react'
import { GroupBase, Props as ReactSelectProps, SelectInstance } from 'react-select'
import { CreatableProps } from 'react-select/creatable'

export interface SelectPickerOptionType extends OptionType<number | string | object, ReactNode> {
    /**
     * Description to be displayed for the option
     */
    description?: string
    /**
     * Icon at the start of the option
     */
    startIcon?: ReactElement
    /**
     * Icon at the end of the option
     */
    endIcon?: ReactElement
}

export enum SelectPickerVariantType {
    DEFAULT = 'default',
    BORDER_LESS = 'border-less',
}

type SelectProps = ReactSelectProps<SelectPickerOptionType, boolean, GroupBase<SelectPickerOptionType>>

export type SelectPickerProps = Pick<
    SelectProps,
    | 'name'
    | 'classNamePrefix'
    | 'options'
    | 'value'
    | 'onChange'
    | 'isSearchable'
    | 'isClearable'
    | 'isLoading'
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
> &
    Required<Pick<SelectProps, 'inputId'>> & {
        /**
         * Icon to be rendered in the control
         */
        icon?: ReactElement
        /**
         * Error message for the select
         */
        error?: ReactNode
        /**
         * Render function for the footer at the bottom of menu list. It is sticky by default
         */
        renderMenuListFooter?: () => ReactNode
        /**
         * Info text for the select, if any
         */
        helperText?: ReactNode
        /**
         * Label for the select. if required is added, the corresponding * is also added
         */
        label?: ReactNode
        /**
         * If true, the selected option icon is shown in the container.
         * startIcon has higher priority than endIcon.
         *
         * @default 'true'
         */
        showSelectedOptionIcon?: boolean
        /**
         * Height of the dropdown
         *
         * @default 'ComponentSizeType.medium'
         */
        size?: Extract<ComponentSizeType, ComponentSizeType.medium | ComponentSizeType.large>
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
        selectRef?: MutableRefObject<
            SelectInstance<SelectPickerOptionType> | SelectInstance<SelectPickerOptionType, true>
        >
    } & (
        | {
              isMulti?: never
              multiSelectProps?: never
          }
        | {
              isMulti: boolean
              multiSelectProps?: Pick<
                  CreatableProps<SelectPickerOptionType, true, GroupBase<SelectPickerOptionType>>,
                  'onCreateOption'
              > & {
                  /**
                   * If true, the select picker creates the new option
                   * Only applicable for isMulti: true
                   *
                   * @default false
                   */
                  isCreatable?: boolean
                  /**
                   * If true, the group heading can be selected
                   *
                   * Only applicable for isMulti: true
                   *
                   * @default false
                   */
                  isGroupHeadingSelectable?: boolean
                  /**
                   * Callback handler to check if the given selection is valid or not
                   */
                  getIsOptionValid?: (option: SelectPickerOptionType) => boolean
              }
          }
    ) &
    (
        | {
              /**
               * If true, custom options are rendered in the menuList component of react select
               *
               * Note: renderCustomOptions is required to be passed; renderMenuListFooter is also not called
               *
               * @default false
               */
              shouldRenderCustomOptions: boolean
              /**
               * Callback handler for custom options
               *
               * Imp Note: The menu open/close needs to handled by the consumer in this case
               */
              renderCustomOptions: () => ReactElement
          }
        | {
              shouldRenderCustomOptions?: never
              renderCustomOptions?: never
          }
    )
