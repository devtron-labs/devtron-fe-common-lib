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

import { TooltipProps } from '@Common/Tooltip'
import { IconsProps, SelectPickerOptionType } from '@Shared/Components'
import { ComponentSizeType } from '@Shared/constants'

type SegmentTooltipProps = Omit<
    TooltipProps,
    'alwaysShowTippyOnHover' | 'showOnTruncate' | 'shortcutKeyCombo' | 'placement'
>

export type SegmentType<T = string | number> = Pick<SelectPickerOptionType, 'value'> & {
    /**
     * If true, the segment will be in error state with error icon
     */
    isError?: boolean
    /**
     * If true, the segment will be in disabled state
     */
    isDisabled?: boolean
} & (
        | ({
              /**
               * Label for the segment
               *
               * Note: Either of label or icon is required
               */
              label: SelectPickerOptionType['label'] | T
              /**
               * Icon for the segment
               *
               * Note: Either of label or icon is required
               */
              icon?: IconsProps['name']
              /**
               * Tooltip props for the segment
               *
               * Note: Required if only icon is provided
               */
              tooltipProps?: SegmentTooltipProps
              ariaLabel?: never
          } & Pick<SelectPickerOptionType, 'label'>)
        | {
              label?: never
              tooltipProps: SegmentTooltipProps
              icon: IconsProps['name']
              /**
               * Aria label for the segment
               */
              ariaLabel: string
          }
    )

export type SegmentedControlProps<T = string | number> = {
    /**
     * List of segments to be displayed
     */
    segments: SegmentType<T>[]
    /**
     * Please make sure this is unique
     */
    name: string
    size?: Extract<ComponentSizeType, ComponentSizeType.xs | ComponentSizeType.small | ComponentSizeType.medium>
    fullWidth?: boolean
    disabled?: boolean
} & (
    | {
          value?: never
          /**
           * On change handler for the component
           */
          onChange?: (selectedSegment: SegmentType<T>) => void
      }
    | {
          /**
           * If defined, the component is controlled and onChange needs to be handled by the parent
           */
          value: SegmentType<T>['value']
          onChange: (selectedSegment: SegmentType<T>) => void
      }
)

export interface SegmentProps<T>
    extends Required<Pick<SegmentedControlProps<T>, 'name' | 'onChange' | 'fullWidth' | 'size' | 'disabled'>> {
    isSelected: boolean
    segment: SegmentType<T>
}
