import { ButtonHTMLAttributes, ReactNode } from 'react'

import { ComponentSizeType } from '@Shared/constants'
import { IconBaseColorType } from '@Shared/types'

import { IconName } from '../Icon'

/**
 * Represents the properties for configuring the shape and behavior of a switch component.
 *
 * - When `shape` is `rounded`:
 *   - The switch will have a rounded appearance.
 *   - `iconName`, `iconColor`, and `indeterminate` are not applicable.
 *
 * - When `shape` is `square`:
 *   - The switch will have a square appearance.
 *   - `iconName` specifies the name of the icon to display.
 *   - `iconColor` allows customization of the icon's color in the active state.
 *   - `indeterminate` indicates whether the switch is in an indeterminate state, typically used for checkboxes to represent a mixed state.
 *     If `indeterminate` is true, the switch will not be fully checked or unchecked.
 */
type SwitchShapeProps =
    | {
          /**
           * The shape of the switch. Defaults to `rounded` if not specified.
           */
          shape?: 'rounded'

          /**
           * Icon name is not applicable for the `rounded` shape.
           */
          iconName?: never

          /**
           * Icon color is not applicable for the `rounded` shape.
           */
          iconColor?: never
          /**
           * Indicates whether the switch is in an indeterminate state.
           * This state is typically used for checkboxes to indicate a mixed state.
           * If true, the switch will not be fully checked or unchecked. Due this state alone we are keeping role as `checkbox` instead of `switch`.
           * This property is not applicable for the `square` shape.
           * @default false
           */
          indeterminate?: boolean
      }
    | {
          /**
           * The shape of the switch. Must be `square` to enable icon-related properties.
           */
          shape: 'square'

          /**
           * The name of the icon to display when the shape is `square`.
           */
          iconName: IconName

          /**
           * The color of the icon. If provided, this will override the default color in the active state.
           */
          iconColor?: IconBaseColorType
          indeterminate?: never
      }

/**
 * Represents the properties for the `Switch` component.
 */
export type DTSwitchProps = {
    /**
     * The ARIA label for the switch, used for accessibility purposes.
     */
    ariaLabel: string

    /**
     * Used in forms to identify the switch.
     */
    name: string

    /**
     * Provide if name generated through `getUniqueId`.
     */
    dataTestId?: string

    /**
     * The visual variant of the switch.
     *
     * @default `positive`
     */
    variant?: 'theme' | 'positive'

    /**
     * The size of the switch.
     * @default `ComponentSizeType.medium`
     */
    size?: Extract<ComponentSizeType, ComponentSizeType.medium | ComponentSizeType.small>

    /**
     * Callback function that is called when the switch state changes.
     * This function should handle the logic for toggling the switch.
     */
    onChange: ButtonHTMLAttributes<HTMLButtonElement>['onClick']

    /**
     * Indicates whether the switch is disabled.
     */
    isDisabled?: boolean

    /**
     * Indicates whether the switch is in a loading state.
     */
    isLoading?: boolean

    /**
     * Indicates whether the switch is currently checked (on).
     */
    isChecked: boolean

    /**
     * Optional tooltip content to display when hovering over the switch.
     *
     * @default undefined
     */
    tooltipContent?: ReactNode
    /**
     * Indicates whether the switch should be focused automatically when rendered.
     * @default false
     */
    autoFocus?: boolean
} & SwitchShapeProps
